#!/bin/bash

# Aim of that script is to bring results to local

# get time stamp
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Create result folder
mkdir -p ../results/test_${timestamp}

# variable for target directory
resultDir="../results/test_${timestamp}"

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result $resultDir/result
# kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result/* $resultDir/

# Write summary file
echo "Results saved to: $resultDir"

# Write jmeter.log summary
grep 'summary =' $resultDir/result/jmeter.log > $resultDir/result/summary.txt

# Display summary results
echo "$(cat $resultDir/result/summary.txt)"

echo "Results saved."
echo "Success"