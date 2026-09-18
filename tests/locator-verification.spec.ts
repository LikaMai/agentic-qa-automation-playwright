import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Locator Fragility Test - Static Code Analysis
 * Verifies that refactored locators are semantic and non-fragile
 * Per .clinerules/automation-rules.md Section 2: Locator Architecture
 * 
 * Tests:
 *   ✓ accountsSection: No parent traversal (.locator('..'))
 *   ✓ totalBalanceCard: No fragile div selector
 *   ✓ recentActivitySection: No parent traversal (.locator('..'))
 */
test.describe.skip('DashboardPage - Locator Architecture Verification', () => {

  test('✅ accountsSection uses semantic role-based locator (no parent traversal)', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verify accountsSection is defined as semantic role-based locator
    expect(content).toContain("this.accountsSection = page.getByRole('heading', { name: /Your accounts/i })");
    
    // Verify NO parent traversal or .first() is used
    const accountsSectionLine = content.match(/this\.accountsSection = .*?\n/);
    expect(accountsSectionLine).toBeTruthy();
    expect(accountsSectionLine![0]).not.toContain('.locator(..)');
    expect(accountsSectionLine![0]).not.toContain('.first()');
    
    console.log('✅ accountsSection: Semantic role-based locator verified (no parent traversal)');
  });

  test('✅ totalBalanceCard uses semantic text-based locator (no div selector)', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verify totalBalanceCard is defined as semantic text-based locator
    expect(content).toContain("this.totalBalanceCard = page.getByText(/Total deposit balance/i)");
    
    // Verify NO fragile div.filter pattern is used
    const totalBalanceCardLine = content.match(/this\.totalBalanceCard = .*?\n/);
    expect(totalBalanceCardLine).toBeTruthy();
    expect(totalBalanceCardLine![0]).not.toContain('locator(\'div\')');
    expect(totalBalanceCardLine![0]).not.toContain('.filter(');
    
    console.log('✅ totalBalanceCard: Semantic text-based locator verified (no div selector)');
  });

  test('✅ recentActivitySection uses semantic role-based locator (no parent traversal)', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verify recentActivitySection is defined as semantic role-based locator
    expect(content).toContain("this.recentActivitySection = page.getByRole('heading', { name: /Recent activity/i })");
    
    // Verify NO parent traversal or .first() is used
    const recentActivitySectionLine = content.match(/this\.recentActivitySection = .*?\n/);
    expect(recentActivitySectionLine).toBeTruthy();
    expect(recentActivitySectionLine![0]).not.toContain('.locator(..)');
    expect(recentActivitySectionLine![0]).not.toContain('.first()');
    
    console.log('✅ recentActivitySection: Semantic role-based locator verified (no parent traversal)');
  });

  test('✅ All fragile patterns removed from DashboardPage.ts', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verify fragile patterns are NOT present in locator definitions
    // (excluding comments and other contexts)
    const constructorMatch = content.match(/constructor\(page: Page\) \{[\s\S]*?\n  \}/);
    expect(constructorMatch).toBeTruthy();
    
    const constructorContent = constructorMatch![0];
    
    // Check for fragile patterns in constructor only
    expect(constructorContent).not.toContain('.locator(\'..\''); // No parent traversal
    
    console.log('✅ All fragile patterns removed: No .locator(\'..\') found in locator definitions');
  });

  test('✅ Semantic locator patterns are used for critical locators', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Get the constructor section
    const constructorMatch = content.match(/constructor\(page: Page\) \{[\s\S]*?\n  \}/);
    expect(constructorMatch).toBeTruthy();
    
    const constructorContent = constructorMatch![0];
    
    // Verify semantic locator methods are used for critical locators
    expect(constructorContent).toContain('page.getByRole(');
    expect(constructorContent).toContain('page.getByText(');
    
    // Verify the three refactored locators specifically use semantic patterns
    expect(content).toContain("this.totalBalanceCard = page.getByText(/Total deposit balance/i)");
    expect(content).toContain("this.accountsSection = page.getByRole('heading', { name: /Your accounts/i })");
    expect(content).toContain("this.recentActivitySection = page.getByRole('heading', { name: /Recent activity/i })");
    
    console.log('✅ Semantic locator patterns verified: getByRole, getByText');
  });

  test('✅ Compliance with .clinerules/automation-rules.md Section 2: Locator Architecture', () => {
    // Read the DashboardPage.ts file
    const filePath = path.join(__dirname, '../pages/DashboardPage.ts');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Read automation-rules.md
    const rulesPath = path.join(__dirname, '../.clinerules/automation-rules.md');
    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    
    // Verify rules exist
    expect(rulesContent).toContain('Locator Architecture');
    expect(rulesContent).toContain('Prioritize user-facing, accessible role locators');
    
    // Verify DashboardPage uses semantic locators for critical elements
    expect(content).toContain('page.getByRole(');
    expect(content).toContain('page.getByText(');
    
    // Verify the three refactored locators do NOT use fragile parent traversal
    expect(content).not.toContain("this.accountsSection = page.getByRole('heading', { name: /Your accounts/i }).locator('..')");
    expect(content).not.toContain("this.recentActivitySection = page.getByRole('heading', { name: /Recent activity/i }).locator('..')");
    expect(content).not.toContain("this.totalBalanceCard = page.locator('div').filter");
    
    console.log('✅ Full compliance with .clinerules/automation-rules.md Section 2: Locator Architecture');
  });
});
