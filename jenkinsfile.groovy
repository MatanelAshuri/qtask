pipeline {
    agent any
    
    environment {
        DOCKERHUB = credentials('dockerhub')
        APP_NAME = 'websocket-demo'
        GIT_REF = "${params.GIT_REF}"
        BUILD_VERSION = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: params.GIT_REF]],
                    userRemoteConfigs: [[url: 'https://github.com/MatanelAshuri/qtask.git']]
                ])
            }
        }

        stage('Build and Push') {
            steps {
                script {
                    def cleanTag = GIT_REF.replaceAll('^(refs/(tags|heads)/|origin/)', '')
                    def imageTag = "${cleanTag}-${BUILD_VERSION}"
                    def imageName = "${DOCKERHUB_USR}/${APP_NAME}"
                    
                    writeFile file: 'DockerfileRunner', text: '''
                        FROM docker/compose:latest

                        # Install OpenSSL and debugging tools
                        RUN apk add --no-cache openssl tree

                        WORKDIR /secwebsock
                        COPY . .

                        # Ensure certs exist and are accessible
                        RUN mkdir -p certs && \\
                            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\
                            -keyout certs/task-key.pem \\
                            -out certs/task-cert.pem \\
                            -subj "/CN=localhost" && \\
                            chmod 644 certs/*.pem && \\
                            ls -la certs/

                        RUN chmod +x docker/nginx/nginx-entrypoint.sh

                        CMD ["sh", "-c", "ls -la /secwebsock/certs && tree /secwebsock/certs && docker-compose up --build"]
                    '''
                    
                    withDockerRegistry([credentialsId: 'dockerhub', url: '']) {
                        sh """
                            docker build --progress=plain -t ${imageName}:${imageTag} -t ${imageName}:latest -f DockerfileRunner .
                            docker push ${imageName}:${imageTag}
                            docker push ${imageName}:latest
                        """
                    }
                }
            }
        }
    }
}