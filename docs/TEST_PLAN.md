# Test Plan Simplificado — Autenticación y Gestión de Usuarios

**Proyecto:** Prueba de Calidad de Software — Treda Solutions
**Autor:** Kevin Meneses
**Versión:** 1.0 · Julio 2026

## 1. Objetivo

Asegurar la estabilidad del flujo crítico de negocio: autenticación de usuarios en la tienda SauceDemo (frontend, Shopify) y gestión de usuarios vía API ReqRes (backend), mediante una estrategia combinada de pruebas manuales y automatizadas.

## 2. Alcance

**Dentro del alcance:**
- Frontend (https://sauce-demo.myshopify.com): registro/login de clientes, manejo de errores de autenticación, flujo de compra E2E (agregar productos al carrito y checkout hasta la confirmación).
- Backend (https://reqres.in): consulta de usuario (GET) y creación de usuario (POST), validando códigos de respuesta y contratos JSON.

**Fuera del alcance:**
- Pruebas de carga y estrés.
- Pruebas de seguridad avanzadas (pentesting); solo se cubren validaciones básicas de entrada.
- Compatibilidad multi-navegador exhaustiva (la suite corre en Chromium; la arquitectura permite extender a Firefox/WebKit).
- Funcionalidades de la tienda no relacionadas con autenticación o compra (blog, búsqueda, etc.).

## 3. Tipos de prueba a ejecutar

| Tipo | Nivel | Modalidad | Herramienta |
|---|---|---|---|
| Pruebas funcionales de UI | Sistema | Automatizada | Playwright |
| Pruebas E2E (login → carrito → checkout) | Sistema | Automatizada | Playwright |
| Pruebas de API (contrato y códigos de estado) | Integración | Automatizada | Playwright (request) |
| Pruebas negativas y de borde | Sistema | Manual + automatizada | Matriz de casos |
| Pruebas exploratorias del flujo de autenticación | Sistema | Manual | Sesión time-boxed 30 min |

## 4. Criterios de entrada

- Ambiente disponible (tienda demo y API accesibles).
- Usuario de prueba creado en la tienda.
- API key de ReqRes generada.

## 5. Criterios de aceptación / salida

- 100% de los casos de prueba diseñados ejecutados.
- 100% de los casos **críticos** (login exitoso, checkout E2E, GET/POST de API) en estado PASSED.
- 0 defectos bloqueantes o críticos abiertos.
- Defectos menores documentados con evidencia (captura/trace) y priorizados.
- Reporte de ejecución generado (HTML de Playwright) y adjunto a la entrega.

## 6. Riesgos y supuestos

| Riesgo/Supuesto | Mitigación |
|---|---|
| La tienda demo es pública y su contenido puede cambiar | Selectores robustos y centralizados en Page Objects |
| ReqRes es una API simulada (el POST no persiste datos) | Se valida contrato y eco de datos, no persistencia |
| La pasarela de pago es de prueba (Bogus Gateway) | Se usa la tarjeta de prueba documentada por Shopify |
| Datos de tarjetas/usuarios son ficticios | Nunca se usan datos personales reales |

## 7. Entregables

1. Este test plan.
2. Matriz de casos de prueba (`docs/CASOS_DE_PRUEBA.md`).
3. Suite de automatización (frontend + backend) con reporte HTML.
4. README con instrucciones de ejecución, justificación de herramientas y propuesta de mejora.
