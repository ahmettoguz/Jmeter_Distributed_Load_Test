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
  source             = "."
  subnet_ids         = module.this.enabled ? module.subnets.public_subnet_ids : ["filler_string_for_enabled_is_false"]
  cluster_name       = module.this.enabled ? module.eks_cluster.eks_cluster_id : "disabled"

  instance_types     = "t3.micro"
  desired_size       = 2
}
