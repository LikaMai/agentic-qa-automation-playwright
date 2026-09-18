# Pipeline Execution Guide

## Overview

Detailed description of how the Jenkins pipeline executes Agentic QA Automation tests.

## Architecture

The pipeline follows this 8-stage flow:

1. **Environment Setup** - Display build metadata
2. **Verify Prerequisites** - Check Node.js/npm
3. **Install Dependencies** - npm install
4. **Setup Environment Variables** - Create .env from Jenkins credentials
5. **API Tests** - Run tests/api/accounts_api.spec.ts
6. **UI Tests** - Run tests/01_auth.spec.ts & 02_accounts.spec.ts
7. **Archive Test Reports** - Collect Playwright artifacts
8. **Publish Reports** - Prepare for Jenkins integration

## Execution Timeline

| Stage | Duration | Purpose |
|-------|----------|---------|
| 1. Environment Setup | ~1 sec | Display build metadata |
| 2. Verify Prerequisites | ~2 sec | Check Node.js/npm |
| 3. Install Dependencies | ~30-45 sec | npm install |
| 4. Setup Env Vars | ~1 sec | Create .env file |
| 5. API Tests | ~2-3 sec | Run 8 API tests |
| 6. UI Tests | ~30-60 sec | Run UI test suites |
| 7. Archive Reports | ~2-3 sec | Copy artifacts |
| 8. Publish Reports | ~1 sec | Display locations |
| **Total** | **~3-5 min** | Complete build |

## Stage Details

### Stage 1: Environment Setup
Logs build number, workspace path, and node name for debugging.

### Stage 2: Verify Prerequisites
Verifies Node.js v18+ and npm are installed.
Fails immediately if tools missing.

### Stage 3: Install Dependencies
Runs `npm install --prefer-offline --no-audit`
Installs Playwright, test framework, and other packages.

### Stage 4: Setup Environment Variables
Creates `.env` file from Jenkins credentials:
- BASE_URL=https://zincbank.cydeo.io
- TEST_USER=student10@zinc.test
- TEST_PASSWORD=[from vault]
- CI=true

File created at `${WORKSPACE}/.env`, deleted in cleanup.

### Stage 5: API Tests
Runs `tests/api/accounts_api.spec.ts`
Condition: `SKIP_API_TESTS == false`
Output: `test-results/api-junit.xml`, `playwright-report/`

### Stage 6: UI Tests
Runs:
- `tests/01_auth.spec.ts`
- `tests/02_accounts.spec.ts`
Condition: `SKIP_UI_TESTS == false`
Output: `test-results/ui-junit.xml`, `playwright-report/`

### Stage 7: Archive Test Reports
Copies:
- `playwright-report/` → `test-artifacts/`
- `test-results/` → `test-artifacts/`

### Stage 8: Publish Reports
Displays artifact locations for Jenkins integration.

## Post-Build Actions

**Always Execute**:
1. Parse JUnit XML files
2. Archive artifacts (Playwright, traces, screenshots)
3. Display build summary
4. **Delete .env file** (CRITICAL security step)

**On Success**: Jenkins marks build PASSED
**On Failure**: Jenkins marks build FAILED, preserves artifacts

## Report Artifacts

```
${WORKSPACE}/
├── playwright-report/        (Interactive HTML report)
├── test-results/            (JUnit XML, JSON, screenshots)
└── test-artifacts/          (Archived copies)
```

**Accessible in Jenkins UI**:
1. Build > Artifacts: Download all files
2. Playwright Test Report: View interactive HTML
3. Test Results: Jenkins test dashboard

## Build Scenarios

**Scenario 1: Full Build (default)**
- SKIP_API_TESTS: false
- SKIP_UI_TESTS: false
- Duration: ~3-5 minutes
- Runs all 8 API + N UI tests

**Scenario 2: API Only**
- SKIP_API_TESTS: false
- SKIP_UI_TESTS: true
- Duration: ~1-2 minutes
- Runs 8 API tests only

**Scenario 3: UI Only**
- SKIP_API_TESTS: true
- SKIP_UI_TESTS: false
- Duration: ~2-3 minutes
- Runs UI tests only

## Credential Flow

```
Jenkins Vault (Encrypted)
    ↓
withCredentials Block
    ↓
Create .env (Runtime)
    ↓
Playwright Reads .env
    ↓
Cleanup Phase: Delete .env
```

## Log Patterns

**Success**:
```
[OK] Node.js and npm verified
[OK] Dependencies installed
✓ Test name
X tests passed
[OK] .env removed
```

**Errors**:
```
[ERROR] Node.js not found
[ERROR] Failed to install dependencies
[WARNING] Tests completed with failures
```

## Performance Tips

- Cache npm packages: `npm ci --prefer-offline`
- Pre-warm Playwright browsers in Docker image
- Parallel execution: API + UI tests simultaneously
- Incremental tests: Skip unchanged test files

## References

- `.cline/ci-cd-architect.md` - Architecture
- `.clinerules/security-rules.md` - Security policies
- `JENKINS_SETUP.md` - Jenkins configuration
- `Jenkinsfile` - Pipeline source

---

Framework: Agentic QA Automation (Playwright + Context Engineering)
Architect: Lika Mai
