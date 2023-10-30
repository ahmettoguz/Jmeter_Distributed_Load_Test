#!/bin/bash

# Clean up slaveIps.txt to remove non-printable characters
ips=$(tr -cd '[:print:]' < slaveIps.txt)

# Dosyadan temizlenmiş IP'leri oku
IFS=" " read -ra slave_ips <<< "$ips"

# IP'leri virgülle ayırarak birleştir
ips=$(IFS=,; echo "${slave_ips[*]}")

rm result.jtl

# JMeter testini çalıştır
jmeter -Jserver.rmi.ssl.disable=true -n -t loadtest.jmx -R $ips -l ./result.jtl
