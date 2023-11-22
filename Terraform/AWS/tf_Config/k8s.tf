
variable "access_key" {
  default = ""
}

variable "secret_key" {
  default = ""
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1"
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_vpc" "k8sawsvpc" {
  cidr_block = "10.0.0.0/16"

  enable_dns_support   = true
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.k8sawsvpc.id
}

resource "aws_subnet" "k8saws_subnet" {
  vpc_id                  = aws_vpc.k8sawsvpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-north-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name" = "subnet"
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/k8sawscluster" = "owned"
  }

  depends_on = [aws_vpc.k8sawsvpc]
}

resource "aws_subnet" "k8saws_subnet_2" {
  vpc_id                  = aws_vpc.k8sawsvpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-north-1b"
  map_public_ip_on_launch = true

   tags = {
    "Name" = "subnet2"
    "kubernetes.io/role/elb" = "1"
    "kubernetes.io/cluster/k8sawscluster" = "owned"
  }

  depends_on = [aws_vpc.k8sawsvpc]
}

resource "aws_eip" "nat" {
  vpc = true

  tags = {
    Name = "nat"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.k8saws_subnet.id

  tags = {
    Name = "nat"
  }

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.k8sawsvpc.id

  route  {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
  
  tags = {
  Name = "public"
  } 
}

resource "aws_route_table_association" "public_eu_north_1a"{
  subnet_id = aws_subnet.k8saws_subnet.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_eu_north_1b"{
  subnet_id = aws_subnet.k8saws_subnet_2.id
  route_table_id = aws_route_table.public.id
}






resource "aws_iam_role" "k8sawsiamcluster" {
  name = "k8sawsiamcluster"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "demo-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.k8sawsiamcluster.name
}

resource "aws_eks_cluster" "k8sawscluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.k8sawsiamcluster.arn
  vpc_config {
    subnet_ids = [aws_subnet.k8saws_subnet.id, aws_subnet.k8saws_subnet_2.id]
  }

 depends_on = [aws_iam_role_policy_attachment.demo-AmazonEKSClusterPolicy, aws_vpc.k8sawsvpc]
}

resource "aws_iam_role" "k8sawsiamnode" {
  name = "k8sawsiamnode"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.k8sawsiamnode.name
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.k8sawsiamnode.name
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.k8sawsiamnode.name
}

resource "aws_eks_node_group" "k8sawsiamnodegroup" {
  cluster_name    = aws_eks_cluster.k8sawscluster.name
  node_group_name = "k8sawsiamnodegroup"
  node_role_arn   = aws_iam_role.k8sawsiamnode.arn

  subnet_ids = [
    aws_subnet.k8saws_subnet.id,
    aws_subnet.k8saws_subnet_2.id
  ]

  capacity_type  = "ON_DEMAND"
  instance_types = ["t3.micro"]

  scaling_config {
    desired_size = 2
    max_size     = 2
    min_size     = 2
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.nodes-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.nodes-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.nodes-AmazonEC2ContainerRegistryReadOnly,
    aws_vpc.k8sawsvpc,
    aws_subnet.k8saws_subnet,
    aws_subnet.k8saws_subnet_2,
  ]
}

resource "aws_eks_addon" "vpc_cni" {
  cluster_name = aws_eks_cluster.k8sawscluster.name
  addon_name   = "vpc-cni"

  addon_version = "v1.14.1-eksbuild.1"
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = aws_eks_cluster.k8sawscluster.name
  addon_name   = "kube-proxy"

  addon_version = "v1.28.1-eksbuild.1"
}

resource "aws_eks_addon" "coredns" {
  cluster_name = aws_eks_cluster.k8sawscluster.name
  addon_name   = "coredns"

  addon_version = "v1.10.1-eksbuild.2"
}
