#!/bin/bash

# Get slave pod IPs and save to slaveIps.txt
kubectl get pods -n test -l jmeter_mode=slave -o jsonpath='{.items[*].status.podIP}' > slaveIps.txt

# Copy files to the jmeter-master container
kubectl cp slaveIps.txt -n test jmeter-master-89bcf49cb-vl79m:/jmeter/apache-jmeter-5.1/bin
kubectl cp test.sh -n test jmeter-master-89bcf49cb-vl79m:/jmeter/apache-jmeter-5.1/bin
kubectl cp loadtest.jmx -n test jmeter-master-89bcf49cb-vl79m:/jmeter/apache-jmeter-5.1/bin

rm slaveIps.txt

# jmeter-master konteyner'ında test.sh scriptini çalıştır
kubectl exec -it jmeter-master-89bcf49cb-vl79m -n test -- /bin/bash -c 'cd /jmeter/apache-jmeter-5.1/bin && chmod +x test.sh && ./test.sh'

# result.jtl dosyasını kopyala
kubectl cp -n test jmeter-master-89bcf49cb-vl79m:/jmeter/apache-jmeter-5.1/bin/result.jtl ./result.jtl
