// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pruebas de API sobre ReqRes (https://reqres.in).
 * Requiere API key gratuita: registrarse en https://app.reqres.in,
 * generar "Use free key" y exportarla como variable de entorno:
 *   REQRES_API_KEY=reqres-free-v1  (ejemplo)
 */
const API_KEY = process.env.REQRES_API_KEY || 'reqres-free-v1';
const headers = { 'x-api-key': API_KEY };

test.describe('API ReqRes - Gestión de usuarios', () => {

  test('API-01 | GET /api/users/2 responde 200 con la estructura correcta', async ({ request }) => {
    const response = await request.get('/api/users/2', { headers });

    // Validación 1: código de respuesta
    expect(response.status()).toBe(200);

    // Validación 2: estructura del JSON
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('id', 2);
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('first_name');
    expect(body.data).toHaveProperty('last_name');
    expect(body.data).toHaveProperty('avatar');

    // Validación 3: tipos de datos
    expect(typeof body.data.email).toBe('string');
    expect(body.data.email).toMatch(/@/);
  });

  test('API-02 | POST /api/users crea usuario, responde 201 y retorna los datos enviados', async ({ request }) => {
    const nuevoUsuario = { name: 'Kevin Meneses', job: 'QA Analyst' };
    const response = await request.post('/api/users', { headers, data: nuevoUsuario });

    // Validación 1: código de respuesta
    expect(response.status()).toBe(201);

    // Validación 2: eco de los datos enviados
    const body = await response.json();
    expect(body.name).toBe(nuevoUsuario.name);
    expect(body.job).toBe(nuevoUsuario.job);

    // Validación 3: el servicio asigna id y fecha de creación
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('API-03 | (Extra) GET usuario inexistente responde 404', async ({ request }) => {
    const response = await request.get('/api/users/9999', { headers });
    expect(response.status()).toBe(404);
  });
});
