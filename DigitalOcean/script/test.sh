#!/bin/bash

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

# Run jmeter tesr
jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result.jtl