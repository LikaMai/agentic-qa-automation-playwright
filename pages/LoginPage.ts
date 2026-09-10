import { Page, Locator } from '@playwright/test';

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
    this.emailInput = page.getByPlaceholder('you@example.com');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    // 语义化过滤定位，避开 Next.js 隐藏的读屏标签
    this.errorBanner = page.locator('p, span, div').filter({ 
      hasText: /invalid email or password|invalid credentials|failed/i 
    });
  }

  // 1. 导航动作
  async goto() {
    await this.page.goto(this.LOGIN_URL);
  }

  // 2. 核心正向登录（带稳健的异步路由跳转等待）
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await Promise.all([
      this.page.waitForURL((url) => !url.pathname.endsWith('/login'), { timeout: 10000 }),
      this.signInButton.click(),
    ]);
  }

  // 3. 失败或空输入登录提交（不触发正常页面跳转）
  async submitCredentials(email?: string, pass?: string) {
    if (email) await this.emailInput.fill(email);
    if (pass) await this.passwordInput.fill(pass);
    await this.signInButton.click();
  }
}