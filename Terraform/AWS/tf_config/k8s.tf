
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

resource "aws_security_group" "k8saws_security_group" {
  vpc_id = aws_vpc.k8saws_vpc.id
}

resource "aws_instance" "k8saws_instance" {
  count           = 2
  ami             = "ami-0c55b159cbfafe1f0"
  instance_type   = "t2.micro"
  subnet_id       = aws_subnet.k8saws_subnet.id
  security_groups  = [aws_security_group.k8saws_security_group.id]

  tags = {
    Name = "k8saws-instance-${count.index + 1}"
  }
}

resource "aws_eks_cluster" "k8saws_cluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = [aws_subnet.k8saws_subnet.id]
  }

  depends_on = [aws_instance.k8saws_instance]  # worker nodes'dan önce EC2 instances'ları oluşturulsun
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
