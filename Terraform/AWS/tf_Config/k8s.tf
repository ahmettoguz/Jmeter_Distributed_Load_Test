
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

resource "aws_vpc" "k8saws_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "k8saws_subnet" {
  vpc_id                  = aws_vpc.k8saws_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-north-1a"
}

resource "aws_subnet" "k8saws_subnet_2" {
  vpc_id                  = aws_vpc.k8saws_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-north-1b"
}

resource "aws_security_group" "k8saws_security_group" {
  vpc_id = aws_vpc.k8saws_vpc.id
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

resource "aws_eks_cluster" "k8saws_cluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.k8sawsiamcluster.arn
  vpc_config {
    subnet_ids = [aws_subnet.k8saws_subnet.id, aws_subnet.k8saws_subnet_2.id]
  }

 depends_on = [aws_iam_role_policy_attachment.demo-AmazonEKSClusterPolicy]
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
  cluster_name    = aws_eks_cluster.k8saws_cluster.name
  node_group_name = "k8sawsiamnodegroup"
  node_role_arn   = aws_iam_role.k8sawsiamnode.arn

  subnet_ids = [
    aws_subnet.k8saws_subnet.id,
    aws_subnet.k8saws_subnet_2.id
  ]

  iam_role_attach_cni_policy = true
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
  ]
}
