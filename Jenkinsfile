pipeline {
    agent any

    triggers {
        githubPush()
    }

    options {
        timestamps()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'cicd-blog'
    }

    stages {
        stage('Backend test') {
            steps {
                sh 'docker run --rm -v "$WORKSPACE/backend:/workspace" -w /workspace maven:3.9.11-eclipse-temurin-21 mvn -q clean test'
            }
        }

        stage('Frontend build') {
            steps {
                sh 'docker run --rm -v "$WORKSPACE/frontend:/workspace" -w /workspace node:22-alpine sh -c "npm install && npm run build"'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose -p $COMPOSE_PROJECT_NAME -f docker-compose.app.yml up -d --build --remove-orphans'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
        }
    }
}
