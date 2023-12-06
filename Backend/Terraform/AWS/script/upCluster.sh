#!/bin/bash

# Aim of that script is to create pods.

# Get connection with k8 cluster and save config file.
aws eks --region eu-north-1 update-kubeconfig --name k8saws --no-verify-ssl

# Up pods
kubectl apply -f ../k8s_Config/k8s.yaml --insecure-skip-tls-verify

# Wait for the pod to be ready.
if
    ! kubectl wait --for=condition=Ready pod -l jmeter_mode=master -n test --timeout=2m --insecure-skip-tls-verify || \
    ! kubectl wait --for=condition=Ready pod -l jmeter_mode=slave -n test --timeout=2m --insecure-skip-tls-verify
then
    echo "Pods failed to start."
    echo "Fail"
    exit 1
fi
echo "Pods are up."
echo "Success"