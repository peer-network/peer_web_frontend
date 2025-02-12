pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/RR-Nair/peer_web_frontend.git', credentialsId: 'RR-Nair'
            }
        }
        stage('Test') {
            steps {
                // Run tests (e.g., Maven, npm, pytest)
                sh 'mvn test'
            }
        }
        stage('Deploy') {
            steps {
                // Deploy to server using SSH
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'your-server-config',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: '**/*',
                                    remoteDirectory: '/var/www/your-app',
                                    execCommand: 'systemctl restart your-app-service'
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }
}
