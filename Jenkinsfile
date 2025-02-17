pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'git@github.com:username/repo.git'
            }
        }

        stage('Build') {
            steps {
                bat 'echo Building...'
                // Add your build commands here
            }
        }

        stage('Test') {
            steps {
                bat 'echo Testing...'
                // Add your test commands here
            }
        }

        stage('Deploy') {
            steps {
                bat 'echo Deploying...'
                // Add your deployment commands here
            }
        }
    }
}
