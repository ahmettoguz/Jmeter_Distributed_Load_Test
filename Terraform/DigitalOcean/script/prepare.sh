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
variable "do_token" {
  default = ""
}

terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "2.32.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_kubernetes_cluster" "k8sdo" {
  name = "k8sdo"
  region = "fra1"
  version = "1.28.2-do.0"

  node_pool {
    name = "nodepooldo"
    size = "s-2vcpu-2gb"
    node_count = '$node'
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