
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
    subnet_ids = ["subnet-0b862071f01cc12cc","subnet-04d4b4c425dc7e37c"]
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
  cluster_name    = aws_eks_cluster.k8sawscluster.name
  node_group_name = "k8sawsiamnodegroup"
  node_role_arn   = aws_iam_role.k8sawsiamnode.arn

  subnet_ids = ["subnet-0b862071f01cc12cc","subnet-04d4b4c425dc7e37c"]

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
