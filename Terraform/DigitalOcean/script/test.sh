#!/bin/bash

# Aim of that script is starting test in container. (This script will be executed by container, not by user).

# Clean up slaveIps.txt to remove non-printable characters
ips=$(tr -cd '[:print:]' < slaveIps.txt)

# Ip related
IFS=" " read -ra slave_ips <<< "$ips"

# Ip related
ips=$(IFS=,; echo "${slave_ips[*]}")

# Remove previous results
if [ -e "result.jtl" ]; then
    rm result.jtl
fi

export JVM_ARGS="-Xms1024m -Xmx1980m"
HEAP="-Xms1024m -Xmx1980m" ./jmeter.sh

# Run jmeter test
jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result.jtl