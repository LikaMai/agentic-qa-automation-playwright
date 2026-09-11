<!--
  Framework: Agentic QA Automation (Playwright + Context Engineering)
  Architect & Maintainer: Lika Mai
  Repository: maimaitituerxunwuerlika/agentic-qa-automation-playwright
  Standards: Strict Zero-Softening Policy & Decoupled Vertical Agents
-->

# Security & Secret Management Rules

## 1. Credential Isolation
- Hardcoded user credentials, passwords, or personal access tokens in test scripts or POMs are strictly prohibited.
- All secrets must be loaded via `process.env` utilizing `dotenv`.

## 2. Git Invariants
- Verify that `.env` is ignored by Git before running commits.
- Only sanitized templates (`.env.example`) are committed to version control.