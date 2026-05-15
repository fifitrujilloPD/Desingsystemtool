# Ejecución — Feature 04 / Task 11 — Steppers (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_11_steppers.md`  
**Figma:** [Steps / light mode](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=167-66289) · `nodeId: 167:66289`

## Objetivo

Implementar el átomo **Steppers** (Done / Focus / Defaul) con tipos Desktop, Default, vertical y minimal.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_metadata` | Frame **Steps / light mode**; tipos Desktop, Default, Desktop vertical, none; estados Done, Focus, Defaul |
| `get_variable_defs` | `button-hover`, `bg-brand-ships`, `text-disabled`, `bg-container`, body/14 y body/12 medium |
| `get_design_context` | Círculo 28px, conector 2px, focus ring 4px `bg-brand-ships`, etiquetas según tipo |

## Mapeo Figma → tokens

| Uso | Token JSON | CSS var |
|-----|------------|---------|
| Círculo done/active | Button color.button-hover | `--ds-step-circle-done` |
| Círculo pending | Text colors.text-disabled | `--ds-step-circle-pending` |
| Número en círculo | Background.bg-container | `--ds-step-circle-on` |
| Label/conector activo | Button color.button-hover | `--ds-step-label-active` |
| Label/conector pending | Text colors.text-disabled | `--ds-step-label-pending` |
| Focus ring | Background.bg-brand-ships | `--ds-step-focus-shadow` |

## Layouts (controles)

| Layout | Figma Type |
|--------|------------|
| Desktop | Desktop — círculo + label en línea |
| Default | Default — círculo + conector arriba, label abajo |
| Desktop vertical | Desktop vertical — columna + conector vertical |
| None (minimal) | none — solo círculos |

Controles: **Layout**, **Step count** (2–5), **Active step**, **Labels** (switch + texto por paso), **Preview mode** (single / all layouts), **Tokens (resolved)**.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `steppers.module.css` | **Nuevo** |
| `steppers-view.tsx` | **Nuevo** |
| `routes.tsx` | `SteppersView` |
| `atom-catalog-routes.ts` | `status: review` |

## DoD

- [x] Vista alineada al frame Figma `167:66289`.
- [x] Sin hex en CSS fuente; `token-parser`.
- [x] CodeModal html + css.
- [x] `npm run build` en verde.

## Verificación

```
npm run build → OK
npm run test  → OK
```
