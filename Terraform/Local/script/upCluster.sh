#!/bin/bash

# Aim of that script is to create pods.

# Get connection with k8 cluster and save config file.
kubectl config use-context minikube

# Up pods
kubectl apply -f ../k8s_Config/k8s.yaml

# wait until 2 min to up pods(5 * 24)
max_duration=24
interval=5
time_check=0

while true; do
    if
        kubectl --for=condition=Ready pod -l jmeter_mode=master -n test && \
        kubectl --for=condition=Ready pod -l jmeter_mode=slave -n test
    then
        break
    fi

    ((time_check++))
    sleep $interval

    if [ $time_check -ge $max_duration ]; then
        echo "Pods failed to start."
        echo "Fail"
        exit 1
    fi
done

echo "Pods are up."
echo "Success"