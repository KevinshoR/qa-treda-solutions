// @ts-check

/**
 * Page Object: página de login de la tienda (Shopify /account/login).
 * Centraliza selectores y acciones para que los tests no dependan del DOM.
 */
class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#CustomerEmail, input[name="customer[email]"]').first();
    this.passwordInput = page.locator('#CustomerPassword, input[name="customer[password]"]').first();
    this.submitButton = page.locator('form[action*="/account/login"] [type="submit"], input[value="Sign In"]').first();
    this.errorMessage = page.locator('.errors, .form-message--error, [class*="error"]').first();
  }

  async goto() {
    await this.page.goto('/account/login');
  }

  /**
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };
