// @ts-check

/**
 * Page Object: catálogo y página de producto.
 */
class ProductPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }).first();
    this.productLinks = page.locator('a[href*="/products/"]');
  }

  async gotoCatalog() {
    await this.page.goto('/collections/all');
  }

  /**
   * Abre el producto único en la posición indicada y lo agrega al carrito.
   * Se espera la respuesta de /cart/add para garantizar que el ítem quedó
   * agregado antes de continuar (evita abortar la petición al navegar).
   * @param {number} index posición del producto único (0 = primero)
   */
  async addProductByIndex(index) {
    await this.gotoCatalog();
    const hrefs = await this.productLinks.evaluateAll(
      (links) => [...new Set(links.map((a) => a.getAttribute('href')))]
    );
    await this.page.goto(hrefs[index]);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/cart/add') && r.status() < 400),
      this.addToCartButton.click(),
    ]);
  }
}

module.exports = { ProductPage };