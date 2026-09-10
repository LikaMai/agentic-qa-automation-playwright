/**
 * Login Page UI String Constants
 * Enterprise-grade constant bindings for login page messages and labels
 */

export const LOGIN_PAGE_MESSAGES = {
  // Form Labels and Placeholders
  EMAIL_PLACEHOLDER: 'you@example.com',
  SIGN_IN_BUTTON_LABEL: 'Sign in',
  
  // Error Messages (Regex patterns for flexible matching)
  ERROR_INVALID_CREDENTIALS: /invalid email or password|invalid credentials/i,
  ERROR_INVALID_EMAIL: /email.*required|required.*email|invalid email/i,
  ERROR_INVALID_PASSWORD: /password.*required|required.*password|password is required/i,
  ERROR_EMAIL_REQUIRED: /email.*required|required.*email|email is required/i,
  ERROR_PASSWORD_REQUIRED: /password.*required|required.*password|password is required/i,
  ERROR_AUTHENTICATION_FAILED: /authentication failed|login failed|failed to login/i,
  ERROR_GENERAL: /error|invalid|fail/i,
  
  // Success Messages
  SUCCESS_LOGIN: /dashboard|authenticated|welcome/i,
  
  // Page Indicators
  LOGIN_PAGE_INDICATOR: /login|sign in|sign-in/i,
} as const;

export const LOGIN_PAGE_SELECTORS = {
  EMAIL_INPUT: 'input[placeholder="you@example.com"]',
  PASSWORD_INPUT: 'input[type="password"]',
  SIGN_IN_BUTTON: 'button:has-text("Sign in")',
  ERROR_BANNER: 'p, span, div',
} as const;

export const LOGIN_PAGE_ROLES = {
  SIGN_IN_BUTTON: { role: 'button', name: 'Sign in' },
  EMAIL_INPUT: { placeholder: 'you@example.com' },
  PASSWORD_INPUT: { type: 'password' },
} as const;

