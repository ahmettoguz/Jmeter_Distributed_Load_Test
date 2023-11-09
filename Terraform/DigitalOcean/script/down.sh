#!/bin/bash

# Down pods
# kubectl delete -f ../k8s_Config/k8s.yaml

# # Delete pods (if previous step is failed.)
# kubectl delete deployments --all -n test

# Destroy cluster with terraform
terraform -chdir=../tf_Config destroy