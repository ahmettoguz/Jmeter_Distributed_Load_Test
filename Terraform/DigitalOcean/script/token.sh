#!/bin/bash

# Aim of that script is to generate file that store token.

# Check parameters.
if [ $# -ne 1 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <api key>"
  exit 1
fi

apiKey=$1

# Write file.
cat > ../tf_Config/terraform.tfvars <<EOL 
do_token = "$apiKey"
EOL

# Give output.
echo "The token variable have been set."
echo "Success"