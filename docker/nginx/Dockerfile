FROM nginx:latest

RUN apt-get update && apt-get install -y \
    gettext-base \
    curl \
    openssl \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /docker-entrypoint.d /etc/nginx/certs

COPY docker/nginx/conf/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/conf/default.conf.template /etc/nginx/templates/default.conf.template

COPY certs/task-cert.pem /etc/nginx/certs/
COPY certs/task-key.pem /etc/nginx/certs/

COPY docker/nginx/nginx-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh && \
    chmod 644 /etc/nginx/certs/*

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]