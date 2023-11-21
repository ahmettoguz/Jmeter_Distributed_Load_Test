#!/bin/bash

# Aim of that script is to de-allocate resources. Destroy k8s infrastructure with terraform.
if ! terraform -chdir=../tf_Config destroy -auto-approve; then
    echo "Pods failed to destroy."
    echo "Fail"
    exit 1
fi

echo "k8s cluster (nodes, cluster) destroyed."
echo "Success"
