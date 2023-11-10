#!/bin/bash

# Set api token of digital ocean to environment variable
export TF_VAR_do_token=$1 

# Give permissions to files
chmod +x prepare.sh up.sh result.sh down.sh
