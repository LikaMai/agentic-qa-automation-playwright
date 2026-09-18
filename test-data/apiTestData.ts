/**
 * API Testing Data
 * Test fixtures and protected route definitions
 */

import { API_CONSTANTS } from '../constants/apiConstants';

/**
 * Define protected routes that require authentication
 * Each route should return 401/403/redirect (3xx) when accessed without valid credentials
 */
export const PROTECTED_ROUTES = [
  {
    path: '/accounts',
    description: 'Accounts endpoint - requires authentication',
    expectedUnauthorizedStatus: [
      API_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      API_CONSTANTS.HTTP_STATUS.FORBIDDEN,
      307, // Temporary Redirect
      308, // Permanent Redirect
    ],
  },
  {
    path: '/dashboard',
    description: 'Dashboard endpoint - requires authentication',
    expectedUnauthorizedStatus: [
      API_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      API_CONSTANTS.HTTP_STATUS.FORBIDDEN,
      307,
      308,
    ],
  },
  {
    path: '/transactions',
    description: 'Transactions endpoint - requires authentication',
    expectedUnauthorizedStatus: [
      API_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      API_CONSTANTS.HTTP_STATUS.FORBIDDEN,
      307,
      308,
    ],
  },
] as const;

/**
 * Health check test case
 */
export const HEALTH_CHECK_TEST = {
  description: 'Health check on BASE_URL',
  endpoint: '/',
  expectedStatus: API_CONSTANTS.HTTP_STATUS.OK,
  expectedHeaders: {
    contentType: API_CONSTANTS.MIME_TYPES.TEXT_HTML,
  },
} as const;

/**
 * Security test cases for unauthenticated access
 */
export const SECURITY_TEST_CASES = {
  unprotectedRoutes: {
    description: 'Public routes should be accessible without authentication',
    routes: ['/login', '/'],
    expectedStatus: API_CONSTANTS.HTTP_STATUS.OK,
  },
  protectedRoutes: {
    description: 'Protected routes should reject unauthenticated access',
    routes: PROTECTED_ROUTES.map(r => r.path),
    expectedStatuses: [
      API_CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
      API_CONSTANTS.HTTP_STATUS.FORBIDDEN,
    ],
  },
} as const;

/**
 * Response header validation test
 */
export const RESPONSE_HEADER_VALIDATION = {
  requiredHeaders: [
    API_CONSTANTS.RESPONSE_HEADERS.CONTENT_TYPE,
    API_CONSTANTS.RESPONSE_HEADERS.SERVER,
  ],
  headerPatterns: {
    contentType: /^(application\/json|text\/html)/i,
  },
} as const;
