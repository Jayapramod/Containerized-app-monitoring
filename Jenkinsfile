pipeline {
  agent any

  environment {
    APP_IMAGE = 'local-devops-monitoring-demo:latest'
    COMPOSE_PROJECT_NAME = 'local-devops-demo'
    GITHUB_REPO = 'https://github.com/Jayapramod/Containerized-app-monitoring.git'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: "${GITHUB_REPO}"
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
        sh 'docker rm -f demo-node-app demo-prometheus demo-grafana demo-jenkins || true'
        sh 'docker compose down -v --remove-orphans || true'
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
