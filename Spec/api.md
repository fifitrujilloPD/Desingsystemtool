# Spec — API y datos remotos (React / cliente HTTP)

Especificación de **cómo la app en `desarrollo-listo/`** (y futuros módulos React del repo) consume **APIs HTTP** o recursos remotos: estructura, convenciones y criterios verificables. Complementa **`Spec/proyect.md`** (SDD) y **`Spec/arquitectura.md`** (dónde vive la capa de red).

> **Estándar:** cliente **React + `fetch`** (o librería acordada y documentada) con módulos en **`app/lib/api/`** (o ruta equivalente en spec).

---

## 1. Objetivo de negocio

- **Contrato claro** entre frontend y backend: métodos, paths, tipos de cuerpo y códigos de error.
- **Un solo lugar por dominio** para armar requests, serializar y manejar errores (evitar `fetch` suelto en cada vista).
- **UX:** errores traducidos a mensajes de UI sin filtrar stack ni datos sensibles.

---

## 2. SDD para APIs / recursos remotos

| Artefacto | Contenido mínimo |
|-----------|------------------|
| **Intención** | Recurso, operación, actor. |
| **Contrato** | Método, URL o plantilla, query/body, códigos HTTP, forma del JSON (o enlace OpenAPI). |
| **Criterios de aceptación** | Caso feliz + al menos error (4xx/5xx o red). |

**Cláusula:** cambios en paths, payloads o semántica implican **actualizar esta spec** y el código en el mismo ciclo.

---

## 3. Estándar de código — capa API en React

### 3.1 Ubicación y responsabilidades

| Pieza | Responsabilidad |
|-------|-------------------|
| **`app/lib/api/`** (recomendado) | Funciones o clase liviana que encapsulan `fetch` (o cliente HTTP elegido), base URL, headers comunes. |
| **Tipos / DTOs** | `types.ts` colocalizado o `app/lib/api/types/` — reflejan contrato backend. |
| **Hooks** (`app/hooks/`) | Opcional: `useQueryX` que delegan en `lib/api` y exponen estado `{ data, error, loading }` a las vistas. |
| **Vistas `*-view.tsx`** | Orquestan UI; llaman hooks o funciones de `lib/api` sin duplicar URLs. |
| **Variables de entorno** | Prefijo **`VITE_`** expuesto vía `import.meta.env`; **nunca** secretos en el bundle. |

### 3.2 `fetch` y asincronía

- Usar **`async`/`await`** o helpers que devuelvan **`Promise`** tipada.
- Centralizar **`baseUrl`** desde `import.meta.env.VITE_API_BASE_URL` (o nombre acordado).
- Parsear JSON con validación mínima; no asumir forma del cuerpo de error sin type guard.

### 3.3 Errores

- Mapear **`response.ok === false`** y excepciones de red a un tipo **`ApiError`** o similar con `code`, `message` seguro para UI.
- No mostrar al usuario cuerpos crudos de 5xx.

### 3.4 Seguridad

- Auth: headers o cookies según backend; documentar en spec de auth si existe.
- **XSS:** no usar `dangerouslySetInnerHTML` con datos remotos sin sanitizar.

### 3.5 Testing

- **Vitest** (u otra herramienta del repo cuando se añada): mockear `global.fetch` o usar **MSW** para verificar URL, método y cuerpo.
- Al menos un test por función pública de la capa API que dispare red.

### 3.6 Versionado

- Versionar en path (`/v1/`) o header según backend; documentar en esta spec y en `.env.example` si existe.

---

## 4. Convenciones REST (referencia)

Igual que antes: recursos en plural, verbos HTTP semánticos, códigos 2xx/4xx/5xx documentados por operación.

---

## 5. Plantilla por endpoint (SDD)

```markdown
### [Dominio] — [Operación]

- **Método / path:** `GET /api/v1/...`
- **Request:** query / body (tipo TS)
- **Response:** `200` → tipo `...`
- **Errores:** `400` → … ; `401` → …
- **Implementación React:** `lib/api/xxx.ts` → función `nombreClaro()`
- **Criterios de aceptación:** …
```

### 5.1 Ejemplo — Health (ping de referencia)

- **Método / path:** `GET /health`
- **Request:** —
- **Response:** `200` → cuerpo JSON mínimo p. ej. `{ "status": "up" }` (tipo `HealthPingResponse` en código).
- **Errores:** fallo de red → `ApiError` código `NETWORK`; `!response.ok` → `HTTP` con `status`; JSON inválido → `PARSE`.
- **Implementación React:** `desarrollo-listo/src/app/lib/api/health.ts` → `getHealthPing()`; cliente común en `client.ts`, errores en `errors.ts`.
- **Tests:** `desarrollo-listo/src/app/lib/api/health.test.ts` (mock de `fetch`).
- **Criterios de aceptación:** con `VITE_API_BASE_URL` definido, la URL final es `{base}/health`; sin base, ruta relativa `/health` respecto al origin.

---

## 6. Relación con Atomic Design

- **`components/ui/`:** sin conocimiento de URLs de API; recibe datos por props.
- **Vistas de catálogo:** pueden disparar carga vía hooks; loading/error en la misma vista o subcomponente.

---

## 7. Checklist antes de merge

- [ ] Spec o bloque §5 actualizado para el endpoint.
- [ ] Sin URLs mágicas en JSX de vista; usar `lib/api` + env.
- [ ] Tests de red para funciones nuevas o cambiadas.
- [ ] `Spec/proyect.md` §6 si el cambio es transversal.

---

## 8. Contexto actual del repositorio

- La herramienta hoy es **principalmente estática** (catálogo + tokens); muchas vistas **no** llaman API de negocio.
- Existe **plantilla de capa HTTP** en `desarrollo-listo/src/app/lib/api/` (`client`, `errors`, ejemplo `getHealthPing`) con tests **Vitest** (`npm run test`).
- Ingesta de flags: script Node en `desarrollo-listo/scripts/` — ver **`Spec/proyect.md` §5.3`.
---

*Documento vivo: al elegir **Axios** o **TanStack Query**, añadir subsección con patrones obligatorios.*
