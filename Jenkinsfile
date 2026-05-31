pipeline {
  agent any

  environment {
    APP_IMAGE = 'local-devops-monitoring-demo:latest'
    COMPOSE_PROJECT_NAME = 'local-devops-demo'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $APP_IMAGE .'
      }
    }

    stage('Smoke Test Image') {
      steps {
        sh 'docker run --rm $APP_IMAGE npm test'
      }
    }

    stage('Deploy Locally') {
      steps {
        sh 'docker compose up -d app prometheus grafana'
      }
    }
  }

  post {
    always {
      sh 'docker compose ps'
    }
  }
}
