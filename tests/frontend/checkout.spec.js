// @ts-check
const { test, expect } = require('@playwright/test');
const { ProductPage } = require('../../pages/ProductPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

/**
 * Flujo E2E autenticado. Reutiliza la sesión guardada en playwright/.auth/user.json
 * (ver nota sobre hCaptcha en login.spec.js).
 */
const AUTH_FILE = 'playwright/.auth/user.json';
const EMAIL = process.env.TEST_EMAIL || 'qa.treda.kevin@mailinator.com';

test.describe('Flujo E2E: sesión → carrito → checkout', () => {
  test.use({ storageState: AUTH_FILE });

  test('TC-04 | Agregar dos productos y completar checkout hasta confirmación', async ({ page }) => {
    // 1. Validar que la sesión está activa (equivale al login exitoso).
    await page.goto('/account');
    await expect(page).toHaveURL(/\/account(\/)?(\?.*)?$/);

    // 2. Agregar dos productos distintos al carrito.
    const productPage = new ProductPage(page);
    await productPage.addProductByIndex(0);
    await productPage.addProductByIndex(1);

    // 3. Validar que el carrito tiene al menos 2 líneas de producto.
    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.itemCount()).toBeGreaterThanOrEqual(2);

    // 4. Iniciar checkout y llenar datos de envío.
    await cartPage.startCheckout();
    const checkout = new CheckoutPage(page);
    await checkout.fillShipping({
      email: EMAIL,
      nombre: 'Kevin',
      apellido: 'QA',
      direccion: 'Calle 10 # 20-30',
      ciudad: 'Medellín',
      cp: '050001',
      departamento: 'Antioquia',
    });

    // 5. Pago con la pasarela de prueba de Shopify (Bogus Gateway):
    //    tarjeta "1", fecha futura, CVV "111". Los campos de tarjeta viven en
    //    iframes de Shopify, por eso se accede con frameLocator.
    const cardFrame = page.frameLocator('iframe[id*="card-fields-number"]');
    await cardFrame.locator('input[name="number"]').fill('1');
    await page.frameLocator('iframe[id*="card-fields-expiry"]').locator('input[name="expiry"]').fill('12/30');
    await page.frameLocator('iframe[id*="card-fields-verification"]').locator('input[name="verification_value"]').fill('111');
    const nameFrame = page.frameLocator('iframe[id*="card-fields-name"]');
    if (await nameFrame.locator('input[name="name"]').isVisible().catch(() => false)) {
      await nameFrame.locator('input[name="name"]').fill('Kevin QA');
    }
    await checkout.payButton.click();

    // 6. Validación final: pantalla de confirmación del pedido.
    await expect(checkout.confirmation).toBeVisible({ timeout: 30_000 });
  });
});