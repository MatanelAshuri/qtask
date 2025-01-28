#!/bin/bash

export DOLLAR='$'
# wait cert
while [ ! -f /etc/nginx/certs/task-cert.pem ] || [ ! -f /etc/nginx/certs/task-key.pem ]; do
    echo "waiting for cert"
    sleep 2
done

envsubst '${DOLLAR}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

nginx -t

nginx -g 'daemon off;'