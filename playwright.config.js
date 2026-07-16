// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * Configuración de Playwright
 * - Dos proyectos: frontend (UI SauceDemo/Shopify) y backend (API ReqRes).
 * - Reporte HTML integrado (se abre con: npx playwright show-report).
 * - Reintentos y trazas activadas para facilitar el diagnóstico de fallos.
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'frontend',
      testDir: './tests/frontend',
      use: {
        baseURL: 'https://sauce-demo.myshopify.com',
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'backend',
      testDir: './tests/backend',
      use: {
        baseURL: 'https://reqres.in',
      },
    },
  ],
});
