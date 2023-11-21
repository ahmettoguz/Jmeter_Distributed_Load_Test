
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


resource "aws_eks_cluster" "k8saws_cluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = [aws_subnet.k8saws_subnet.id, aws_subnet.k8saws_subnet_2.id]
  }

  depends_on = [aws_instance.k8saws_instance]  # worker nodes'dan önce EC2 instances'ları oluşturulsun
}
