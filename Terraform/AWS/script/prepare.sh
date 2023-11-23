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
############################################################################################################# Variables
variable "access_key" {
  default = ""
}

variable "secret_key" {
  default = ""
}

############################################################################################################# Provider
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

############################################################################################################# Cluster IAM Role
resource "aws_iam_role" "k8sawsiamcluster" {
  name = "k8sawsiamcluster"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "demo-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.k8sawsiamcluster.name
}

############################################################################################################# Cluster
resource "aws_eks_cluster" "k8sawscluster" {
  name     = "k8saws"
  role_arn = aws_iam_role.k8sawsiamcluster.arn
  vpc_config {
    subnet_ids = ["subnet-0b862071f01cc12cc","subnet-04d4b4c425dc7e37c"]
  }

 depends_on = [aws_iam_role_policy_attachment.demo-AmazonEKSClusterPolicy]
}

############################################################################################################# NodeGroup IAM Role
resource "aws_iam_role" "k8sawsiamnode" {
  name = "k8sawsiamnode"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.k8sawsiamnode.name
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.k8sawsiamnode.name
}

resource "aws_iam_role_policy_attachment" "nodes-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.k8sawsiamnode.name
}

############################################################################################################# Node Group
resource "aws_eks_node_group" "k8sawsiamnodegroup" {
  cluster_name    = aws_eks_cluster.k8sawscluster.name
  node_group_name = "k8sawsiamnodegroup"
  node_role_arn   = aws_iam_role.k8sawsiamnode.arn

  subnet_ids = ["subnet-0b862071f01cc12cc","subnet-04d4b4c425dc7e37c"]

  capacity_type  = "ON_DEMAND"
  instance_types = ["t3.micro"]

  scaling_config {
    desired_size = '$node'
    max_size     = '$node'
    min_size     = '$node'
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.nodes-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.nodes-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.nodes-AmazonEC2ContainerRegistryReadOnly,
  ]
}

############################################################################################################# Add Ons
resource "aws_eks_addon" "vpc_cni" {
  cluster_name = aws_eks_cluster.k8sawscluster.name
  addon_name   = "vpc-cni"

  addon_version = "v1.14.1-eksbuild.1"
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name = aws_eks_cluster.k8sawscluster.name
  addon_name   = "kube-proxy"

  addon_version = "v1.28.1-eksbuild.1"
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