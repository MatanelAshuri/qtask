#!/bin/bash

# wait for cert 
while [ ! -f /etc/nginx/certs/task-cert.pem ] || [ ! -f /etc/nginx/certs/task-key.pem ]; do
    echo "waiting for cert"
    sleep 2
done

export DOLLAR='$'
envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

nginx -t

nginx -g 'daemon off;'