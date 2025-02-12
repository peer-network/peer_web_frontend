pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-username/your-repo.git', credentialsId: 'your-credentials-id'
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
