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
}

data "aws_vpcs" "selected_vpc" {
  ids = ["vpc-0231b5d0f3ef53955"]  # Seçilen VPC ID'si
}

data "aws_subnet" "selected_subnets" {
  for_each = {
    for idx, subnet_id in ["subnet-0eccfda288b9ffa3b", "subnet-0d934172dfd340e5a", "subnet-0545ca12b0f614088"] : idx => subnet_id
  }
  ids = values(each.value)
}

resource "aws_eks_cluster" "my_cluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = [for subnet in data.aws_subnet.selected_subnets.values : subnet.id]
  }
}

resource "aws_iam_role" "eks_cluster" {
  name = "eks-cluster"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "eks.amazonaws.com",
        },
      },
    ],
  })
}