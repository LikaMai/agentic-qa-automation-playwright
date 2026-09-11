# Playwright Test Automation Rules

## 1. Zero Test Softening Policy
- Swallowing errors or assertions with empty `.catch(() => {})` or non-throwing `try-catch` blocks is strictly forbidden.
- All UI state verifications must use explicit Playwright assertions (e.g., `await expect(locator).toBeVisible({ timeout: 5000 })`).
- If an assertion fails, the test must fail deterministically to expose potential regressions.

## 2. Locator Architecture
- Prioritize user-facing, accessible role locators (`page.getByRole()`, `page.getByLabel()`, `page.getByText()`).
- Never rely on fragile, auto-generated CSS selectors or arbitrary XPath chains.
- Dynamic or fallback locators must be centralized in semantic constants or Page Object models.

## 3. Asynchronous Stability
- Arbitrary sleep functions (e.g., `page.waitForTimeout()`) are prohibited.
- Rely on Playwright's built-in web-first assertions and auto-waiting mechanisms.