#!/bin/bash

# Aim of that script is to generate file that store token.

# Check parameters.
if [ $# -ne 5 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <api key> <service principle id> <service principle password> <access_key> <secret_key>"
  exit 1
fi

apiKey=$1
app_id=$2
app_secret=$3
access_key=$4
secret_key=$5

# Write file.
cat > ./DigitalOcean/tf_Config/terraform.tfvars <<EOL 
do_token = "$apiKey"
EOL

# Write file.
cat > ./Azure/tf_Config/terraform.tfvars <<EOL 
aks_service_principal_app_id = "$app_id"
aks_service_principal_client_secret = "$app_secret"
EOL

# Write file.
cat > ./AWS/tf_Config/terraform.tfvars <<EOL 
access_key = "$access_key"
secret_key = "$secret_key"
EOL

# Give output.
echo "The token variables have been set."
echo "Success"