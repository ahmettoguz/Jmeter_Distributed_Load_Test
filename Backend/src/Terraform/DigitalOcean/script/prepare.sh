#!/bin/bash

# Aim of that script is to generate terraform plan and k8s cluster.

# Check parameters.
if [ $# -ne 4 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <node count> <pod count> <thread count> <duration>"
  exit 1
fi

node=$1
pod=$2
thread=$3
duration=$4

# Dispay counts
echo "Node count: $node"
echo "Pod count: $pod"
echo "Thread count: $thread"
echo "Duration: $duration"

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
        image: ahmettoguz/jmeter-master
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 60000
        command: ["/bin/sh", "-c"]
        # env:
        # - name: JVM_ARGS
        #   value: "-Xms512m -Xmx1g" # Set up heap size
        args: ["sleep infinity"]
        
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
        image: ahmettoguz/jmeter-slave
        imagePullPolicy: IfNotPresent  
        # env:
        # - name: JVM_ARGS
        #   value: "-Xms512m -Xmx1g" # Set up heap size
' > ../k8s_Config/k8s.yaml
# -------------------------------------------------------------

# in jmx file change thread count
if grep -q '<stringProp name="ThreadGroup.num_threads">.*<\/stringProp>' ../jmx_Config/loadtest.jmx; then
  sed -i 's|<stringProp name="ThreadGroup.num_threads">.*</stringProp>|<stringProp name="ThreadGroup.num_threads">'$thread'</stringProp>|' ../jmx_Config/loadtest.jmx
else
    echo "Fail"
    exit 1
fi

# in jmx file change duration boolean
if grep -q '<boolProp name="ThreadGroup.scheduler">.*</boolProp>' ../jmx_Config/loadtest.jmx; then
  sed -i 's|<boolProp name="ThreadGroup.scheduler">.*</boolProp>|<boolProp name="ThreadGroup.scheduler">true</boolProp>|g' ../jmx_Config/loadtest.jmx
else
    echo "Fail"
    exit 1
fi

# in jmx file change duration
if grep -q '<boolProp name="ThreadGroup.scheduler">.*</boolProp>' ../jmx_Config/loadtest.jmx; then
  sed -i 's|<stringProp name="ThreadGroup.duration">.*</stringProp>|<stringProp name="ThreadGroup.duration">'$duration'</stringProp>|g' ../jmx_Config/loadtest.jmx
else
    echo "Fail"
    exit 1
fi

echo "Terraform and kubernetes cluster files created."
echo "Success"