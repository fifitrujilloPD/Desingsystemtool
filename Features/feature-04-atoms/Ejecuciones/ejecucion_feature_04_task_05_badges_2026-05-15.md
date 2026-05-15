# Ejecución — Feature 04 / Task 05 — Badges (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_05_badges.md`  
**Figma:** [Badges](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=3-8722) · `nodeId: 3:8722`

## Objetivo

Estandarizar el átomo **Badges** a tokens Feature 02 (`token-parser.ts`, sin `resolveColor` local), shell de catálogo compartido y controles de color alineados a Foundation JSON.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (3:8722) | `text-secondary` #344054, `border-primary` #d0d5dd, escalas Brand/neutral/error/success/warning y secondary orange/purple/pink/blue, `Corner/Small` 8, `Corner/Full` 1000, body 14/16 Roboto |

## Mapeo Figma → tokens JSON (Feature 02)

| Variante badge | Background | Text | Border |
|----------------|------------|------|--------|
| Outline | transparent | `Text colors.text-secondary` | `Border color.border-primary` |
| Brand | `Background.bg-brand-ships` | `Text colors.text-primary-brand` | `Border color.border-brand` |
| Gray | `Background.bg-primary` | `Text colors.text-secondary` | `Border color.border-secondary` |
| Red | `bg-error` | `text-error` | `border-error` |
| Green | `bg-success` | `text-success` | `border-success` |
| Yellow | `bg-warnning` | `text-warnning` | `border-warning` |
| Orange/Purple/Pink/Blue | `bg-{c}` | `text-{c}` | `border-{c}` |
| Dot (Outline) | — | `Text colors.*` (picker) | — |

Consumo en preview: variables CSS `--ds-badge-bg`, `--ds-badge-text`, `--ds-badge-border`, `--ds-badge-dot` (valores resueltos en runtime desde JSON; sin hex en fuentes CSS/TSX).

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `token-parser.ts` | `resolveJsonBackgroundColor`. |
| `badges.module.css` | **Nuevo.** Layout, tamaños, picker; colores vía `--ds-badge-*`. |
| `badges-view.tsx` | Refactor: `BADGE_COLOR_DEFS` + `token-parser`; shell `radio-button.module.css`; `CodeModal` html+css; picker por token Foundation; typo `Pinck` → `Pink`. |

## DoD

- [x] Vista alineada al frame Figma `3:8722` (medidas y variantes preservadas).
- [x] Sin literales de color en CSS del preview (hex solo en tarjetas spec / snippet generado).
- [x] **Ver código / variable / token** funcional (html + css).
- [x] `npm run test` y `npm run build` en verde.

## Verificación

```
npm run test  → OK
npm run build → OK
```
