# Ejecución — Feature 04 / Task 08 — Tabs (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_08_tabs.md`  
**Figma:** [Tabs](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=2-8279) · `nodeId: 2:8279`

## Objetivo

Estandarizar el átomo **Tabs** (Underline + Segmented) con tokens Feature 02, shell compartido y `tabs.module.css`.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (2:8279) | `text-secondary`, `button-hover`, `bg-primary`, `button-color`, `text-primary-white`, `text-primary-brand`, `border-primary`, `button-press`, `bg-container` |
| Variantes | Underline `20:7158` · Segmented `71:1612` / `71:1599` |

## Mapeo Figma → tokens

| Uso | Token JSON | CSS var |
|-----|------------|---------|
| Texto default | Text colors.text-secondary | `--ds-tab-text-muted` |
| Underline activo / indicador | Button color.button-hover | `--ds-tab-text-active`, `--ds-tab-indicator` |
| Track segmented | Background color.bg-primary | `--ds-tab-pill-track` |
| Pill seleccionada | Button color.button-color | `--ds-tab-pill-active-bg` |
| Texto pill seleccionada | Text colors.text-primary-white | `--ds-tab-pill-active-text` |
| Hover pill | Text colors.text-primary-brand | `--ds-tab-pill-hover-text` |
| Borde pill | Border color.border-primary | `--ds-tab-pill-border` |
| Focus ring | button-press + bg-container | `--ds-tab-pill-focus-outer` / `--ds-tab-pill-focus-inner` |

## Controles preservados

- Variant: Underline / Segmented
- Tab count 2–5, active tab, icon toggle + selector
- Labels por tab editables
- Galería **All states** (underline + segmented)

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `tabs.module.css` | **Nuevo** — underline + segmented, vars `--ds-tab-*` |
| `tabs-view.tsx` | Refactor: `token-parser`, shell `radio-button.module.css`, `CodeModal` html+css, sin JSON directo ni `resolveRef` local |
| `atom-catalog-routes.ts` | `status: review` (sin cambio de ruta) |

## DoD

- [x] Variantes Underline y Segmented en preview y controles.
- [x] Sin hex/rgba literales en JSX/CSS fuente (vars + `color-mix` en sombra pill).
- [x] CodeModal html + css.
- [x] `npm run build` y `npm run test` en verde.

## Verificación

```
npm run build → OK
npm run test  → OK (2 tests)
```
