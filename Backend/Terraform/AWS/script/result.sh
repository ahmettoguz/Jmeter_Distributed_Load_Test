#!/bin/bash

# Aim of that script is to bring results to local

# # Check parameters.
# if [ $# -ne 4 ]; then
#   echo "Invalid parameters! use following."
#   echo "$0 <node count> <pod count> <thread count> <duration>"
#   exit 1
# fi

# node=$1
# pod=$2
# thread=$3
# duration=$4

# get time stamp
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Create result folder
mkdir -p ../../../userFile/result/test_${timestamp}

# variable for target directory
resultDir="../../../userFile/result/test_${timestamp}"

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