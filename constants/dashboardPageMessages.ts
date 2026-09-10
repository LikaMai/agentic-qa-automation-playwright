/**
 * Dashboard Page UI String Constants
 * Enterprise-grade constant bindings for dashboard page messages and labels
 */

export const DASHBOARD_PAGE_MESSAGES = {
  // Navigation Items
  NAV_DASHBOARD: 'Dashboard',
  NAV_ACCOUNTS: 'Accounts',
  NAV_MOVE_MONEY: 'Move money',
  NAV_TRANSACTIONS: 'Transactions',
  NAV_CARDS: 'Cards',
  NAV_SIGN_OUT: 'Sign out',
  
  // Welcome Section
  WELCOME_GREETING_PATTERN: /Welcome,\s+[A-Za-z]+/i,
  
  // Balance Section
  TOTAL_BALANCE_LABEL: /Total deposit balance/i,
  CURRENCY_FORMAT: /\$[\d,]+\.\d{2}/,
  
  // Accounts Section
  ACCOUNTS_SECTION_LABEL: /Your accounts/i,
  ACCOUNT_TYPES: /Checking|Savings/i,
  
  // Recent Activity Section
  ACTIVITY_SECTION_LABEL: /Recent activity/i,
  TRANSACTION_TYPES: /Bill payment|dollar|transfer|cleanup/i,
  TRANSACTION_DATE_PATTERN: /[A-Za-z]{3}\s+\d{1,2},\s+\d{4}/,
} as const;

export const DASHBOARD_PAGE_SELECTORS = {
  BRAND_LOGO: 'a[href*="dashboard"]',
  NAVIGATION: 'nav',
  SIGN_OUT_BUTTON: 'button:has-text("Sign out")',
  WELCOME_HEADING: 'h1',
  TOTAL_BALANCE_CARD: 'div:has-text("Total deposit balance")',
  ACCOUNTS_SECTION: 'h2:has-text("Your accounts")',
  RECENT_ACTIVITY_SECTION: 'h2:has-text("Recent activity")',
} as const;

export const DASHBOARD_PAGE_ROLES = {
  BRAND_LOGO: { role: 'link', name: /ZincBank dashboard/i },
  NAVIGATION: { name: /Primary/i },
  DASHBOARD_NAV: { role: 'link', name: /^Dashboard$/i },
  ACCOUNTS_NAV: { role: 'link', name: /^Accounts$/i },
  MOVE_MONEY_NAV: { role: 'link', name: /^Move money$/i },
  TRANSACTIONS_NAV: { role: 'link', name: /^Transactions$/i },
  CARDS_NAV: { role: 'link', name: /^Cards$/i },
  SIGN_OUT_BUTTON: { role: 'button', name: /Sign out/i },
  WELCOME_HEADING: { role: 'heading', name: /Welcome,\s+[A-Za-z]+/i },
} as const;

