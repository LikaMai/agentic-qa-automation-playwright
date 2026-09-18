# CI/CD Architect Role: Jenkins Pipeline Engineer

## Objective
Design and maintain enterprise-grade CI/CD pipelines for Agentic QA Automation framework with secure credential management, staged test execution, and Playwright report generation.

## Pipeline Architecture
- **Declarative Pipelines**: Jenkinsfile for version control and auditability
- **Staged Execution**: Separate API and UI tests for granular failure isolation
- **Security-First**: All credentials injected via Jenkins, never hardcoded
- **Zero-Trust**: Assume all artifacts potentially sensitive
- **Immutable Artifacts**: Archive reports, traces, screenshots for audit trail

## Credential Management (Reference: .clinerules/security-rules.md)
- NO hardcoded credentials in Jenkinsfile or scripts
- ALL secrets loaded via `withCredentials` Jenkins block
- `.env` generated at runtime, deleted after build
- Only `.env.example` template committed to Git
- Environment variables masked in console output

## Pipeline Stages

1. **Environment Setup** - Verify workspace and build metadata
2. **Verify Prerequisites** - Check Node.js installation
3. **Install Dependencies** - npm install with offline cache
4. **Setup Environment Variables** - Generate .env from Jenkins credentials
5. **API Tests** - Run tests/api/accounts_api.spec.ts
6. **UI Tests** - Run tests/01_auth.spec.ts & 02_accounts.spec.ts
7. **Archive Test Reports** - Collect Playwright reports and traces
8. **Publish Reports** - Export JUnit XML for Jenkins integration

## Post-Build Actions

**Always**:
- Parse JUnit XML files for Jenkins reporting
- Archive all test artifacts (Playwright reports, traces, screenshots)
- Display build summary with artifact locations
- Clean up sensitive `.env` file (CRITICAL for security)

**Success**: Display "BUILD SUCCESSFUL", preserve artifacts
**Failure**: Display "BUILD FAILED", preserve logs and artifacts
**Cleanup**: Delete `.env` to prevent credential exposure

## Jenkins Setup

### Required Plugins
- Pipeline, Git, Timestamper, JUnit Plugin, HTML Publisher

### Credentials Setup
Create 3 "Secret text" credentials:
- ID: base-url | Secret: https://zincbank.cydeo.io
- ID: test-user-email | Secret: student10@zinc.test
- ID: test-user-password | Secret: [actual password]

### Job Configuration
1. Create Pipeline job
2. Select "Pipeline script from SCM"
3. Configure Git repository
4. Branch: */main
5. Script path: Jenkinsfile

## Report Locations
- playwright-report/ - HTML report (Jenkins artifact links)
- test-results/ - JUnit XML files
- test-artifacts/ - Archived copies

## Expected Execution Time
- Total: 3-5 minutes (including npm install)
- API Tests: ~2 seconds
- UI Tests: ~30-60 seconds

## Security Practices
✓ All secrets in Jenkins credentials vault
✓ .env generated at runtime only
✓ .env deleted in cleanup phase
✓ No credentials in console output
✓ No credentials in Git history

Framework: Agentic QA Automation (Playwright + Context Engineering)
Architect: Lika Mai
Repository: maimaitituerxunwuerlika/agentic-qa-automation-playwright

