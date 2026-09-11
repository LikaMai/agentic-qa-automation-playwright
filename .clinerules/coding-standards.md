<!--
  Framework: Agentic QA Automation (Playwright + Context Engineering)
  Architect & Maintainer: Lika Mai
  Repository: maimaitituerxunwuerlika/agentic-qa-automation-playwright
  Standards: Strict Zero-Softening Policy & Decoupled Vertical Agents
-->

# TypeScript & Code Quality Standards

## 1. Architectural Boundaries
- Separation of Concerns: Page Objects (`pages/`) handle DOM interaction; tests (`tests/`) handle test flows and assertions; static texts reside in `constants/`; fixtures reside in `test-data/`.
- No magic strings: UI headers, static validation errors, and regex patterns must be imported from `constants/`.

## 2. Assertion Integrity
- Acceptance criteria (AC) assertions must be balanced equally (Anti-Anchoring Directive).
- Do not suppress negative test validation; assert exact server or client error banners.