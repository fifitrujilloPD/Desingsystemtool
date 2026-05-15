# Ejecución — Feature 04 / Task 06 — Buttons (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_06_buttons.md`  
**Figma:** [Buttons](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=2-7813) · `nodeId: 2:7813`

## Objetivo

Estandarizar el átomo **Buttons** a tokens Feature 02 sin alterar el diseño visual; añadir variante **Outlined Blue / Gray** en controles.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (2:7813) | `button-color` #003d6d, `button-hover` #0c5a99, `text-primary-brand`, `border-brand` #cfe4f3, `border-primary` #d0d5dd, `bg-container`, `bg-brand-ships` / Brand.50, Corner/Small 8 |
| `get_design_context` | Variantes `Style=Outlined, Color=Blue|Gray`; Blue hover: `bg-brand-ships` + borde Brand.50; Gray: `border-primary` |

## Mapeo Figma → tokens JSON

| Variante | Background | Text | Border |
|----------|------------|------|--------|
| Primary | `Button color.button-*` | `text-primary-white` / `text-disabled` | — |
| Outlined Blue | `bg-container` / hover `bg-brand-ships` | `text-primary-brand` | `border-brand` / hover `Primary.Brand.50` |
| Outlined Gray | `bg-container` | `text-primary-brand` | `border-primary` |
| Link | transparent / hover `bg-container` | `text-primary-brand` | — |
| Disabled (outline) | `button-disabled` | `text-disabled` | `border-primary` |

Preview: `--ds-btn-bg`, `--ds-btn-text`, `--ds-btn-border` (sin hex en CSS fuente).

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `token-parser.ts` | `resolveJsonBrandColor` (escala Brand). |
| `buttons.module.css` | **Nuevo.** Layout + `--ds-btn-*` + inset shadow con `color-mix`. |
| `buttons-view.tsx` | Refactor: `resolveButtonAppearance`, shell compartido, `CodeModal` html+css, control **Outline color** Blue/Gray. |

## DoD

- [x] Vista alineada al frame Figma `2:7813`.
- [x] Sin literales de color en CSS del preview.
- [x] Outlined Blue y Gray en controles.
- [x] **Ver código** funcional.
- [x] `npm run test` y `npm run build` en verde.

## Verificación

```
npm run test  → OK
npm run build → OK
```
