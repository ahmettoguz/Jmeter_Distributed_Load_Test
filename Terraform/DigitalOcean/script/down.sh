#!/bin/bash

# Down pods
kubectl delete -f ../k8s_Config/k8s.yaml

# Destroy cluster with terraform
terraform -chdir=../tf_Config destroy