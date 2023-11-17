variable "do_token" {
  default = ""
}

terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.32.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_kubernetes_cluster" "k8sdo" {
  name = "k8sdo"
  region = "fra1"
  version = "1.28.2-do.0"

  node_pool {
    name = "nodepooldo"
    size = "s-2vcpu-2gb"
    node_count = 1
  }
}
