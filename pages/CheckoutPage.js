// @ts-check

/**
 * Page Object: flujo de checkout de Shopify.
 * La tienda usa la pasarela de prueba (Bogus Gateway):
 * tarjeta "1" = aprobada, "2" = rechazada, "3" = fallo de pasarela.
 */
class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.email = page.locator('input[name="email"], #email').first();
    this.firstName = page.locator('input[name="firstName"]').first();
    this.lastName = page.locator('input[name="lastName"]').first();
    this.address = page.locator('input[name="address1"]').first();
    this.city = page.locator('input[name="city"]').first();
    this.postalCode = page.locator('input[name="postalCode"], input[name="zip"]').first();
    // País y provincia son <select>; en Colombia la provincia es obligatoria.
    this.country = page.locator('select[name="countryCode"]').first();
    this.province = page.locator('select[name="zone"]').first();
    this.payButton = page.getByRole('button', { name: /pay now|complete order/i }).first();
    this.confirmation = page.locator('text=/thank you|gracias|confirmed|confirmation/i').first();
  }

  /**
   * Llena los datos de envío con información de prueba.
   * @param {{email:string, nombre:string, apellido:string, direccion:string, ciudad:string, cp:string, departamento:string}} datos
   */
  /**
   * Llena los datos de envío. Si la cuenta ya tiene una dirección guardada
   * (de una compra anterior), Shopify la preselecciona y no muestra el
   * formulario: en ese caso no hay nada que llenar.
   * @param {{email:string, nombre:string, apellido:string, direccion:string, ciudad:string, cp:string, departamento:string}} datos
   */
  async fillShipping(datos) {
    if (await this.email.isVisible().catch(() => false)) await this.email.fill(datos.email);

    const formularioVisible = await this.firstName
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (!formularioVisible) return; // dirección guardada preseleccionada

    if (await this.country.isVisible().catch(() => false)) {
      await this.country.selectOption({ label: 'Colombia' }).catch(() => {});
    }
    await this.firstName.fill(datos.nombre);
    await this.lastName.fill(datos.apellido);
    await this.address.fill(datos.direccion);
    await this.city.fill(datos.ciudad);
    await this.postalCode.fill(datos.cp);
    await this.province.selectOption({ label: datos.departamento });
  }
}

module.exports = { CheckoutPage };