#!/bin/bash

# Remove file
rm command.txt

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result.jtl ./result.jtl

# Down pods
kubectl delete -f k8.yaml

# # Delete pods (if previous step is failed.)
# kubectl delete deployments --all -n test