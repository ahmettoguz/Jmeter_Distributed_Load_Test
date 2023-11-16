
# Get connection with k8 cluster
cluster_id=$(doctl kubernetes cluster list --format "ID" --no-header)

az aks get-credentials --resource-group k8srg --name k8s

# # Up pods
# kubectl apply -f ../k8s_Config/k8s.yaml

# # Wait for the pod to be ready
# kubectl wait --for=condition=Ready pod -l jmeter_mode=master -n test --timeout=5m
# kubectl wait --for=condition=Ready pod -l jmeter_mode=slave -n test --timeout=5m
# echo "pods should be up."

# # Get slave pod IPs and save to slaveIps.txt
# kubectl get pods -n test -l jmeter_mode=slave -o jsonpath='{.items[*].status.podIP}' > ../k8s_Config/slaveIps.txt

# # Get master name
# masterName=$(kubectl get pods -n test -l jmeter_mode=master -o=jsonpath='{.items[0].metadata.name}')

# # Copy files to the jmeter-master container
# kubectl cp ../k8s_Config/slaveIps.txt -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"
# kubectl cp test.sh -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"
# kubectl cp ../jmx_Config/loadtest.jmx -n test "$masterName:/jmeter/apache-jmeter-5.1/bin"

# # Remove template ip txt
# if [ -e "../k8s_Config/slaveIps.txt" ]; then
#     rm ../k8s_Config/slaveIps.txt
# fi

# # Move test sh and run test
# kubectl exec ${masterName} -n test -- /bin/bash -c 'cd /jmeter/apache-jmeter-5.1/bin && chmod +x test.sh && ./test.sh'

echo "Success"