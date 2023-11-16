#!/bin/bash

# Aim of that script is to generate file that store token.

# Check parameters.
if [ $# -ne 2 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <service principle id> <service principle password>"
  exit 1
fi

app_id=$1
app_secret=$2

# Write file.
echo 'aks_service_principal_app_id = '$app_id'
aks_service_principal_client_secret = '$app_secret > ../tf_Config/terraform.tfvars

# Give output.
echo "The token variables have been set."
echo "Success"