#!/bin/bash

# Aim of that script is to allocate local minikube resources.
minikube start --driver=docker --force

status=$(minikube status | grep "Running")

if [ -z "$status" ]; then
    echo "Minikube cannot started."
    echo "Fail"
    exit 1
fi

echo "K8s cluster created."
echo "Success"