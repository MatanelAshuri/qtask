FROM registry.access.redhat.com/ubi8/ubi

RUN dnf module install -y nodejs:18/common && \
    dnf clean all

WORKDIR /usr/src/app

COPY apps/app1 ./app1/
COPY apps/app2 ./app2/

WORKDIR /usr/src/app/app1
RUN npm install

WORKDIR /usr/src/app/app2
RUN npm install

COPY docker/start-apps.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start-apps.sh

WORKDIR /usr/src/app
EXPOSE 3000 3001

CMD ["/usr/local/bin/start-apps.sh"]