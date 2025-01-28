# Secure WebSocket, docker compose and jcasc demo

This project demonstrates a secure WebSocket implementation with two web applications behind an Nginx reverse proxy, all managed through a preconfigured Jenkins pipeline (Jenkins configuration as code).

## Project Structure

- **App1**: Standard web application (Port 3000)
- **App2**: WebSocket-enabled application (Port 3001)
- **Nginx**: Reverse proxy with SSL termination

## Features

- Jenkins Configuration as Code (JCasC)
- Branch/tag selection for builds
- Self-signed SSL certificates (can be changed if needed)
- Secure WebSocket (WSS) implementation 
- Automated Docker image building and publishing


## Quick Start

### Running Jenkins Instance

```bash
# Pull Jenkins image
docker pull matanelash/qtask:qtask-jenkins

# Run Jenkins container
docker run --privileged -p 8080:8080 -v jenkins_home:/var/jenkins_home matanelash/qtask:qtask-jenkins
```

Access Jenkins at `http://localhost:8080` with preconfigured job for building and publishing Docker images.

### Running the Application

After building through Jenkins:

```bash
# Pull the latest image
docker pull matanelash/qtask:latest

# Run the application
docker run -v /var/run/docker.sock:/var/run/docker.sock matanelash/qtask:<branch/tag>-<build-num>
```

Access the applications at:
- App1: `https://localhost/app1`
- App2: `https://localhost/app2`

## Verify wss

You can verify that App2 uses WSS (WebSocket Secure) in several ways:

1. Browser dev tools:
   - Browse to app2
   - Open dev tools 
   - Go to Network tab
   - Filter by "WS"
   - You'll see the websocket starts with `wss://` 

2. Using openssl:
```bash
openssl s_client -connect localhost:443 -servername localhost -quiet

# After connecting:
GET /app2/ws HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
# You'll see continous pings
```

## Architecture

- Single Docker container running both Node.js applications
- Separate Nginx container handling SSL termination and routing
- Docker Compose orchestration
- Jenkins pipeline with GitHub integration 

## Development

The repository includes:
- Docker and Docker Compose configurations
- Jenkins pipeline configuration
- SSL certificate generation script (in prod will be letsencrypt, maybe certbot)
- Node.js applications with WebSocket implementation
- Nginx reverse proxy configuration
































