#!/bin/bash

mkdir -p certs

# generate cert and key if needed
if [ ! -f certs/task-cert.pem ] || [ ! -f certs/task-key.pem ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout certs/task-key.pem \
        -out certs/task-cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    chmod 644 certs/task-cert.pem
    chmod 644 certs/task-key.pem
    
    echo "cert created successfully"
else
    echo "cert already exist"
fi
