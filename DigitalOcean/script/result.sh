#!/bin/bash

timestamp=$(date +"%Y-%m-%d_%H-%M-%S_%3N")

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Create result folder
mkdir -p ../results/result_${timestamp}

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result.jtl ../results/result_${timestamp}/result.jtl
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/jmeter.log ../results/result_${timestamp}/jmeter.log


total_lines=$(wc -l < result.jtl)
request_200_count=$(grep -o 'Request,200,' result.jtl | wc -l)
result=$(echo "scale=2; ($total_lines - 1) / $request_200_count" | bc)

echo -e "Pass / Total\n$request_200_count / $((total_lines - 1))" > ../results/result_${timestamp}/summary.txt

# Write also jmeter.log summary
echo >> ../results/result_${timestamp}/summary.txt
grep 'summary =' jmeter.log >> ../results/result_${timestamp}/summary.txt

# Display summary results
echo -e "\n$(cat summary.txt)\n"
