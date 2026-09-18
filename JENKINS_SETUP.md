# Jenkins Setup Guide - Agentic QA Automation Pipeline

## Overview

Step-by-step instructions for configuring Jenkins to execute the Agentic QA Automation Playwright test pipeline.

## Prerequisites

- Jenkins 2.350+ installed and running
- Git, Pipeline, and Timestamper plugins installed
- Node.js v18.x or v20.x LTS on Jenkins agents
- npm available on Jenkins agents

## Step 1: Install Required Jenkins Plugins

**Manage Jenkins** → **Manage Plugins**:

### Core Plugins
- Pipeline
- Git
- Timestamper

### Test Reporting
- JUnit Plugin
- HTML Publisher Plugin (optional but recommended)

### Optional
- Email Extension Plugin
- Slack Notifier

## Step 2: Configure Jenkins Credentials

**Jenkins** → **Manage Jenkins** → **Manage Credentials** → **System** → **Global Credentials**

### Create 3 Secret Text Credentials:

**Credential 1: BASE_URL**
- Secret: `https://zincbank.cydeo.io`
- ID: `base-url`

**Credential 2: TEST_USER**
- Secret: `student10@zinc.test`
- ID: `test-user-email`

**Credential 3: TEST_PASSWORD**
- Secret: `[password from secure vault]`
- ID: `test-user-password`

## Step 3: Create Pipeline Job

**Jenkins Dashboard** → **+ New Item** → **agentic-qa-automation-tests** → **Pipeline**

### Configuration:

Under **Pipeline** section:
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `https://github.com/maimaitituerxunwuerlika/agentic-qa-automation-playwright.git`
- **Branch Specifier**: `*/main`
- **Script Path**: `Jenkinsfile`

Click **Save**

## Step 4: Build Parameters (Optional)

Check **This project is parameterized**:

**Parameter 1: Boolean**
- Name: `SKIP_API_TESTS`
- Default: unchecked

**Parameter 2: Boolean**
- Name: `SKIP_UI_TESTS`
- Default: unchecked

**Parameter 3: Choice**
- Name: `REPORT_FORMAT`
- Choices: `html` / `junit` / `both`

Click **Save**

## Step 5: Run the Pipeline

1. Open job: `agentic-qa-automation-tests`
2. Click **Build with Parameters**
3. Set parameters:
   - SKIP_API_TESTS: unchecked
   - SKIP_UI_TESTS: unchecked
   - REPORT_FORMAT: `both`
4. Click **Build**

## Step 6: View Results

1. Click build number (e.g., `#1`) in Build History
2. **Console Output**: View live logs
3. **Artifacts**: Download test reports
4. **Playwright Test Report**: View interactive HTML report

## Security Verification

- [ ] Credentials stored in Jenkins vault
- [ ] `.env` in `.gitignore`
- [ ] Only `.env.example` committed
- [ ] Credentials masked in console
- [ ] .env file deleted after build

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Node.js not found | Install Node.js on agent or use NodeJS Plugin |
| Credentials not found | Verify credential IDs match Jenkinsfile |
| Test results missing | Check test-results/*.xml files generated |
| .env not cleaned up | Verify cleanup post-build action executed |
| Git clone fails | Check Git credentials and GitHub access |

## References

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Jenkins Credentials](https://www.jenkins.io/doc/book/using/using-credentials/)
- Project: `.cline/ci-cd-architect.md`
- Project: `.clinerules/security-rules.md`

---

Framework: Agentic QA Automation (Playwright + Context Engineering)
Architect: Lika Mai
