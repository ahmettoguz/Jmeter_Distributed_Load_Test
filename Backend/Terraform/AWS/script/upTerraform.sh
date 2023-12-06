#!/bin/bash

# Aim of that script is to allocate resources. Create k8s infrastructure with terraform.

# Init terraform and check status
terraform -chdir=../tf_Config init
if [ $? -ne 0 ]; then
    echo "Terraform init failed."
    echo "Fail"
    exit 1
fi

# Apply terraform and check status
terraform -chdir=../tf_Config apply -auto-approve
if [ $? -ne 0 ]; then
    echo "Terraform apply failed."
    echo "Fail"
    exit 1
fi

echo "K8s cluster created."
echo "Success"