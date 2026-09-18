/**
 * API Testing Constants
 * Centralized constants for API test suite
 */

export const API_CONSTANTS = {
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  } as const,

  // Response Headers
  RESPONSE_HEADERS: {
    CONTENT_TYPE: 'content-type',
    CONTENT_LENGTH: 'content-length',
    CACHE_CONTROL: 'cache-control',
    SERVER: 'server',
  } as const,

  // Common MIME types
  MIME_TYPES: {
    APPLICATION_JSON: 'application/json',
    TEXT_HTML: 'text/html',
  } as const,

  // API Endpoints (relative to BASE_URL)
  ENDPOINTS: {
    HEALTH: '/',
    LOGIN: '/login',
    ACCOUNTS: '/accounts',
    DASHBOARD: '/dashboard',
    PROTECTED_ROUTES: ['/accounts', '/dashboard', '/transactions', '/transfers'],
  } as const,

  // Security-related constants
  SECURITY: {
    UNAUTHORIZED_MESSAGE: /unauthorized|unauthenticated|not authenticated/i,
    FORBIDDEN_MESSAGE: /forbidden|access denied/i,
    REDIRECT_STATUS_CODES: [301, 302, 303, 307, 308],
  } as const,

  // Request Headers
  REQUEST_HEADERS: {
    ACCEPT: 'accept',
    ACCEPT_LANGUAGE: 'accept-language',
    USER_AGENT: 'user-agent',
  } as const,
} as const;

/**
 * Validation helpers for API responses
 */
export const API_RESPONSE_VALIDATORS = {
  /**
   * Validates that response is successful (2xx status code)
   */
  isSuccessResponse: (status: number): boolean =>
    status >= 200 && status < 300,

  /**
   * Validates that response is a client error (4xx status code)
   */
  isClientError: (status: number): boolean =>
    status >= 400 && status < 500,

  /**
   * Validates that response is a server error (5xx status code)
   */
  isServerError: (status: number): boolean =>
    status >= 500 && status < 600,

  /**
   * Validates that response indicates authentication required
   */
  isAuthenticationRequired: (status: number): boolean =>
    status === 401 || status === 403,

  /**
   * Validates that response is a redirect (3xx status code)
   */
  isRedirect: (status: number): boolean =>
    status >= 300 && status < 400,
} as const;
