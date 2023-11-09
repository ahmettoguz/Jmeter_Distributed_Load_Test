# Create k8s infrastructure with terraform
terraform -chdir=../tf_Config init
terraform -chdir=../tf_Config apply -auto-approve

