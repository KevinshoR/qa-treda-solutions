# Matriz de Casos de Prueba

**Convención de prioridad:** Alta = flujo crítico de negocio · Media = manejo de errores frecuentes · Baja = casos poco comunes.
**Automatizado:** ✅ incluido en la suite · ✍️ manual.

## Frontend — Autenticación (SauceDemo / Shopify)

### Casos positivos (happy path)

| ID | Caso | Precondición | Pasos | Resultado esperado | Prioridad | Auto |
|---|---|---|---|---|---|---|
| TC-01 | Login exitoso | Usuario registrado | 1. Ir a /account/login 2. Ingresar email y contraseña válidos 3. Enviar | Redirige a /account y muestra la cuenta del cliente | Alta | ✅ |
| TC-04 | Compra E2E | Usuario logueado | 1. Agregar 2 productos al carrito 2. Ir al carrito 3. Checkout 4. Llenar envío 5. Pagar con tarjeta de prueba | Pantalla de confirmación del pedido ("Thank you") | Alta | ✅ |
| TC-05 | Registro de cuenta nueva | Email no registrado | 1. Ir a crear cuenta 2. Llenar nombre, email, contraseña 3. Enviar | Cuenta creada y sesión iniciada | Alta | ✍️ |
| TC-06 | Logout | Usuario logueado | 1. Clic en cerrar sesión | Sesión cerrada; /account redirige a login | Media | ✍️ |

### Casos negativos

| ID | Caso | Precondición | Pasos | Resultado esperado | Prioridad | Auto |
|---|---|---|---|---|---|---|
| TC-02 | Credenciales inválidas | — | Login con email/contraseña incorrectos | Mensaje de error visible; permanece en login; no expone si el email existe | Alta | ✅ (Bonus) |
| TC-03 | Campos vacíos | — | Enviar el formulario sin datos | No inicia sesión; validación de campos requeridos | Alta | ✅ |
| TC-07 | Email con formato inválido | — | Login con "correo-sin-arroba" | Validación de formato; no envía la petición | Media | ✍️ |
| TC-08 | Contraseña correcta, email incorrecto | Usuario registrado | Login combinando datos de usuarios distintos | Error genérico de credenciales | Media | ✍️ |
| TC-09 | Checkout con carrito vacío | Sin productos | Ir directo a /cart y a checkout | No permite continuar; mensaje de carrito vacío | Media | ✍️ |

### Edge cases (casos de borde)

| ID | Caso | Pasos | Resultado esperado | Prioridad | Auto |
|---|---|---|---|---|---|
| TC-10 | Inyección en campos de login (`' OR 1=1--`, `<script>alert(1)</script>`) | Ingresar payloads en email/contraseña | Entrada tratada como texto; sin ejecución de script ni error 500 | Alta | ✍️ |
| TC-11 | Email con espacios al inicio/final | Login con " user@mail.com " | El sistema hace trim o rechaza consistentemente | Baja | ✍️ |
| TC-12 | Contraseña de longitud extrema (300+ caracteres) | Registro/login con contraseña muy larga | Manejo controlado; sin error de servidor | Baja | ✍️ |
| TC-13 | Doble clic rápido en "Pagar" | Doble submit en el checkout | Un solo pedido creado (idempotencia) | Media | ✍️ |
| TC-14 | Sesión expirada a mitad de checkout | Borrar cookies antes de pagar | Redirige a login sin perder el carrito o con mensaje claro | Baja | ✍️ |
| TC-15 | Agregar el mismo producto dos veces | Repetir "Add to cart" sobre el mismo ítem | El carrito incrementa cantidad (no duplica línea) o duplica de forma consistente | Baja | ✍️ |

## Backend — API ReqRes

### Casos positivos

| ID | Caso | Petición | Resultado esperado | Prioridad | Auto |
|---|---|---|---|---|---|
| API-01 | Consultar usuario existente | GET /api/users/2 | 200; JSON con data{id, email, first_name, last_name, avatar}; tipos correctos | Alta | ✅ |
| API-02 | Crear usuario | POST /api/users {name, job} | 201; retorna name y job enviados + id y createdAt | Alta | ✅ |

### Casos negativos y de borde

| ID | Caso | Petición | Resultado esperado | Prioridad | Auto |
|---|---|---|---|---|---|
| API-03 | Usuario inexistente | GET /api/users/9999 | 404 con cuerpo vacío `{}` | Media | ✅ |
| API-04 | Petición sin API key | GET /api/users/2 sin header x-api-key | 401 Unauthorized | Alta | ✍️ |
| API-05 | POST con cuerpo vacío | POST /api/users `{}` | El servicio responde de forma controlada (ReqRes: 201 con solo id/createdAt) — documentar comportamiento | Baja | ✍️ |
| API-06 | POST con tipos inválidos | POST /api/users {name: 123, job: true} | Comportamiento documentado; ideal: validación 400 | Baja | ✍️ |
| API-07 | ID no numérico | GET /api/users/abc | 404 o error controlado; nunca 500 | Baja | ✍️ |

## Trazabilidad

Los casos marcados ✅ están implementados en `tests/frontend/` y `tests/backend/` con el mismo ID en el nombre del test, lo que permite rastrear caso ↔ código ↔ reporte.
