# Get connection with k8 cluster

cluster_id=$(doctl kubernetes cluster list --format "ID" --no-header)
sudo doctl kubernetes cluster kubeconfig save "$cluster_id"

