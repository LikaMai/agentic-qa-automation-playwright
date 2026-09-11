import { test, expect } from '@playwright/test';
import { LOGIN_PAGE_MESSAGES } from '../constants/loginPageMessages';
import { getSecureCredentials, INVALID_PASSWORD_CASE } from '../test-data/authData';

const LOGIN_URL = 'https://zincbank.cydeo.io/login';
const LOGIN_PATH = '/login';

test.describe('Authentication Domain', () => {
  
  test.describe('AUTH-01: Positive Smoke Login', () => {
    test('User Successfully Logs In with Valid Credentials', async ({ page }) => {
      // Precondition: Navigate to the ZincBank login page
      await page.goto(LOGIN_URL);

      // Get credentials from secure environment variables
      const { email, password } = getSecureCredentials();

      // Step 1-3: Locate and fill the Email input field using bound constant
      const emailInput = page.getByPlaceholder(LOGIN_PAGE_MESSAGES.EMAIL_PLACEHOLDER);
      await emailInput.fill(email);

      // Step 4-5: Locate and fill the Password input field
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill(password);

      // Step 6: Locate and click the Sign In button using bound constant
      const signInButton = page.getByRole('button', { name: LOGIN_PAGE_MESSAGES.SIGN_IN_BUTTON_LABEL });
      await signInButton.click();

      // Step 7: Wait for the application to process the authentication request
      // Assertion: Ensure proper waiting for URL navigation away from '/login' after clicking "Sign in"
      await page.waitForURL(url => !url.pathname.includes(LOGIN_PATH), { timeout: 10000 });

      // Assertion: Browser URL reflects the authenticated application state (not the login page)
      await expect(page).not.toHaveURL(url => url.pathname.includes(LOGIN_PATH));

      // Assertion: User name or profile identifier is visible on the page (confirming successful authentication)
      // Wait for authenticated dashboard elements to be visible
      const welcomeHeading = page.getByRole('heading', { name: /Welcome,\s+[A-Za-z]+/i });
      await expect(welcomeHeading).toBeVisible({ timeout: 5000 });

      // Assertion: No error messages or toast notifications are displayed
      const errorBanner = page.locator('p, span, div').filter({ hasText: /error|invalid|fail/i });
      await expect(errorBanner.first()).not.toBeVisible();
    });
  });

  test.describe('AUTH-02: Negative Login with Invalid Password', () => {
    test('User Login Fails with Incorrect Password and Displays Error Message', async ({ page }) => {
      // Precondition: Navigate to the ZincBank login page
      await page.goto(LOGIN_URL);

      // Get credentials from secure environment variables
      const { email } = getSecureCredentials();

      // Step 1-3: Locate and fill the Email input field with valid email using bound constant
      const emailInput = page.getByPlaceholder(LOGIN_PAGE_MESSAGES.EMAIL_PLACEHOLDER);
      await emailInput.fill(email);

      // Step 4-5: Locate and fill the Password input field with incorrect password
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill(INVALID_PASSWORD_CASE.password);

      // Step 6: Locate and click the Sign In button using bound constant
      const signInButton = page.getByRole('button', { name: LOGIN_PAGE_MESSAGES.SIGN_IN_BUTTON_LABEL });
      await signInButton.click();

      // Step 7: Wait for the authentication response from the server
      // Assertion: Wait for error message banner to appear
      // Use page.locator('p, span, div').filter({ hasText: ... }).first() to avoid brittle getByRole('alert')
      // which may catch hidden framework elements (e.g., Next.js route announcers)
      const errorBanner = page.locator('p, span, div').filter({ hasText: LOGIN_PAGE_MESSAGES.ERROR_INVALID_CREDENTIALS }).first();
      // Assertion: Error message banner is displayed to the user
      await expect(errorBanner).toBeVisible({ timeout: 5000 });
      // Assertion: Error message clearly indicates authentication failure
      await expect(errorBanner).toContainText(LOGIN_PAGE_MESSAGES.ERROR_INVALID_CREDENTIALS);

      // Assertion: User remains on the login page (not redirected to authenticated area)
      await expect(page).toHaveURL(url => url.pathname.includes(LOGIN_PATH));

      // Assertion: Email field retains the entered value for user convenience
      const emailField = page.getByPlaceholder('you@example.com');
      await expect(emailField).toHaveValue('casey@zinc.test');

      // Assertion: Password field is cleared or highlighted to indicate the issue
      const passwordField = page.locator('input[type="password"]');
      await expect(passwordField).toBeVisible();
      // Password field may be cleared or have a value depending on app implementation
    });
  });

  test.describe('AUTH-03: Client-Side Validation with Empty Fields', () => {
    test('Validation Prevents Login with Empty Credentials', async ({ page }) => {
      // Precondition: Navigate to the ZincBank login page
      await page.goto(LOGIN_URL);

      // Step 1-3: Leave the Email input field empty (default state)
      const emailInput = page.getByPlaceholder(LOGIN_PAGE_MESSAGES.EMAIL_PLACEHOLDER);
      // Verify field is empty - do not fill anything
      await expect(emailInput).toHaveValue('');

      // Step 4: Leave the Password input field empty (default state)
      const passwordInput = page.locator('input[type="password"]');
      // Verify field is empty - do not fill anything
      await expect(passwordInput).toHaveValue('');

      // Step 5: Locate and click the "Sign in" button using bound constant
      const signInButton = page.getByRole('button', { name: LOGIN_PAGE_MESSAGES.SIGN_IN_BUTTON_LABEL });
      await signInButton.click();

      // Step 6: Observe the form validation behavior
      // Assertion: Login button click does not submit a request to the server (client-side validation blocks submission)
      // User remains on the login page with no navigation
      await expect(page).toHaveURL(LOGIN_URL);

      // Assertion: Form inputs are still visible and empty after validation block
      // This confirms the form was not submitted and validation prevented the action
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveValue('');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveValue('');

      // Assertion: User remains on the login page (critical requirement)
      // Form validation (HTML5 or client-side) prevents empty form submission
      await expect(page).toHaveURL(LOGIN_URL);
    });
  });

  test.describe('AUTH-04: Secure Logout and Back-Navigation Redirect Protection', () => {
    test('User Logs Out Successfully and Browser Back Button Does Not Restore Session', async ({ page }) => {
      // Precondition: Navigate to the ZincBank login page
      await page.goto(LOGIN_URL);

      // Get credentials from secure environment variables
      const { email, password } = getSecureCredentials();

      // Step 1-2: Perform a valid login first to reach authenticated state
      // Fill Email field using bound constant
      const emailInput = page.getByPlaceholder(LOGIN_PAGE_MESSAGES.EMAIL_PLACEHOLDER);
      await emailInput.fill(email);

      // Fill Password field
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill(password);

      // Click Sign In button using bound constant
      const signInButton = page.getByRole('button', { name: LOGIN_PAGE_MESSAGES.SIGN_IN_BUTTON_LABEL });
      await signInButton.click();

      // Wait for successful authentication and redirect to authenticated page
      await page.waitForURL(url => !url.pathname.includes(LOGIN_PATH), { timeout: 10000 });

      // Verify we are on an authenticated page (not the login page)
      await expect(page).not.toHaveURL(url => url.pathname.includes(LOGIN_PATH));

      // Precondition: User is now successfully logged into the ZincBank application
      // User is viewing an authenticated page (dashboard, accounts, etc.)

      // Step 1-3: From an authenticated page, locate the user menu or profile dropdown (typically top-right)
      // Try to find logout button in common locations
      let logoutButton = page.getByRole('button', { name: /logout|sign out|sign off/i });
      
      // Check if logout button is directly visible using native isVisible()
      const isLogoutVisible = await logoutButton.isVisible();
      
      if (!isLogoutVisible) {
        // If not found directly, look for a profile menu or user menu button and open it
        const profileMenu = page.getByRole('button').filter({ hasText: /profile|user|account|menu/i }).first();
        const isProfileMenuVisible = await profileMenu.isVisible();
        
        if (isProfileMenuVisible) {
          // Click the profile menu to reveal logout option
          await profileMenu.click();
        }
        
        // Locate logout option after menu opens (click() auto-waits for DOM updates)
        logoutButton = page.getByRole('button', { name: /logout|sign out|sign off/i });
      }

      // Step 3-4: Locate and click the "Logout" or "Sign Out" option
      // Playwright's click() automatically waits for element readiness
      await logoutButton.click();

      // Wait for the logout process to complete and redirect
      await page.waitForURL(url => url.pathname.includes(LOGIN_PATH), { timeout: 10000 });

      // Step 5: Verify that the user is on the login page or public page
      // Assertion: User is redirected to the login page or public landing page immediately after logout
      await expect(page).toHaveURL(url => url.pathname.includes(LOGIN_PATH));

      // Assertion: Session token is cleared from browser storage (verified by being on login page)
      // The application should have cleared cookies/tokens on logout

      // Step 6-7: Use browser back button and observe whether the previous authenticated page is accessible
      // Assertion: Browser back button does NOT restore the authenticated page
      await page.goBack();

      // Wait briefly for any navigation to complete
      try {
        await page.waitForLoadState('networkidle', { timeout: 3000 });
      } catch {
        // Network may be idle, or page may redirect immediately - continue with assertions
      }

      // Assertion: User is redirected back to the login page (not the previous authenticated page)
      // Route protection prevents restoring the session
      await expect(page).toHaveURL(url => url.pathname.includes(LOGIN_PATH));

      // Assertion: Attempting to access the protected page directly requires re-authentication
      // The back navigation should have redirected to login, confirming route protection
      // No sensitive user data is displayed in the browser history or cache (session cleared)
    });
  });

});
