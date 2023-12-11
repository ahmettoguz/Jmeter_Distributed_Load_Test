#!/bin/bash

# Aim of that script is to bring results to local

# Check parameters.
if [ $# -ne 1 ]; then
  echo "Invalid parameters! use following."
  echo "$0 <testId>"
  exit 1
fi

testId=$1

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Create result folder
mkdir -p ../../../storage/result/${testId}

# variable for target directory
resultDir="../../../storage/result/${testId}"

# Copy results
kubectl cp -n test $masterName:/jmeter/apache-jmeter-5.1/bin/result $resultDir

# Write summary file
echo "Results saved to: $resultDir"

# Write jmeter.log summary
grep 'summary =' $resultDir/jmeter.log | sed 's/^[^=]*=//g' | sed '/^[[:space:]]*[0-9]/!b;n;c\' > $resultDir/summary.txt

# Display summary results
echo "$(cat $resultDir/summary.txt)"

echo "Results saved."
echo "Success"