#!/bin/bash

# Aim of that script is to create test environment and run test.

# Get slave pod IPs and save to slaveIps.txt
kubectl get pods -n test -l jmeter_mode=slave -o jsonpath='{.items[*].status.podIP}' > ../k8s_Config/slaveIps.txt --insecure-skip-tls-verify

# Get master name for following operations.
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Copy files to the jmeter-master container.
kubectl cp ../k8s_Config/slaveIps.txt -n test "$masterName:/jmeter/apache-jmeter-5.1/bin" --insecure-skip-tls-verifys
kubectl cp test.sh -n test "$masterName:/jmeter/apache-jmeter-5.1/bin" --insecure-skip-tls-verify
kubectl cp ../jmx_Config/loadtest.jmx -n test "$masterName:/jmeter/apache-jmeter-5.1/bin" --insecure-skip-tls-verify

# Remove template ip txt
# if [ -e "../k8s_Config/slaveIps.txt" ]; then
#     rm ../k8s_Config/slaveIps.txt
# fi

# Move test sh and run test
if ! kubectl exec ${masterName} -n test -- /bin/bash -c 'cd /jmeter/apache-jmeter-5.1/bin && chmod +x test.sh && ./test.sh' --insecure-skip-tls-verify; then
    echo "Failed to execute the test script."
    echo "Fail"
    exit 1
fi
echo "Test run is completed."
echo "Success"