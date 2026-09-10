import { Page, Locator } from '@playwright/test';
import { LOGIN_PAGE_MESSAGES } from '../constants/loginPageMessages';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorBanner: Locator;
  readonly LOGIN_URL = 'https://zincbank.cydeo.io/login';

  constructor(page: Page) {
    this.page = page;
    // 固化经过验证的稳定定位器
    this.emailInput = page.getByPlaceholder(LOGIN_PAGE_MESSAGES.EMAIL_PLACEHOLDER);
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByRole('button', { name: LOGIN_PAGE_MESSAGES.SIGN_IN_BUTTON_LABEL });
    // 语义化过滤定位，避开 Next.js 隐藏的读屏标签
    this.errorBanner = page.locator('p, span, div').filter({ 
      hasText: LOGIN_PAGE_MESSAGES.ERROR_INVALID_CREDENTIALS
    });
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto(this.LOGIN_URL);
  }

  /**
   * Perform a login action with provided credentials
   * Ensures proper async routing with deterministic URL navigation assertion
   * 
   * @param email - User email address (can use environment variables or test data)
   * @param password - User password (can use environment variables or test data)
   * @throws If credentials are not provided or login times out
   */
  async login(email: string, password: string) {
    // Guard checks for required credentials
    if (!email || !password) {
      throw new Error(
        'Login credentials are required. ' +
        'email and password must be non-empty strings. ' +
        'Consider using getSecureCredentials() from test-data/authData.ts'
      );
    }

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL((url) => !url.pathname.endsWith('/login'), { timeout: 10000 }),
      this.signInButton.click(),
    ]);
  }

  /**
   * Submit login form with optional credentials
   * Does NOT wait for successful navigation (allows testing failed login scenarios)
   * 
   * @param email - Optional email to fill
   * @param password - Optional password to fill
   */
  async submitCredentials(email?: string, password?: string) {
    if (email) await this.emailInput.fill(email);
    if (password) await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}