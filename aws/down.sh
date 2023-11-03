#!/bin/bash

# Down pods
kubectl delete -f k8.yaml

# # Delete pods (if previous step is failed.)
# kubectl delete deployments --all -n test