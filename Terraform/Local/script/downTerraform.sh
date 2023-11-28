#!/bin/bash

# For minikube also run down Cluster.sh
bash downCluster.sh

# Aim of that script is to de-allocate resources. Destroy k8s infrastructure with terraform.
if ! minikube stop; then
    echo "Pods failed to destroy."
    echo "Fail"
    exit 1
fi

echo "k8s cluster (nodes, cluster) destroyed."
echo "Success"
