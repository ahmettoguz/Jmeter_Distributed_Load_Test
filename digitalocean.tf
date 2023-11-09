variable "do_token" {}

terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.32.0"
    }
  }
}

provider "digitalocean" {
  token = "dop_v1_f863177f79afca079f45d5890f936eeb9541647ce0226bf02a02b04588ff6422"
}

resource "digitalocean_kubernetes_cluster" "my_k8s" {
  count = 1
  name = "my_k8s"
  region = "FRA1"
  version = "1.28.2-do.0"
  node_pool {
    name = "my_node_pool"
    size = "s-2vcpu-2gb"
    node_count = 2
  }
}
