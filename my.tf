  provider "digitalocean" {
  version = "1.22.2"
}

resource "digitalocean_kubernetes_cluster" "my_k8s" {
  name = "my_k8ss"
  region = "fra1"
  version = "1.28.2-do.0"

  node_pool {
    name = "my_node_pool"
    size = "s-2vcpu-2gb"
    node_count = 2
  }
}
