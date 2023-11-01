#!/bin/bash

# Up pod
kubectl apply -f k8.yaml

# Wait for the pod to be ready
kubectl wait --for=condition=Ready pod -l jmeter_mode=master -n test
kubectl wait --for=condition=Ready pod -l jmeter_mode=slave -n test

# Get master name
masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# Get slave pod IPs and save to slaveIps.txt
kubectl get pods -n test -l jmeter_mode=slave -o jsonpath='{.items[*].status.podIP}' > slaveIps.txt

# Copy files to the jmeter-master container
kubectl cp slaveIps.txt -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"
kubectl cp test.sh -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"
kubectl cp loadtest.jmx -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"

# Remove template ip txt
if [ -e "slaveIps.txt" ]; then
    rm slaveIps.txt
fi

# Remove previous results
if [ -e "result.jtl" ]; then
    rm result.jtl
fi
if [ -e "jmeter.log" ]; then
    rm jmeter.log
fi

# Generate run.sh
echo -e "#!/bin/bash\nkubectl exec ${masterName} -n test -- /bin/bash -c 'cd /jmeter/apache-jmeter-5.1/bin && chmod +x test.sh && ./test.sh'" > run.sh
chmod 777 run.sh

# for windows
# echo "kubectl exec ${masterName} -n test -- /bin/bash -c 'cd /jmeter/apache-jmeter-5.1/bin && chmod +x test.sh && ./test.sh'" > run.txt