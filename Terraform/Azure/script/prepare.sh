#!/bin/bash

# Aim of that script is to generate terraform plan and k8s cluster.

# Check parameters.
if [ $# -ne 2 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <node count> <pod count>"
  exit 1
fi

node=$1
pod=$2

# Dispay counts
echo "Node count: $node"
echo "Pod count: $pod"

# Prepare terraform file
echo '
variable "aks_service_principal_app_id" {
  default = ""
}

variable "aks_service_principal_client_secret" {
  default = ""
}

terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.80.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  location = "Germany West Central"
  name     = "k8srg"
}

resource "azurerm_kubernetes_cluster" "k8s" {
  depends_on = [azurerm_resource_group.rg] 
  location            = azurerm_resource_group.rg.location
  name                = "k8s"
  resource_group_name = azurerm_resource_group.rg.name

  dns_prefix          = "k8s"
  tags                = {
    Environment = "Development"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = '$node'
  }
  linux_profile {
    admin_username = "ahmet"

    ssh_key {
      key_data = file("~/.ssh/id_rsa.pub")
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
  service_principal {
    client_id     = var.aks_service_principal_app_id
    client_secret = var.aks_service_principal_client_secret
  }
}
' > ../tf_Config/k8s.tf
# -------------------------------------------------------------

# Prepare k8s.yaml file
echo '
apiVersion: v1
kind: Namespace
metadata:
  name: test

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: jmeter-master
  namespace: test
  labels:
    jmeter_mode: master
spec:
  replicas: 1
  selector:
    matchLabels:
      jmeter_mode: master
  template:
    metadata:
      labels:
        jmeter_mode: master
    spec:
      containers:
      - name: jmmaster
        image: crisssercedocker/jmeter-master
        # image: mnazim1541/jmmaster:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 60000
        command: ["/bin/sh", "-c"]
        args: ["sleep infinity"]
      imagePullSecrets:
      - name: registrypullsecret
        
---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: jmeter-slaves
  namespace: test
  labels:
    jmeter_mode: slave
spec:
  replicas: '$pod'
  selector:
    matchLabels:
      jmeter_mode: slave
  template:
    metadata:
      labels:
        jmeter_mode: slave
    spec:
      containers:
      - name: jmslave
        # image: mnazim1541/jmslave:latest
        image: crisssercedocker/jmeter-slave
        imagePullPolicy: IfNotPresent
      imagePullSecrets:
      - name: registrypullsecret   
' > ../k8s_Config/k8s.yaml
# -------------------------------------------------------------

echo "Terraform and kubernetes cluster files created."
echo "Success"