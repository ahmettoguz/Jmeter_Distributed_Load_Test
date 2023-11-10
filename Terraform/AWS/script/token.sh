#!/bin/bash

# Set api token of digital ocean to environment variable
export TF_VAR_aws_access_key=$1 
export TF_VAR_aws_secret_key=$2 

# Give permissions to files
chmod +x prepare.sh up.sh result.sh down.sh
