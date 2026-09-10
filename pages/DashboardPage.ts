import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly brandLogo: Locator;
  readonly navigationItems: Locator;
  readonly dashboardNavItem: Locator;
  readonly accountsNavItem: Locator;
  readonly moveMoneyNavItem: Locator;
  readonly transactionsNavItem: Locator;
  readonly cardsNavItem: Locator;
  readonly signOutButton: Locator;
  readonly welcomeHeading: Locator;
  readonly totalBalanceCard: Locator;
  readonly accountsSection: Locator;
  readonly accountContainers: Locator;
  readonly recentActivitySection: Locator;
  readonly transactionEntries: Locator;
  readonly DASHBOARD_URL = 'https://zincbank.cydeo.io/dashboard';

  constructor(page: Page) {
    this.page = page;
    
    // Navigation & Header Elements
    // Brand logo is in the navigation - ZincBank link with generic Z logo
    this.brandLogo = page.getByRole('link', { name: /ZincBank dashboard/i });
    this.navigationItems = page.getByRole('navigation', { name: /Primary/i });
    
    // Individual Navigation Items - directly from primary navigation
    this.dashboardNavItem = page.getByRole('link', { name: /^Dashboard$/i });
    this.accountsNavItem = page.getByRole('link', { name: /^Accounts$/i });
    this.moveMoneyNavItem = page.getByRole('link', { name: /^Move money$/i });
    this.transactionsNavItem = page.getByRole('link', { name: /^Transactions$/i });
    this.cardsNavItem = page.getByRole('link', { name: /^Cards$/i });
    
    // Sign Out Button
    this.signOutButton = page.getByRole('button', { name: /Sign out/i });
    
    // Welcome Greeting - h1 with Welcome, [Name] pattern
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome,\s+[A-Za-z]+/i });
    
    // Total Balance Card - contains "Total deposit balance" text
    this.totalBalanceCard = page.locator('div').filter({
      hasText: /Total deposit balance/i
    }).first();
    
    // Accounts Section - h2 "Your accounts"
    this.accountsSection = page.getByRole('heading', { name: /Your accounts/i }).locator('..').first();
    
    // Account containers - links containing account type and amount
    this.accountContainers = page.getByRole('link').filter({
      hasText: /Checking|Savings/i
    });
    
    // Recent Activity Section - h2 "Recent activity"
    this.recentActivitySection = page.getByRole('heading', { name: /Recent activity/i }).locator('..').first();
    
    // Transaction entries - generic containers with transaction description and amount
    this.transactionEntries = page.locator('div').filter({
      hasText: /Bill payment|dollar|transfer|cleanup/i
    });
  }

  /**
   * Assert that the Dashboard page is fully loaded with all critical elements
   * Verifies structural invariants defined in DASH-AC-01, AC-02, AC-03
   */
  async expectLoaded() {
    // Verify navigation to dashboard
    await this.page.waitForURL(url => url.pathname.includes('/dashboard'), { timeout: 10000 });
    
    // Verify page is responsive
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Allow partial load if networkidle times out
    });
    
    // Verify critical header elements are visible
    await this.brandLogo.waitFor({ state: 'visible', timeout: 5000 });
    await this.navigationItems.waitFor({ state: 'visible', timeout: 5000 });
    
    // Verify welcome greeting exists
    await this.welcomeHeading.waitFor({ state: 'visible', timeout: 5000 });
    
    // Verify accounts and balance sections exist
    await this.totalBalanceCard.waitFor({ state: 'visible', timeout: 5000 });
    await this.accountsSection.waitFor({ state: 'visible', timeout: 5000 });
    
    // Verify recent activity section exists
    await this.recentActivitySection.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Get the text content of the welcome greeting
   */
  async getWelcomeText(): Promise<string> {
    return await this.welcomeHeading.textContent() || '';
  }

  /**
   * Get all navigation item texts
   */
  async getNavigationItems(): Promise<string[]> {
    const items = await this.page.getByRole('navigation', { name: /Primary/i }).getByRole('link').allTextContents();
    return items.map(item => item.trim()).filter(item => item.length > 0 && !item.includes('dashboard'));
  }

  /**
   * Check if sign out button is visible
   */
  async isSignOutVisible(): Promise<boolean> {
    return await this.signOutButton.isVisible();
  }

  /**
   * Get total balance text
   */
  async getTotalBalance(): Promise<string> {
    return await this.totalBalanceCard.textContent() || '';
  }

  /**
   * Get count of account containers
   */
  async getAccountCount(): Promise<number> {
    return await this.accountContainers.count();
  }

  /**
   * Get all transaction entries
   */
  async getTransactionCount(): Promise<number> {
    return await this.transactionEntries.count();
  }
}
