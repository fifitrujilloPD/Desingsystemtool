# Ejecución — Feature 02: tasks 01 a 05 (plan, auditoría, capa tokens, ingesta, semántica)

**Fecha:** 2026-05-04  
**Agente / criterio:** `@Agents/fullstack-design-system`  
**Alcance:** cerrar entregables de **task_01** … **task_05** con evidencia en repo y SDD mínimo en **`Spec/proyect.md` §5.3**.

---

## Task 01 — Plan tokens + navegación

### Insumos en repo

- Carpeta **`Features/feature-02-variables-core-utp/insumos/`** creada con **`README.md`** (nombres esperados de JSON y comando `npm run tokens:ds`).
- Los ZIP originales del equipo **aún no** están en el repo (acción manual del equipo de diseño).

### Tabla rutas React ↔ UI ↔ Atomic (estado actual código)

Orden ya implementado en `sidebar.tsx` + `routes.tsx`:

| Ruta (path) | Label sidebar | Atomic |
|-------------|---------------|--------|
| `/` y `/colors` | Colors | Foundations |
| `/icons` | Icons | Foundations |
| `/typography` | Typography | Foundations |
| `/spacing` | Spacing | Foundations |
| `/shadows` | Shadows | Foundations |
| `/atoms` | Buttons | Atoms |
| `/atoms/inputs` | Inputs | Atoms |
| `/atoms/badges` | Badges | Atoms |
| `/atoms/radio-buttons` | Radio Buttons | Atoms |
| `/atoms/checkboxes` | Checkboxes | Atoms |
| `/atoms/tabs` | Tabs | Atoms |
| `/atoms/switch` | Switch | Atoms |
| `/atoms/icons` | Icons | Atoms |
| `/molecules`, `/molecules/*` | Cards, Forms, … | Molecules |
| `/organisms`, `/organisms/*` | Navbar, Sidebar, … | Organisms |

**Figma navegación:** pendiente en charter §7 (URL cuando exista).

### Decisión: cómo referencian los componentes los tokens

1. **`theme.css`** sigue siendo la fuente de valores primitivos (`:root` / `.dark`) y el mapeo Tailwind `@theme inline`.  
2. **`ds-tokens.css`** añade **solo alias semánticos** `--ds-*` con `var(...)` hacia esas primitivas — **sin nuevos hex** en esa capa.  
3. **`generated/ds-tokens-generated.css`** se regenera con **`npm run tokens:ds`** cuando haya JSON en `insumos/` (hoy stub; parser por formato Figma export = trabajo siguiente cuando existan archivos).

**DoD task 01:** cumplido salvo URL Figma.

---

## Task 02 — Auditoría literales vs tokens

Muestra de **hex / literales** en `desarrollo-listo/src/app/**/*.tsx` (conteo de líneas con coincidencia por archivo):

| Archivo | Coincidencias `#rrggbb` (aprox.) |
|---------|----------------------------------|
| `checkbox-view.tsx` | 11 |
| `buttons-view.tsx` | 9 |
| `icons-view.tsx` | 7 |
| `tabs-view.tsx` | 6 |
| `inputs-view.tsx` | 4 |
| `foundation-table.tsx` | 4 |
| `badges-view.tsx` | 4 |
| `radio-button-view.tsx` | 4 |
| `switch-view.tsx` | 3 |
| `ui/switch.tsx` | 3 |
| `typography-view.tsx` | 2 |
| `icons-code-modal.tsx` | 2 |
| `dashboard-layout.tsx` | 1 |
| `sidebar.tsx` | 1 |
| `navbar.tsx` | 1 |
| `controls-panel-frame.tsx` | 1 |
| `code-modal.tsx` | 1 |
| `ui/chart.tsx` | 1 |

**Patrones:** `dark:bg-[#111111]`, `#FAFAFA` / `#0A0A0A` en layout, hex en vistas de catálogo y demos.

**Prioridad sugerida (P1):** shell compartido (`dashboard-layout`, `navbar`, `sidebar`, `controls-panel-frame`) para que el cambio de marca impacte en un solo sitio vía `var(--ds-*)`.

**DoD task 02:** inventario documentado; sin refactor en esta ejecución (corresponde a **task_06**).

---

## Task 03 — Capa única tokens runtime

**Implementado:**

- `desarrollo-listo/src/styles/ds-tokens.css` — variables `--ds-*` solo como alias.  
- Import en `desarrollo-listo/src/styles/index.css` **después** de `theme.css`.  
- `npm run build` **OK** tras los imports.

**DoD task 03:** cumplido (mecanismo base; ampliación con JSON = task 04).

---

## Task 04 — Ingesta JSON (insumos)

**Implementado:**

- Script `desarrollo-listo/scripts/merge-ds-tokens.mjs`.  
- Salida: `desarrollo-listo/src/styles/generated/ds-tokens-generated.css` (stub mientras no hay `*.json` en `insumos/`).  
- Script npm: **`tokens:ds`** en raíz `package.json`.  
- Documentado en **`Spec/proyect.md` §5.3**.

**Pendiente:** colocar JSON reales y extender el script al formato exacto del export Figma (estructura tipo `imports/Ligth_mode.tokens.json`).

**DoD task 04:** cumplido a nivel pipeline + stub; ingesta semántica profunda pendiente de insumos.

---

## Task 05 — Light / dark y alias semánticos

Definidos en **`ds-tokens.css`**:

- Superficies: `surface-app`, `surface-elevated`, `surface-chrome`, `surface-overlay`.  
- Texto: `text-primary`, `text-muted`.  
- Marca: `primary`, `on-primary`, `accent`, `on-accent`.  
- Estado: `success`, `warning`, `error`, `on-error`, `info` (mapeados a `--chart-*` / `--destructive` existentes — sin literales nuevos).

Como todos los alias apuntan a variables ya redefinidas en **`.dark`** dentro de `theme.css`, **no** hace falta duplicar bloque `.dark` en `ds-tokens.css` para estos alias.

**DoD task 05:** cumplido en primera iteración; afinar nombres 1:1 con JSON diseño cuando esté disponible.

---

## Comandos ejecutados

```text
npm run tokens:ds   → OK (stub sin JSON en insumos/)
npm run build             → OK
```

---

## Siguientes pasos sugeridos

1. Subir JSON a **`insumos/`** y ampliar **`merge-ds-tokens.mjs`**.  
2. **Task_06:** sustituir literales del shell por `var(--ds-*)` o utilidades que referencien esas vars.  
3. Pegar URL Figma en charter **§7**.

---

*Fin ejecución tasks 01–05.*
