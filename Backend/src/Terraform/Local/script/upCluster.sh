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
         kubectl wait --for=condition=Ready pod -l jmeter_mode=master -n test --timeout=2m && \
         kubectl wait --for=condition=Ready pod -l jmeter_mode=slave -n test --timeout=2m
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

echo "Checking pod connection..."

# Get master name for following operations.
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Get slave name for following operation.
slaveName=$(kubectl get pods -n test -l jmeter_mode=slave -o=jsonpath='{.items[0].metadata.name}')

# Get IP address of the slave pod
slaveIP=$(kubectl get pod $slaveName -n test -o=jsonpath='{.status.podIP}')

# Check connectivity between master pod and google
# wait until 2 min to check connectivity of pods(5 * 24)
max_duration=24
interval=5
time_check=0

while true; do
    kubectl exec -it $masterName -n test -- ping -c 3 google.com > /dev/null 2>&1
        
    if [ $? -eq 0 ]; then
        echo "Ping to google.com from master pod was successful."
        break
    fi

    ((time_check++))
    sleep $interval

    if [ $time_check -ge $max_duration ]; then
        echo "Unable to ping google.com from master pod. Check your internet connection."
        echo "Fail"
        exit 1
    fi
done

# Check connectivity between master pod and slave
# wait until 2 min to check connectivity of pods(5 * 24)
max_duration=24
interval=5
time_check=0

while true; do
    kubectl exec -it $masterName -n test -- ping -c 3 $slaveIP > /dev/null 2>&1
        
    if [ $? -eq 0 ]; then
        echo "Ping from master pod to slave pod $slaveName ($slaveIP) was successful."
        break
    fi

    ((time_check++))
    sleep $interval

    if [ $time_check -ge $max_duration ]; then
        echo "Unable to ping slave pod $slaveName ($slaveIP) from master pod. Check your connectivity."
        echo "Fail"
        exit 1
    fi
done

echo "Pods up and connectin is established."
echo "Success"