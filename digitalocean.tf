provider "digitalocean" {
  token = "dop_v1_3ef31cd0f18780b76b79b29fade6fbd7f4c87f2a921d0eb254cb92204de3ffd3"
}

resource "digitalocean_kubernetes_cluster" "my_k8s" {
  name = "my-k8s-cluster"
  region = "FRA1"
  version = "1.28.2-do.0"
  node_pool {
    name = "my_node_pool"
    size = "s-2vcpu-2gb"
    node_count = 2
  }
}

output "kubeconfig" {
  value = digitalocean_kubernetes_cluster.k8s.kubeconfig
}