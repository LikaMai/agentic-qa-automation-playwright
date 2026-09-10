/**
 * Authentication Test Data
 * Centralized test data for auth scenarios with environment variable bindings
 */

/**
 * Get secure credentials from environment variables
 * Throws clear error if credentials are not set
 */
export function getSecureCredentials() {
  const testUser = process.env.TEST_USER;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testUser) {
    throw new Error(
      'TEST_USER environment variable is not set. ' +
      'Please ensure .env file contains TEST_USER=<email>'
    );
  }

  if (!testPassword) {
    throw new Error(
      'TEST_PASSWORD environment variable is not set. ' +
      'Please ensure .env file contains TEST_PASSWORD=<password>'
    );
  }

  return {
    email: testUser,
    password: testPassword,
  };
}

/**
 * Valid authentication test case
 * Uses environment variables for actual credentials
 */
export const VALID_LOGIN_CASE = {
  description: 'Valid credentials from environment',
  credentials: () => getSecureCredentials(),
  expectedOutcome: 'success',
  expectedUrl: /dashboard|authenticated/i,
} as const;

/**
 * Invalid password test case
 * Uses valid email but wrong password
 */
export const INVALID_PASSWORD_CASE = {
  email: () => getSecureCredentials().email,
  password: 'WrongPassword123!@#',
  description: 'Valid email with invalid password',
  expectedOutcome: 'failure',
  expectedError: /invalid email or password|invalid credentials/i,
} as const;

/**
 * Empty email test case
 */
export const EMPTY_EMAIL_CASE = {
  email: '',
  password: 'SomePassword123',
  description: 'Empty email field',
  expectedOutcome: 'validation_error',
  expectedError: /email.*required|required.*email/i,
} as const;

/**
 * Empty password test case
 */
export const EMPTY_PASSWORD_CASE = {
  email: () => getSecureCredentials().email,
  password: '',
  description: 'Empty password field',
  expectedOutcome: 'validation_error',
  expectedError: /password.*required|required.*password/i,
} as const;

/**
 * Both fields empty test case
 */
export const EMPTY_CREDENTIALS_CASE = {
  email: '',
  password: '',
  description: 'Both email and password empty',
  expectedOutcome: 'validation_error',
  expectedError: /required/i,
} as const;

/**
 * Invalid email format test case
 */
export const INVALID_EMAIL_FORMAT_CASE = {
  email: 'not-an-email',
  password: 'SomePassword123',
  description: 'Invalid email format (no @ symbol)',
  expectedOutcome: 'validation_error',
  expectedError: /email|invalid|required/i,
} as const;

/**
 * All auth test scenarios for parameterized testing
 */
export const AUTH_TEST_SCENARIOS = [
  VALID_LOGIN_CASE,
  INVALID_PASSWORD_CASE,
  EMPTY_EMAIL_CASE,
  EMPTY_PASSWORD_CASE,
  EMPTY_CREDENTIALS_CASE,
  INVALID_EMAIL_FORMAT_CASE,
] as const;

