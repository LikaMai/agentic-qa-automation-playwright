/**
 * API Testing Suite: Accounts & Authentication
 * Tests the health and security of API endpoints using Playwright's native request module
 */

import { test, expect, APIRequestContext } from '@playwright/test';
import { API_CONSTANTS, API_RESPONSE_VALIDATORS } from '../../constants/apiConstants';
import {
  PROTECTED_ROUTES,
  HEALTH_CHECK_TEST,
  RESPONSE_HEADER_VALIDATION,
} from '../../test-data/apiTestData';

function getBaseUrl(): string {
  const baseUrl = process.env.BASE_URL || 'https://zincbank.cydeo.io';
  if (!baseUrl) {
    throw new Error(
      'BASE_URL is not defined. Please ensure BASE_URL is set in .env or playwright.config.ts'
    );
  }
  return baseUrl;
}

test.describe('API Domain', () => {
  let baseUrl: string;
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    baseUrl = getBaseUrl();
    apiContext = await playwright.request.newContext({
      baseURL: baseUrl,
      ignoreHTTPSErrors: true, // Allow self-signed certificates
      maxRedirects: 0, // Do not follow redirects automatically (needed to capture 3xx status codes)
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.describe('API-HC-01: Health Check on BASE_URL', () => {
    test('Server responds with 200 OK on GET / and returns valid response headers', async () => {
      const response = await apiContext.get(HEALTH_CHECK_TEST.endpoint);

      await expect(response.status()).toBe(HEALTH_CHECK_TEST.expectedStatus);

      const statusCode = response.status();
      expect(API_RESPONSE_VALIDATORS.isSuccessResponse(statusCode)).toBeTruthy();

      const contentType = response.headers()[API_CONSTANTS.RESPONSE_HEADERS.CONTENT_TYPE];
      expect(contentType).toBeDefined();

      expect(contentType).toMatch(
        RESPONSE_HEADER_VALIDATION.headerPatterns.contentType
      );

      const serverHeader = response.headers()[API_CONSTANTS.RESPONSE_HEADERS.SERVER];
      expect(serverHeader).toBeDefined();

      const responseBody = await response.text();
      expect(responseBody.length).toBeGreaterThan(0);

      expect(response.ok()).toBeTruthy();
    });

    test('Response headers contain expected metadata and follow HTTP standards', async () => {
      const response = await apiContext.get(HEALTH_CHECK_TEST.endpoint);

      expect(response.status()).toBe(API_CONSTANTS.HTTP_STATUS.OK);

      const allHeaders = response.headers();
      expect(Object.keys(allHeaders).map(k => k.toLowerCase())).toContain(
        API_CONSTANTS.RESPONSE_HEADERS.CONTENT_TYPE.toLowerCase()
      );

      expect(Object.keys(allHeaders).map(k => k.toLowerCase())).toContain(
        API_CONSTANTS.RESPONSE_HEADERS.SERVER.toLowerCase()
      );

      const cacheControl = allHeaders[API_CONSTANTS.RESPONSE_HEADERS.CACHE_CONTROL];
      if (cacheControl) {
        expect(typeof cacheControl).toBe('string');
      }
    });
  });

  test.describe('API-SEC-01: Security Check - Unauthenticated Access', () => {
    test('Protected routes reject unauthenticated access with 401, 403, or redirect', async () => {
      for (const protectedRoute of PROTECTED_ROUTES) {
        const response = await apiContext.get(protectedRoute.path);
        const statusCode = response.status();

        // Assertion 1: Response status is an expected rejection code
        const isExpectedStatus = protectedRoute.expectedUnauthorizedStatus.includes(statusCode);
        expect(isExpectedStatus).toBeTruthy();
        
        // Provide context on failure
        if (!isExpectedStatus) {
          throw new Error(
            `Expected status ${protectedRoute.expectedUnauthorizedStatus.join(
              ' or '
            )} for route ${protectedRoute.path}, but got ${statusCode}`
          );
        }

        // Assertion 2: Response is not a successful 2xx response
        expect(response.ok()).toBeFalsy();

        // Assertion 3: Response indicates protection (4xx error, redirect, or auth requirement)
        const isProtected =
          API_RESPONSE_VALIDATORS.isClientError(statusCode) ||
          API_RESPONSE_VALIDATORS.isRedirect(statusCode);
        expect(isProtected).toBeTruthy();
      }
    });

    test('Unauthenticated access does not expose sensitive data', async () => {
      const testRoute = PROTECTED_ROUTES[0];
      const response = await apiContext.get(testRoute.path);

      const statusCode = response.status();
      // Assertion 1: Status code indicates route protection
      expect(
        testRoute.expectedUnauthorizedStatus.includes(statusCode)
      ).toBeTruthy();

      // Only check response body if there is one (redirects may have minimal body)
      const responseBody = await response.text();

      // Assertion 2: No sensitive data patterns in response
      const sensitivePatterns = [
        /password.*[:=]/i,
        /api.key|apikey|api_key|secret/i,
        /token.*[a-zA-Z0-9]{20,}/i,
      ];

      for (const pattern of sensitivePatterns) {
        expect(responseBody).not.toMatch(pattern);
      }

      // Assertion 3: Not a server error
      expect(
        API_RESPONSE_VALIDATORS.isServerError(statusCode)
      ).toBeFalsy();
    });

    test('Public routes remain accessible without authentication', async () => {
      const publicRoutes = ['/login', '/'];

      for (const publicRoute of publicRoutes) {
        const response = await apiContext.get(publicRoute);
        const statusCode = response.status();

        // Assertion 1: Public route returns successful response
        expect(statusCode).toBe(API_CONSTANTS.HTTP_STATUS.OK);

        // Assertion 2: Response is OK (not error)
        expect(response.ok()).toBeTruthy();

        // Assertion 3: No client errors
        expect(
          API_RESPONSE_VALIDATORS.isClientError(statusCode)
        ).toBeFalsy();

        // Assertion 4: No server errors
        expect(
          API_RESPONSE_VALIDATORS.isServerError(statusCode)
        ).toBeFalsy();
      }
    });
  });

  test.describe('API-SEC-02: Security Headers Validation', () => {
    test('Protected routes include proper response headers when rejecting access', async () => {
      const testRoute = PROTECTED_ROUTES[0];
      const response = await apiContext.get(testRoute.path);

      // Assertion 1: Response status code is an expected rejection code
      expect(
        testRoute.expectedUnauthorizedStatus.includes(response.status())
      ).toBeTruthy();

      const headers = response.headers();
      const headerKeys = Object.keys(headers).map(k => k.toLowerCase());

      // Assertion 2: Content-Type header is present
      expect(headerKeys).toContain(
        API_CONSTANTS.RESPONSE_HEADERS.CONTENT_TYPE.toLowerCase()
      );

      // Assertion 3: Server header is present (indicates active server)
      expect(headerKeys).toContain(
        API_CONSTANTS.RESPONSE_HEADERS.SERVER.toLowerCase()
      );

      // Assertion 4: Content-Type header value is defined and is a string
      const contentType = headers[API_CONSTANTS.RESPONSE_HEADERS.CONTENT_TYPE];
      expect(contentType).toBeDefined();
      expect(typeof contentType).toBe('string');
    });
  });

  test.describe('API-SMOKE-01: General API Health Verification', () => {
    test('API responds within acceptable timeframe without internal errors', async () => {
      const startTime = Date.now();
      const response = await apiContext.get('/');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(10000);

      expect(response.status()).toBe(API_CONSTANTS.HTTP_STATUS.OK);

      expect(
        API_RESPONSE_VALIDATORS.isServerError(response.status())
      ).toBeFalsy();

      const body = await response.text();
      expect(body).toBeDefined();
      expect(body.length).toBeGreaterThan(0);
    });

    test('API does not expose stack traces in error or redirect responses', async () => {
      // Note: /accounts should redirect when not authenticated
      const response = await apiContext.get('/accounts');

      const statusCode = response.status();
      const responseBody = await response.text();

      // Assertion 1: Response is either a redirect or client error (not a success)
      const isProtectedResponse =
        API_RESPONSE_VALIDATORS.isRedirect(statusCode) ||
        API_RESPONSE_VALIDATORS.isClientError(statusCode);
      expect(isProtectedResponse).toBeTruthy();

      // Assertion 2: No stack trace patterns in response body
      expect(responseBody).not.toMatch(/at\s+\w+\s+\(/);
      expect(responseBody).not.toMatch(/Error:\s+/);
      expect(responseBody).not.toMatch(/\/src\/|\/app\/|C:\\Users\\/i);

      // Assertion 3: Response is not a server error
      expect(
        API_RESPONSE_VALIDATORS.isServerError(statusCode)
      ).toBeFalsy();

      // Assertion 4: Status code is in expected range (3xx or 4xx)
      expect(statusCode).toBeGreaterThanOrEqual(300);
      expect(statusCode).toBeLessThan(500);
    });
  });
});
