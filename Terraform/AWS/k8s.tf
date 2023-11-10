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

module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "19.19.0"  # Kullanılabilir olan en son sürümü belirtin
  cluster_name    = var.cluster_name
  cluster_version = "1.21"

    kube_data_auth_enabled = false
    kube_exec_auth_enabled = true
}


module "eks_node_group" {
  cluster_name       = "k8s"

  instance_types     = "t3.micro"
  desired_size       = 2
}


resource "aws_eks_node_group" "example" {
  source = "./"
  cluster_name    = "k8s"
  node_group_name = "k8spool"
 
  scaling_config {
    desired_size = 2
 }
}