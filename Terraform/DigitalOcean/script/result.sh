#!/bin/bash

# get time stamp
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Create result folder
mkdir -p ../results/test_${timestamp}

# variable for target directory
resultDir="../results/test_${timestamp}"

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result.jtl $resultDir/result.jtl
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/jmeter.log $resultDir/jmeter.log

# Write summary file
echo "Results saved to: $resultDir"

total_lines=$(wc -l < $resultDir/result.jtl)
if [ "$total_lines" -ne 0 ]; then
  total_lines=$((total_lines - 1))
fi

request_200_count=$(grep -o 'Request,200,' $resultDir/result.jtl | wc -l)
result=$(echo "scale=2; $total_lines / $request_200_count" | bc)

echo 
echo "Pass / Total" > $resultDir/summary.txt
echo "$request_200_count / $total_lines" >> $resultDir/summary.txt

# Write also jmeter.log summary
echo >> $resultDir/summary.txt
grep 'summary =' $resultDir/jmeter.log >> $resultDir/summary.txt

# Display summary results
echo 
echo "$(cat $resultDir/summary.txt)"
