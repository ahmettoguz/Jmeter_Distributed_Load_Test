#!/bin/bash

# Aim of that script is to generate file that store token.

# Check parameters.
if [ $# -ne 2 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <access_key> <secret_key>"
  exit 1
fi

access_key=$1
secret_key=$2

# Write file.
cat > ../tf_Config/terraform.tfvars <<EOL 
access_key = "$access_key"
secret_key = "$secret_key"
EOL

# Give output.
echo "The token variables have been set."
echo "Success"