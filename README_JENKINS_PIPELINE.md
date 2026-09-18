# Jenkins Pipeline Documentation

## Quick Start

1. **Copy `.env.example` to `.env`** (in local development)
2. **Follow `JENKINS_SETUP.md`** to configure Jenkins
3. **Build with parameters** in Jenkins UI
4. **View reports** in Jenkins artifacts

## Files Overview

| File | Size | Purpose |
|------|------|---------|
| `Jenkinsfile` | 166 lines | Enterprise declarative pipeline |
| `.env.example` | 33 lines | Credentials template (COMMITTED) |
| `JENKINS_SETUP.md` | 127 lines | Configuration guide |
| `PIPELINE_EXECUTION_GUIDE.md` | 170 lines | Execution details |
| `.cline/ci-cd-architect.md` | 81 lines | Architecture & directives |

## Jenkinsfile Architecture

### 8-Stage Pipeline

1. **Environment Setup** - Display build metadata
2. **Verify Prerequisites** - Check Node.js/npm
3. **Install Dependencies** - npm install
4. **Setup Environment Variables** - Create .env from vault
5. **API Tests** - Run tests/api/accounts_api.spec.ts
6. **UI Tests** - Run tests/*.spec.ts (UI)
7. **Archive Reports** - Collect artifacts
8. **Publish Reports** - Jenkins integration

### Key Features

✓ Security-First Credential Management
  - Jenkins vault storage (encrypted)
  - Runtime .env generation only
  - Automatic cleanup after build

✓ Conditional Test Execution
  - Skip API tests if needed
  - Skip UI tests if needed
  - Flexible reporting options

✓ Comprehensive Artifact Management
  - JUnit XML for Jenkins
  - HTML interactive reports
  - Browser traces for debugging
  - Screenshots on failure

✓ Post-Build Automation
  - JUnit parsing
  - Artifact archiving
  - Build history (30 builds, 7 days)
  - Concurrent build prevention

## Credential Flow

```
Jenkins Vault (Encrypted)
    ↓ withCredentials
Inject Variables
    ↓
Create .env (Runtime)
    ↓
Playwright Reads .env
    ↓
Tests Execute
    ↓
DELETE .env (Cleanup)
```

## Report Artifacts

```
${WORKSPACE}/
├── playwright-report/    (Interactive HTML)
│   ├── index.html       ← Click here
│   ├── trace.zip        ← Debug traces
│   └── ...
├── test-results/        (Test output)
│   ├── api-junit.xml
│   ├── ui-junit.xml
│   ├── screenshots/
│   └── ...
└── test-artifacts/      (Archived copies)
```

## Execution Scenarios

### Full Build
- SKIP_API_TESTS: unchecked
- SKIP_UI_TESTS: unchecked
- Duration: ~3-5 minutes
- Coverage: All tests

### API Only
- SKIP_API_TESTS: unchecked
- SKIP_UI_TESTS: checked
- Duration: ~1-2 minutes
- Coverage: API smoke tests

### UI Only
- SKIP_API_TESTS: checked
- SKIP_UI_TESTS: unchecked
- Duration: ~2-3 minutes
- Coverage: UI workflows

## Security Implementation

✓ Credentials in Jenkins vault
✓ .env in .gitignore
✓ Only .env.example committed
✓ Variables masked in logs
✓ .env deleted in cleanup
✓ Full audit trail in git

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Node.js not found | Install on agent or use NodeJS Plugin |
| Credentials missing | Verify ID: base-url, test-user-email, test-user-password |
| Test results missing | Check test-results/*.xml generated |
| .env not deleted | Verify cleanup stage executed |
| Tests timeout | Increase timeout or check agent resources |

## References

- `Jenkinsfile` - Pipeline code
- `JENKINS_SETUP.md` - Jenkins configuration
- `PIPELINE_EXECUTION_GUIDE.md` - Execution flow
- `.cline/ci-cd-architect.md` - Architecture
- `.clinerules/security-rules.md` - Security

## Performance

| Phase | Duration |
|-------|----------|
| Setup | ~35 sec |
| API Tests | ~2-3 sec |
| UI Tests | ~30-60 sec |
| Archive | ~2-3 sec |
| **Total** | **~3-5 min** |

---

Framework: Agentic QA Automation (Playwright + Context Engineering)
Architect: Lika Mai
Repository: maimaitituerxunwuerlika/agentic-qa-automation-playwright
