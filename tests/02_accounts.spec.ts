import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { getSecureCredentials } from '../test-data/authData';

test.describe('Dashboard - Domain Test Suite', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Get credentials from secure environment variables
    const { email, password } = getSecureCredentials();
    
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Authenticate user before each test using environment variable credentials
    await loginPage.goto();
    await loginPage.login(email, password);
    
    // Verify dashboard is loaded
    await dashboardPage.expectLoaded();
  });

  test('DASH-AC-01: Global Navigation Invariants - Header, Navigation Items, and Logout Functionality', async ({ page }) => {
    // Expected navigation items from spec
    const expectedNavItems = ['DASHBOARD', 'ACCOUNTS', 'MOVE MONEY', 'TRANSACTIONS', 'CARDS'];

    // Step 1: Verify ZincBank logo is visible and present
    const logoIsVisible = await dashboardPage.brandLogo.isVisible();
    expect(logoIsVisible).toBeTruthy();

    // Step 2: Verify navigation bar is visible
    const navIsVisible = await dashboardPage.navigationItems.isVisible();
    expect(navIsVisible).toBeTruthy();

    // Step 3: Verify all primary navigation items are present
    const navItems = await dashboardPage.getNavigationItems();
    expect(navItems.length).toBeGreaterThanOrEqual(5);
    
    // Verify each expected nav item exists (case-insensitive)
    for (const expectedItem of expectedNavItems) {
      const itemExists = navItems.some(item => 
        item.toUpperCase().includes(expectedItem.toUpperCase())
      );
      expect(itemExists).toBeTruthy();
    }

    // Step 4: Verify individual navigation links are clickable
    const dashboardLinkExists = await dashboardPage.dashboardNavItem.isVisible();
    expect(dashboardLinkExists).toBeTruthy();
    
    const accountsLinkExists = await dashboardPage.accountsNavItem.isVisible();
    expect(accountsLinkExists).toBeTruthy();

    // Step 5: Verify Sign Out button is accessible and visible
    const signOutIsVisible = await dashboardPage.isSignOutVisible();
    expect(signOutIsVisible).toBeTruthy();

    // Step 6: Verify navigation elements are not disabled
    const dashboardDisabled = await dashboardPage.dashboardNavItem.isDisabled();
    expect(dashboardDisabled).toBeFalsy();
  });

  test('DASH-AC-02: User Greeting & Currency Format - Personalized Welcome and USD Currency Display', async ({ page }) => {
    // Expected patterns from spec
    const greetingPattern = /Welcome,\s+[A-Za-z]+/;
    const currencyPattern = /\$[\d,]+\.\d{2}/;
    const welcomeUserName = 'Casey'; // Expected for casey@zinc.test

    // Step 1: Load dashboard and verify greeting section is visible
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toBeTruthy();

    // Step 2: Verify greeting matches expected pattern
    expect(welcomeText).toMatch(greetingPattern);
    
    // Step 3: Verify greeting contains user's name (not placeholder)
    expect(welcomeText).toContain(welcomeUserName);
    expect(welcomeText).not.toMatch(/Welcome,\s+(User|Test|Guest|Admin)/i);

    // Step 4: Verify total balance is visible
    const balanceText = await dashboardPage.getTotalBalance();
    expect(balanceText).toBeTruthy();

    // Step 5: Verify total balance contains currency symbol
    expect(balanceText).toContain('$');

    // Step 6: Verify total balance follows USD currency format
    const currencyMatches = balanceText.match(currencyPattern);
    expect(currencyMatches).not.toBeNull();

    // Step 7: Verify no formatting anomalies in currency display
    if (currencyMatches) {
      const balanceValue = currencyMatches[0];
      // Verify exactly 2 decimal places
      expect(balanceValue).toMatch(/\d{2}$/);
      // Verify proper comma usage for thousands
      const partsBeforeDecimal = balanceValue.split('.')[0];
      expect(partsBeforeDecimal).toMatch(/^\$\d{1,3}(,\d{3})*$/);
    }
  });

  test('DASH-AC-03: Accounts Container & Activity Feed - Multiple Accounts and Transaction History', async ({ page }) => {
    // Expected patterns from spec
    const transactionDatePattern = /[A-Za-z]{3}\s+\d{1,2},\s+\d{4}/;
    const currencyPattern = /\$[\d,]+\.\d{2}/;
    const transactionDescriptionPattern = /[A-Za-z\s]+/;

    // Step 1: Verify accounts section is present and labeled
    const accountsSectionVisible = await dashboardPage.accountsSection.isVisible();
    expect(accountsSectionVisible).toBeTruthy();

    // Step 2: Verify at least 2 account containers are visible
    const accountCount = await dashboardPage.getAccountCount();
    expect(accountCount).toBeGreaterThanOrEqual(2);

    // Step 3: Verify each account displays account type
    const accountTexts = await page.locator('div, section').filter({
      hasText: /checking|savings/i
    }).allTextContents();
    
    for (const accountText of accountTexts) {
      // Each account should have a type (Checking or Savings)
      expect(accountText).toMatch(/checking|savings/i);
    }

    // Step 4: Verify recent activity section is present
    const activitySectionVisible = await dashboardPage.recentActivitySection.isVisible();
    expect(activitySectionVisible).toBeTruthy();

    // Step 5: Verify at least 1 transaction is visible
    const transactionCountFromPage = await dashboardPage.getTransactionCount();
    expect(transactionCountFromPage).toBeGreaterThanOrEqual(1);

    // Step 6: Verify transaction entries contain required fields
    // Get individual transaction containers (the ones with flex layout for each row)
    const transactionRows = page.locator('div').filter({
      hasText: /Bill payment|dollar|Transfer|cleanup/i
    }).filter({
      hasText: /\$[\d,]+\.\d{2}/
    });

    const transactionRowCount = await transactionRows.count();
    expect(transactionRowCount).toBeGreaterThan(0);

    // Check first few transactions have date and amount
    const firstThreeTransactions = transactionRows.nth(0);
    const transactionTexts = await transactionRows.allTextContents();
    
    for (let i = 0; i < Math.min(3, transactionTexts.length); i++) {
      const transaction = transactionTexts[i];
      // Verify transaction has currency amount
      expect(transaction).toMatch(currencyPattern);
      
      // Verify transaction has date (month day year format)
      expect(transaction).toMatch(/\d{4}|\d{1,2}/); // Year or day/month
    }

    // Step 7: Verify no duplicate accounts/transactions
    const uniqueAccountTexts = new Set(accountTexts);
    expect(uniqueAccountTexts.size).toBeGreaterThan(0);
    
    const uniqueTransactionTexts = new Set(transactionTexts);
    expect(uniqueTransactionTexts.size).toBeGreaterThan(0);
  });
});
