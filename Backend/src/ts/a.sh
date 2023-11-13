#!/bin/bash

while getopts ":n:p:t:" opt; do
  case $opt in
      n)
        node=$OPTARG >&2
        ;;
      p)
        pod=$OPTARG >&2
        ;;
      t)
        thread=$OPTARG >&2
        ;;
  esac
done

# Set default if parameters are not valid
if [ -z "$node" ]; then
    node=1  
fi

if [ -z "$pod" ]; then
    pod=1  
fi

if [ -z "$thread" ]; then
    thread=10
fi

# Dispay counts
echo -e "\nNode count: $node \nPod count: $pod \nThread count: $thread\n"
