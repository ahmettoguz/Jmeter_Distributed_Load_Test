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

# Prepare terraform file
echo '
variable "access_key" {
  default = ""
}

variable "secret_key" {
  default = ""
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "eu-north-1"
  access_key = var.access_key
  secret_key = var.secret_key
}

resource "aws_vpc" "k8saws_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "k8saws_subnet" {
  vpc_id                  = aws_vpc.k8saws_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-north-1a"
}

resource "aws_subnet" "k8saws_subnet_2" {
  vpc_id                  = aws_vpc.k8saws_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-north-1b"
}

resource "aws_security_group" "k8saws_security_group" {
  vpc_id = aws_vpc.k8saws_vpc.id
}

resource "aws_instance" "k8saws_instance" {
  count           = 2
  ami             = "ami-0416c18e75bd69567"
  instance_type   = "t3.micro"
  subnet_id       = aws_subnet.k8saws_subnet.id
  security_groups  = [aws_security_group.k8saws_security_group.id]

  tags = {
    Name = "k8saws-instance-${count.index + 1}"
  }
}

resource "aws_eks_cluster" "k8saws_cluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.eks_cluster.arn
  vpc_config {
    subnet_ids = [aws_subnet.k8saws_subnet.id, aws_subnet.k8saws_subnet_2.id]
  }

  depends_on = [aws_instance.k8saws_instance]  # worker nodes'dan önce EC2 instances'ları oluşturulsun
}

resource "aws_iam_role" "eks_cluster" {
  name = "eks-cluster"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "eks.amazonaws.com",
        },
      },
    ],
  })
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