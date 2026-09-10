# Agent Skills Library (`skills.md`)

> **File Overview & Purpose**:
> 1. **High Reusability**: Encapsulates repetitive ZincBank business actions (authentication, fund transfers, session termination) into standardized procedures, eliminating the need to provide raw manual instructions in every session.
> 2. **Token Efficiency via Progressive Disclosure**: Keeps working memory below the 70% threshold by exposing only titles and 1–2 sentence trigger conditions during agent initialization. Full procedural steps are loaded on-demand only when a matching scenario triggers the skill.
> 3. **Deterministic Script Generation & Flakiness Protection**: Mandates stable Playwright locators (e.g., `getByRole`, `getByPlaceholder`) instead of volatile snapshot refs (`e12`, `e15`) in final test code, and enforces a 3-retry verification workflow before reporting any defect.

---

## 1. zincbank_login_skill
- **Description**: Authenticates a specified test user into ZincBank and asserts successful navigation to the main dashboard.
- **Trigger**: Required at the start of any authenticated scenario, or when the current page URL is `/login`.
- **Available Credentials**:
  - Default User: `casey@zinc.test`
  - Peer / Transfer Recipient: `bob@zinc.test`
  - Secondary Role: `carol@zinc.test`
  - Universal Password: `Passw0rd!` *(Note: Use single quotes in shell commands to prevent Zsh exclamation mark history expansion)*
- **Execution Workflow**:
  1. Navigate to `https://zincbank.cydeo.io/login`.
  2. Locate the email field (`page.getByPlaceholder('you@example.com')` or Snapshot `textbox "Email"`) and enter the designated user email.
  3. Locate the password field (`page.locator('input[type="password"]')` or Snapshot `textbox "Password"`) and fill the password.
  4. Click the sign-in button (`page.getByRole('button', { name: 'Sign in' })`).
  5. Assert that the browser URL redirects to `/dashboard` and account summary cards render on the page.

---

## 2. zincbank_transfer_skill
- **Description**: Executes fund transfers between accounts and verifies both positive confirmations and negative validation barriers.
- **Trigger**: Scenario requires funds transfer, balance deduction, or negative boundary checks (e.g., insufficient funds).
- **Execution Workflow**:
  1. From the authenticated dashboard, navigate to the **Transfer Money** / **Payments** section.
  2. Select the source account (Checking or Savings).
  3. Enter or select the destination recipient account (e.g., `bob@zinc.test` or `carol@zinc.test`).
  4. Populate the transfer amount and optional transaction note.
  5. Submit the transfer.
  6. Conditional Assertions:
     - **Positive Path**: Assert receipt banner ("Transfer Successful"), verify the source account balance decreases accordingly, and confirm the transaction record appears in recent activity.
     - **Negative Path (Exceeding Balance / Invalid Input)**: Assert an error alert banner is displayed, the form submission is blocked, and no balance deduction occurs.

---

## 3. zincbank_logout_skill
- **Description**: Safely terminates the active user session and purges client-side storage to ensure complete test isolation across multiple roles.
- **Trigger**: End of a test scenario or during cross-role validation tests (e.g., Casey logging out before Bob logs in).
- **Execution Workflow**:
  1. Locate and click the user account menu or direct sign-out control (`page.getByRole('button', { name: 'Sign out' })`).
  2. Assert that the browser redirects back to `/login`.
  3. Clear browser storage (`context.clearCookies()` and local storage purge) to eliminate session leakage.
  4. Verify that attempting to visit `/dashboard` directly redirects back to `/login`.

---

## 4. bug_reproduction_skill
- **Description**: Guards against reporting false positives caused by network latency, transient UI delays, or locator race conditions.
- **Trigger**: Any test step or assertion fails unexpectedly during test execution.
- **Execution Workflow**:
  1. Do NOT immediately declare or log a bug in ZincTM / Jira.
  2. Reset the browser context and clear session state.
  3. Re-execute the exact failing scenario **3 consecutive times** under identical conditions.
  4. **Evaluation Criteria**:
     - **Confirmed Defect**: If and only if the step fails consistently across all 3 re-runs, classify the issue as a genuine defect, capture a failure snapshot/trace, and log the bug report.
     - **Transient Flakiness**: If any of the 3 re-runs passes successfully, classify it as a flaky test, record the timeout/network diagnostic logs, and do not raise a bug ticket.

## 5.Skill: zincbank_login_page_object
- **Trigger**: When any new test scenario requires interacting with or navigating through the ZincBank Login interface.
- **Usage**:
  1. Import `LoginPage` from `../pages/LoginPage`.
  2. Instantiate with `const loginPage = new LoginPage(page)`.
  3. Call `await loginPage.login(email, password)` for authenticated sessions.
  4. Avoid writing manual input locators for login in new spec files.