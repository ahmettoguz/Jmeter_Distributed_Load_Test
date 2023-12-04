#!/bin/bash

# Aim of that script is starting test in container. (This script will be executed by container, not by user).

# Clean up slaveIps.txt to remove non-printable characters
ips=$(tr -cd '[:print:]' < slaveIps.txt)

# Ip related
IFS=" " read -ra slave_ips <<< "$ips"

# Ip related
ips=$(IFS=,; echo "${slave_ips[*]}")

# Remove previous results
if [ -d "./result" ]; then
  rm -rf "./result"
fi

# Run jmeter test
jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result.jtl

# # Create result folders
# mkdir -p ./result/report

# # Run jmeter test
# jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result/results.jtl -j ./result/jmeter.log -e -o ./result/report