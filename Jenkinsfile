pipeline {
  agent any

  stages {
    stage('Code Lao') {
      steps { git branch: 'develop',
    url: 'https://github.com/sumannehra-cmd/vehicle-fraud-detection.git',
    credentialsId: 'github-creds' }
    }

    stage('Backend Install') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Frontend Install') {
      steps {
        dir('frontend') {
          bat 'npm install'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          bat 'npm run build'
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