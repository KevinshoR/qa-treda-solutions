# Prueba de Calidad de Software — Treda Solutions

Suite de pruebas automatizadas (frontend + backend) para el flujo de autenticación y gestión de usuarios, con su estrategia de pruebas documentada.

**Autor:** Kevin Meneses González
**Estado de la suite:** ✅ 7/7 tests passing (4 UI + 3 API)

## Estructura del proyecto

```
├── docs/
│   ├── TEST_PLAN.md          # Estrategia: alcance, tipos de prueba, criterios de salida
│   └── CASOS_DE_PRUEBA.md    # Matriz: positivos, negativos y edge cases (con trazabilidad)
├── pages/                    # Page Object Model (POM)
│   ├── LoginPage.js
│   ├── ProductPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── frontend/             # UI: autenticación + flujo E2E de compra (SauceDemo/Shopify)
│   └── backend/              # API: ReqRes (GET/POST usuarios)
└── playwright.config.js
```

## Requisitos previos

1. **Node.js 18+**
2. **Usuario de prueba en la tienda**: crear una cuenta una única vez en
   https://sauce-demo.myshopify.com/account/register
3. **API key de ReqRes**: registrarse en https://app.reqres.in y generar la clave gratuita ("Use free key").

## Ejecución local

```bash
# 1. Instalar dependencias
npm install
npx playwright install chromium
```

**2. Guardar la sesión del usuario de prueba** (el login está protegido por hCaptcha; ver Nota sobre autenticación más abajo):

```bash
npx playwright codegen https://sauce-demo.myshopify.com/account/login --save-storage=playwright/.auth/user.json
```

En el navegador que se abre: pausar la grabación, iniciar sesión manualmente (resolviendo el captcha), verificar que la URL queda en `/account`, y cerrar la ventana para que se guarden las cookies.

Si hCaptcha bloquea incluso el login manual dentro del navegador automatizado (comportamiento conocido: detecta la automatización del navegador), el plan alterno es iniciar sesión en un navegador normal y copiar la cookie de sesión al archivo: DevTools (F12) → Application → Cookies → copiar el valor de `_shopify_essential` dentro de `playwright/.auth/user.json`.

**3. Configurar la API key** (⚠️ las variables de entorno viven solo en la terminal actual; configurarla en cada terminal nueva):

```bash
# PowerShell
$env:REQRES_API_KEY = "tu-api-key"
# Linux/Mac
export REQRES_API_KEY="tu-api-key"
```

**4. Correr la suite:**

```bash
npx playwright test            # todo (7 tests)
npm run test:frontend          # solo UI
npm run test:backend           # solo API
npm run test:headed            # UI en modo visual
```

## Reporte de ejecución

Reporte HTML integrado de Playwright, con screenshots, video y trace de los fallos:

```bash
npm run report
```

## Nota sobre autenticación (hCaptcha → storageState)

El formulario de login de la tienda está protegido por **hCaptcha**, que rechaza los envíos desde navegadores automatizados. Automatizar la resolución de un captcha no es viable ni correcto: el captcha existe precisamente para impedir automatización.

Se aplicó el patrón estándar de la industria para aplicaciones con captcha o MFA en el login: **autenticación por sesión persistida (`storageState`)**. Se inicia sesión manualmente una única vez, las cookies se guardan en `playwright/.auth/user.json` (excluido del repositorio por `.gitignore`) y los tests autenticados las reutilizan. Los casos negativos de login validan el criterio real de seguridad — que sin credenciales válidas **no se crea sesión** (ausencia del enlace "Log Out") — en lugar de depender de URLs o mensajes que el captcha intercepta.

## Justificación de herramientas

**¿Por qué Playwright + JavaScript?**

1. **Un solo framework para UI y API**: Playwright trae un cliente HTTP (`request`) integrado, lo que permite cubrir el frontend y el backend con la misma herramienta, el mismo runner y el mismo reporte.
2. **Esperas automáticas (auto-waiting)** y sincronización explícita con la red: por ejemplo, el flujo de carrito espera la respuesta de `/cart/add` antes de continuar, eliminando condiciones de carrera.
3. **Selectores accesibles (`getByRole`)**: resilientes a cambios del tema visual de la tienda.
4. **Evidencia de fallos de fábrica**: trace viewer, screenshots y video en una línea de configuración.
5. **JavaScript**: lenguaje de mi stack diario (Node/React), lo que facilita el mantenimiento. TypeScript sería la evolución natural.

**Patrón de diseño**: Page Object Model (POM). Los selectores y acciones viven en `pages/`; los tests solo expresan intención de negocio. Los ajustes de selectores durante el desarrollo se hicieron siempre en un solo lugar.

**Decisiones de robustez destacables:**
- Validación del carrito vía el endpoint `/cart.js` de Shopify (JSON), independiente del HTML del tema.
- El checkout es resiliente al estado de la cuenta: maneja tanto el formulario de envío (primera compra) como la dirección guardada preseleccionada (compras siguientes).
- Pago con la pasarela de prueba de Shopify (Bogus Gateway): tarjeta `1` = transacción aprobada.

## Integración continua

El workflow de GitHub Actions (`.github/workflows/tests.yml`) ejecuta la capa de **API** en cada push/PR y publica el reporte como artefacto. La capa de UI requiere la sesión persistida (por el hCaptcha) y su gestión segura en CI hace parte de la propuesta de mejora.

## Propuesta de mejora (con más tiempo)

- **Gestión segura de la sesión de UI en CI** (secreto cifrado o cuenta de servicio sin captcha en ambiente de staging) para ejecutar la suite completa en el pipeline.
- **TypeScript + ESLint + Prettier**: tipado estático y estilo homogéneo.
- **Fixtures de datos**: creación/limpieza de usuarios vía API antes de cada corrida.
- **Reporte Allure**: historial de ejecuciones y métricas de flakiness.
- **Pruebas de contrato**: validación de esquemas JSON con `zod`/`ajv` en el backend.
- **Observabilidad**: tendencia de pass-rate por build y alertas cuando fallen flujos críticos.
- **Cobertura multi-navegador y responsive**: extender los projects a Firefox, WebKit y viewport móvil.

## Notas

- ReqRes es una API simulada: el POST responde 201 con eco de los datos pero no persiste; las validaciones se centran en contrato y códigos de estado.
- No se emplean datos reales: usuario de prueba, dirección ficticia y tarjeta de la pasarela de pruebas.