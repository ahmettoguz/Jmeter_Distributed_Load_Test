#!/bin/bash

# Clean up slaveIps.txt to remove non-printable characters
ips=$(tr -cd '[:print:]' < slaveIps.txt)

# Dosyadan temizlenmiş IP'leri oku
IFS=" " read -ra slave_ips <<< "$ips"

# IP'leri virgülle ayırarak birleştir
ips=$(IFS=,; echo "${slave_ips[*]}")

# Remove previous results
if [ -e "result.jtl" ]; then
    rm result.jtl
fi

# JMeter testini çalıştır
jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result.jtl