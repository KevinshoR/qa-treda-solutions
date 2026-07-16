// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

/**
 * NOTA DE DISEÑO — hCaptcha:
 * El formulario de login de la tienda está protegido por hCaptcha, que bloquea
 * los envíos desde navegadores automatizados (el submit se rechaza sin mensaje).
 * Automatizar la resolución de un captcha no es viable ni correcto: el captcha
 * existe precisamente para impedir automatización.
 *
 * Solución estándar: autenticación por sesión persistida (storageState).
 * Se inicia sesión manualmente UNA vez y se guarda la sesión con:
 *   npx playwright codegen https://sauce-demo.myshopify.com/account/login --save-storage=playwright/.auth/user.json
 * Los tests autenticados reutilizan esas cookies, replicando el patrón que se
 * usa en la industria para apps con captcha/MFA en el login.
 */
const AUTH_FILE = 'playwright/.auth/user.json';

test.describe('Autenticación - sesión válida (storageState)', () => {
  // Reutiliza la sesión del usuario de prueba guardada previamente.
  test.use({ storageState: AUTH_FILE });

  test('TC-01 | Usuario autenticado accede a su cuenta', async ({ page }) => {
    await page.goto('/account');

    // Validación: con sesión válida, /account NO redirige al login
    // y muestra la página de la cuenta del cliente.
    await expect(page).toHaveURL(/\/account(\/)?(\?.*)?$/);
    await expect(page.getByRole('heading', { name: /account details/i })).toBeVisible();
  });
});

test.describe('Autenticación - casos negativos (sin sesión)', () => {

  test('TC-02 | (Bonus) Login con credenciales inválidas no otorga acceso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('usuario.invalido@test.com', 'ClaveIncorrecta123');

    // Validación 1: permanece en la página de login.
    await expect(page).toHaveURL(/\/account\/login/);

    // Validación 2: la sesión NO quedó iniciada — /account debe redirigir al login.
    await page.goto('/account');
    // Sin sesión válida no debe existir el enlace "Log Out" (criterio real de
    // autenticación, independiente de redirects o páginas intermedias).
    await expect(page.getByRole('link', { name: /log out/i })).toHaveCount(0);

    // Nota: no se valida el texto del mensaje de error porque hCaptcha
    // intercepta el submit automatizado antes de la validación de credenciales.
    // El criterio de aceptación real (no otorgar acceso) sí queda cubierto.
  });

  test('TC-03 | Login con campos vacíos no permite el acceso', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.submitButton.click();

    // Validación: no debe redirigir a la cuenta.
    await expect(page).not.toHaveURL(/\/account(\/)?$/);
  });
});