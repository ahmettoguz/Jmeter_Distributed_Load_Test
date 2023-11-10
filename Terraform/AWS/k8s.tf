variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "region" {
  default = "us-west-1"
}
variable "cluster_name" {
  default = "k8s"
}

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
}

terraform {
  required_version = ">= 0.14, < 0.16"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.21"

  node_groups = {
    eks_nodes = {
      desired_capacity = 2

      instance_type = "t3.micro"
    }
  }
}
