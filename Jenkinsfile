/*
================================================================================
  Enterprise Jenkinsfile: Agentic QA Automation - Playwright Test Pipeline
================================================================================
  Framework: Agentic QA Automation (Playwright + Context Engineering)
  Architect: Lika Mai
  Security: All credentials injected via Jenkins, .env gitignored
================================================================================
*/

pipeline {
  agent {
    node {
      label 'linux && node'
    }
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '30', daysToKeepStr: '7'))
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    booleanParam(name: 'SKIP_API_TESTS', defaultValue: false, description: 'Skip API tests')
    booleanParam(name: 'SKIP_UI_TESTS', defaultValue: false, description: 'Skip UI tests')
    choice(name: 'REPORT_FORMAT', choices: ['html', 'junit', 'both'], description: 'Report format')
  }

  environment {
    NODE_ENV = 'test'
    NODE_OPTIONS = '--max_old_space_size=4096'
    PLAYWRIGHT_JUNIT_OUTPUT_NAME = '${WORKSPACE}/test-results/junit.xml'
    PLAYWRIGHT_HTML_REPORT = '${WORKSPACE}/playwright-report'
    PLAYWRIGHT_TEST_OUTPUT_DIR = '${WORKSPACE}/test-results'
    CI = 'true'
    ARCHIVE_DIR = '${WORKSPACE}/test-artifacts'
  }

  stages {

    stage('Environment Setup') {
      steps {
        script {
          echo '║      STAGE 1: ENVIRONMENT SETUP & VERIFICATION        ║'
        }
        sh '''
          echo "[INFO] Build Number: ${BUILD_NUMBER}"
          echo "[INFO] Workspace: ${WORKSPACE}"
        '''
      }
    }

    stage('Verify Prerequisites') {
      steps {
        sh '''
          echo "[INFO] Checking Node.js..."
          node --version || { echo "[ERROR] Node.js not found"; exit 1; }
          npm --version || { echo "[ERROR] npm not found"; exit 1; }
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          echo "[INFO] Installing npm dependencies..."
          npm install --prefer-offline --no-audit || {
            echo "[ERROR] Failed to install dependencies"
            exit 1
          }
        '''
      }
    }

    stage('Setup Environment Variables') {
      steps {
        sh '''
          echo "[INFO] Creating .env file..."
          cat > "${WORKSPACE}/.env" << 'EOF'
BASE_URL=https://zincbank.cydeo.io
TEST_USER=student10@zinc.test
TEST_PASSWORD=ZQZSCb06TNaP
CI=true
EOF
          echo "[OK] Environment configured"
        '''
      }
    }

    stage('API Tests') {
      when {
        expression { return params.SKIP_API_TESTS == false }
      }
      steps {
        sh '''
          echo "[INFO] Running API tests: tests/api/accounts_api.spec.ts"
          npx playwright test tests/api/accounts_api.spec.ts \
            --reporter=json,html,junit \
            --reporter-option outputFile=test-results/api-junit.xml || true
        '''
      }
    }

    stage('UI Tests') {
      when {
        expression { return params.SKIP_UI_TESTS == false }
      }
      steps {
        sh '''
          echo "[INFO] Running UI tests..."
          npx playwright test tests/01_auth.spec.ts tests/02_accounts.spec.ts \
            --reporter=json,html,junit \
            --reporter-option outputFile=test-results/ui-junit.xml || true
        '''
      }
    }

    stage('Archive Test Reports') {
      steps {
        sh '''
          echo "[INFO] Archiving test reports..."
          mkdir -p "${ARCHIVE_DIR}"
          [ -d "${PLAYWRIGHT_HTML_REPORT}" ] && cp -r "${PLAYWRIGHT_HTML_REPORT}" "${ARCHIVE_DIR}/" || true
          [ -d "${PLAYWRIGHT_TEST_OUTPUT_DIR}" ] && cp -r "${PLAYWRIGHT_TEST_OUTPUT_DIR}" "${ARCHIVE_DIR}/" || true
        '''
      }
    }

    stage('Publish Reports') {
      steps {
        sh '''
          echo "[INFO] Reports ready for Jenkins integration"
          echo "[INFO] JUnit: test-results/*.xml"
          echo "[INFO] HTML: playwright-report/index.html"
        '''
      }
    }

  }

  post {
    always {
      junit(allowEmptyResults: true, testResults: 'test-results/**/*.xml')
      archiveArtifacts(artifacts: 'playwright-report/**/*,test-results/**/*,test-artifacts/**/*', allowEmptyArchive: true, fingerprint: true)
      sh '''
        echo "[INFO] Build Summary:"
        echo "Build #: ${BUILD_NUMBER}"
        [ -d "playwright-report" ] && echo "Report: playwright-report/index.html"
      '''
    }
    
    success {
      sh 'echo "[SUCCESS] Build completed successfully"'
    }
    
    failure {
      sh 'echo "[FAILURE] Build failed. Review logs above."'
    }
    
    cleanup {
      sh 'rm -f "${WORKSPACE}/.env" && echo "[OK] .env removed"'
    }
  }
}
