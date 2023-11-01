#!/bin/bash

# Remove file
rm command.sh

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result.jtl ./result.jtl

# Write 200 status result in txt
rm summary.txt
total_lines=$(wc -l < result.jtl)
request_200_count=$(grep -o 'Request,200,' result.jtl | wc -l)
result=$(echo "scale=2; ($total_lines - 1) / $request_200_count" | bc)
echo -e "Pass / Total\n$request_200_count / $total_lines" > summary.txt

# Down pods
kubectl delete -f k8.yaml

# # Delete pods (if previous step is failed.)
# kubectl delete deployments --all -n test