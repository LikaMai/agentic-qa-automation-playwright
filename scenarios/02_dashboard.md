# Dashboard Domain - Business Test Scenarios

## Scenario 01: Global Navigation Invariants

**Scenario ID:** DASH-AC-01  
**Title:** Dashboard Displays Complete Global Navigation Header with All Menu Items and Logout Functionality

### Role / Actor
- Primary User: Authenticated User (Any role with dashboard access)

### Preconditions
- User is successfully authenticated and logged into ZincBank
- User is on the authenticated dashboard (`/dashboard`)
- Active session exists with valid authentication token

### Test Data
- **Expected Navigation Items:** DASHBOARD, ACCOUNTS, MOVE MONEY, TRANSACTIONS, CARDS
- **Expected Authentication Controls:** Sign out button / Logout option
- **Expected Logo/Brand:** ZincBank logo visible
- **URL Pattern:** `https://zincbank.cydeo.io/dashboard` or equivalent authenticated domain

### Step-by-Step Actions
1. Navigate to or confirm you are on the authenticated dashboard page
2. Observe the header/navigation bar at the top of the page
3. Verify the presence of the ZincBank logo on the left side
4. Check for the presence of all primary navigation menu items
5. Verify the presence of user profile/authentication menu (typically top-right)
6. Locate and identify the Sign Out / Logout button within the authentication menu

### Expected Assertions
- ZincBank logo is visible and clickable (brand consistency)
- Navigation bar is sticky or persistently visible at the top of the page
- All five primary navigation items are present and visible: DASHBOARD, ACCOUNTS, MOVE MONEY, TRANSACTIONS, CARDS
- Each navigation item is clickable and properly styled
- A user profile icon or menu trigger exists in the top-right area
- Sign Out / Logout button is accessible and clearly labeled
- No navigation items are disabled or grayed out for standard authenticated users
- Dashboard page layout does not obstruct any navigation elements

## Scenario 02: User Greeting & Currency Format Invariants

**Scenario ID:** DASH-AC-02  
**Title:** Dashboard Displays Personalized User Greeting and Correctly Formatted Currency Values

### Role / Actor
- Primary User: Authenticated user with a first name in their profile (e.g., "Carol", "Casey")

### Preconditions
- User is successfully authenticated and viewing the dashboard
- User's profile contains a first or display name
- User has at least one account with a balance
- Total deposit balance exists and is calculable

### Test Data
- **User Greeting Pattern:** "Welcome, [A-Za-z]+" (regex: matches "Welcome, " followed by alphabetic characters)
- **Currency Format Pattern:** `\$[\d,]+\.\d{2}` (regex: matches USD currency format like $X,XXX.XX)
- **Greeting Location:** Primary content area, below or adjacent to logo
- **Total Balance Label:** "TOTAL DEPOSIT BALANCE" or similar label text

### Step-by-Step Actions
1. Load the authenticated dashboard and wait for full page render
2. Locate the greeting section (typically left-aligned, below the logo area)
3. Read the greeting text displayed
4. Locate the "Total Deposit Balance" or equivalent balance display section
5. Observe the balance value formatting
6. If multiple account balances exist, verify their currency formatting as well

### Expected Assertions
- Greeting text matches the pattern "Welcome, [UserName]" where UserName is alphabetic
- No hardcoded or placeholder names are visible (e.g., not "Welcome, User" or "Welcome, Test")
- Total balance display contains a currency symbol ($)
- Total balance follows standard USD currency format: $X,XXX.XX (with commas for thousands, exactly two decimal places)
- All individual account balances match the same currency format pattern
- Currency values are right-aligned or clearly separated from labels
- No formatting anomalies (e.g., extra zeros, missing decimals, incorrect symbols)
- Greeting and balance sections are accessible and properly rendered on page load

---

## Scenario 03: Accounts Container & Activity Feed Presence

**Scenario ID:** DASH-AC-03  
**Title:** Dashboard Displays Accounts Container with Multiple Accounts and Recent Activity Feed

### Role / Actor
- Primary User: Authenticated user with multiple accounts and transaction history

### Preconditions
- User is successfully authenticated and on the dashboard
- User has at least two accounts (e.g., Checking, Savings)
- User has transaction history with multiple recent transactions
- All accounts and transactions are associated with the authenticated user

### Test Data
- **Expected Account Types:** "Checking", "Savings", or other standard account types
- **Account Number Pattern:** `\d{4}` (regex: matches last 4 digits displayed as ••••0000)
- **Activity Section Title:** "Recent activity" or "Transaction history"
- **Transaction Description Pattern:** `[A-Za-z\s]+` (regex: matches alphabetic transaction names)
- **Transaction Amount Pattern:** `\$[\d,]+\.\d{2}` (regex: matches USD currency format)
- **Transaction Date Pattern:** `[A-Za-z]{3} \d{1,2}, \d{4}` (regex: matches "Sep 9, 2026" format)

### Step-by-Step Actions
1. Load the authenticated dashboard
2. Scroll to the "Your accounts" or accounts section
3. Count and verify the presence of account containers
4. For each account, verify the display of account type and balance
5. Verify the presence of masked account number (last 4 digits)
6. Scroll down to the "Recent activity" section
7. Verify the presence of transaction list items
8. Inspect a transaction entry for description, date, and amount fields

### Expected Assertions
- Accounts section is present and clearly labeled (e.g., "YOUR ACCOUNTS")
- At least two account containers are visible and distinct
- Each account displays: Account type (label), balance (currency formatted), and masked account number
- Account type labels are human-readable and relevant (e.g., "Checking", "Savings")
- Masked account numbers display exactly 4 digits in the format ••••XXXX (e.g., ••••0021)
- Recent activity section is present and clearly labeled (e.g., "Recent activity")
- Activity feed displays a list of transactions (minimum one transaction visible)
- Each transaction entry contains: Description, Date, and Amount
- Transaction descriptions are non-empty and contain alphabetic characters
- Transaction dates follow the pattern "Mon DD, YYYY" (e.g., "Sep 9, 2026")
- Transaction amounts are formatted as USD currency ($X,XXX.XX)
- All accounts and transactions are non-empty and not placeholders
- Activity feed is scrollable if more than 5-10 transactions exist
- No accounts or transactions are duplicated or malformed

---
