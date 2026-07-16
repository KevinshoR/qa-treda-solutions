// @ts-check

/**
 * Page Object: carrito de compras.
 * La validación del contenido usa el endpoint /cart.js de Shopify (JSON),
 * que es estable e independiente del tema visual de la tienda.
 */
class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('input[name="checkout"], button[name="checkout"]').or(this.page.getByRole('button', { name: /check ?out/i })).first();
  }

  async goto() {
    await this.page.goto('/cart');
  }

  /** @returns {Promise<number>} cantidad de líneas de producto en el carrito */
  async itemCount() {
    const res = await this.page.request.get('/cart.js');
    const cart = await res.json();
    return cart.items.length;
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };