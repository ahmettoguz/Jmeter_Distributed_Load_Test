#!/bin/bash

# Aim of that script is to create pods.

# Get connection with k8 cluster and save config file.
az aks get-credentials --resource-group k8srg --name k8saz

# Up pods
kubectl apply -f ../k8s_Config/k8s.yaml

# Wait for the pod to be ready.
if
    ! kubectl wait --for=condition=Ready pod -l jmeter_mode=master -n test --timeout=2m || \
    ! kubectl wait --for=condition=Ready pod -l jmeter_mode=slave -n test --timeout=2m
then
    echo "Pods failed to start."
    echo "Fail"
    exit 1
fi
echo "Pods are up."
echo "Success"