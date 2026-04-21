pipeline {
  agent any

  stages {
    stage('Code Lao') {
      steps { checkout scm }
    }

    stage('Backend Install') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }

    stage('Frontend Install') {
      steps {
        dir('frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        echo 'Deploying...'
      }
    }
  }

  post {
    success { echo 'Build successful!' }
    failure { echo 'Build fail ho gaya!' }
  }
}