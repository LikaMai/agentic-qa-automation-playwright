# Authentication Domain - Business Test Scenarios

## Scenario 01: Positive Smoke Login

**Scenario ID:** AUTH-01  
**Title:** User Successfully Logs In with Valid Credentials

### Role / Actor
- Primary User: Casey (Standard User)

### Preconditions
- The user is on the ZincBank login page (https://zincbank.cydeo.io/login)
- No active session exists in the browser
- Valid credentials are available for the test user

### Test Data
- **Email:** casey@zinc.test
- **Password:** Passw0rd!
- **Expected Application URL:** Dashboard or Home page (post-login)

### Step-by-Step Actions
1. Navigate to the ZincBank login page
2. Locate and click on the Email input field
3. Enter email address: `casey@zinc.test`
4. Locate and click on the Password input field
5. Enter password: `Passw0rd!`
6. Locate and click the "Login" or "Sign In" button
7. Wait for the application to process the authentication request

### Expected Assertions
- Login request completes successfully (HTTP 200 or equivalent success response)
- User is redirected to the authenticated dashboard or home page
- User name or profile identifier is visible on the page (confirming successful authentication)
- Browser URL reflects the authenticated application state (not the login page)
- No error messages or toast notifications are displayed

---

## Scenario 02: Negative Login with Invalid Password

**Scenario ID:** AUTH-02  
**Title:** User Login Fails with Incorrect Password and Displays Error Message

### Role / Actor
- Primary User: Casey (Standard User) attempting unauthorized access

### Preconditions
- The user is on the ZincBank login page
- No active session exists in the browser
- Valid email exists but password is intentionally incorrect

### Test Data
- **Email:** casey@zinc.test
- **Password:** WrongPassword123
- **Expected Error Message:** "Invalid email or password" or similar authentication error

### Step-by-Step Actions
1. Navigate to the ZincBank login page (https://zincbank.cydeo.io/login).
2. Locate and fill the Email input field with `casey@zinc.test`.
3. Locate and fill the Password input field with invalid password `WrongPassword123`.
4. Locate and click the "Sign in" button.
5. Wait for the authentication error response and banner to render.

### Expected Assertions
- The browser URL remains on the login page (`https://zincbank.cydeo.io/login`).
- A visible alert or error banner is rendered on the screen.
- The error message text explicitly contains: "Invalid email or password." (or "Invalid credentials").
- No authenticated dashboard elements are accessible, and no session cookie is created.

---

## Scenario 03: Negative Login with Empty Email and Password Fields

**Scenario ID:** AUTH-03  
**Title:** Client-Side Validation Prevents Login with Empty Credentials

### Role / Actor
- Primary User: Guest / Anonymous user

### Preconditions
- The user is on the ZincBank login page
- No active session exists in the browser
- Email and Password fields are empty (default state)

### Test Data
- **Email:** (empty string)
- **Password:** (empty string)
- **Expected Validation:** Client-side validation error messages

### Step-by-Step Actions
1. Navigate to the ZincBank login page
2. Leave the Email input field empty (do not enter any value)
3. Leave the Password input field empty (do not enter any value)
4. Locate and click the "Login" or "Sign In" button
5. Observe the form validation behavior

### Expected Assertions
- Login button click does not submit a request to the server (client-side validation blocks submission)
- Validation error message appears below or adjacent to the Email field (e.g., "Email is required")
- Validation error message appears below or adjacent to the Password field (e.g., "Password is required")
- Both error messages are visible and clearly communicate the required fields
- User remains on the login page with focus on the first empty field
- Form is not submitted to the backend server

---

## Scenario 04: Secure Logout and Browser Back-Navigation Redirect Protection

**Scenario ID:** AUTH-04  
**Title:** User Logs Out Successfully and Browser Back Button Does Not Restore Authenticated Session

### Role / Actor
- Primary User: Casey (Standard User) with active session

### Preconditions
- User is successfully logged into the ZincBank application
- User is viewing an authenticated page (dashboard, accounts, etc.)
- Active session token exists in the browser/application state

### Test Data
- **Logout Button Location:** Top-right navigation menu or user profile dropdown
- **Expected Post-Logout URL:** Login page or public landing page
- **Session Token:** Should be cleared or invalidated after logout

### Step-by-Step Actions
1. From an authenticated page, locate the user menu or profile dropdown (typically top-right)
2. Click on the user profile icon or menu trigger
3. Locate and click the "Logout" or "Sign Out" option
4. Wait for the logout process to complete and redirect
5. Verify that the user is on the login page or public page
6. Use browser back button (or press Backspace / Alt+Left Arrow depending on browser)
7. Observe whether the previous authenticated page is accessible

### Expected Assertions
- Logout request completes successfully
- User is redirected to the login page or public landing page immediately after logout
- Session token is cleared from browser storage (cookies, localStorage, sessionStorage)
- Browser back button does NOT restore the authenticated page
- User is redirected back to the login page (not the previous authenticated page)
- Attempting to access the protected page directly requires re-authentication
- No sensitive user data is displayed in the browser history or cache

---
