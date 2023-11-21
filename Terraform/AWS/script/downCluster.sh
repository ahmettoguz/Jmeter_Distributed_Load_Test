#!/bin/bash

# Aim of that script is to destroy pods.
if ! kubectl delete -f ../k8s_Config/k8s.yaml --insecure-skip-tls-verify; then
    echo "Pods failed to destroy."
    echo "Fail"
    exit 1
fi

echo "Cluster (pods) are destroyed."
echo "Success"
