# Ejecución — Feature 04 / Task 07 — Dividers (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_07_motion_dividers.md`  
**Figma:** [Dividers / Horizontal](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=3031-40774) · `nodeId: 3031:40774`

## Objetivo

Implementar el átomo **Dividers** (horizontal) en el catálogo con layout y tokens alineados al resto de átomos Feature 04.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (3031:40774) | `Border color.border-primary` #d0d5dd |
| `get_metadata` | Frame **Horizontal** 360×91; 3 símbolos: Middle-inset, Inset, Full-width @ 320px ancho |
| `get_design_context` | Inset `pl-16`; Middle-inset `px-16`; línea 1px full width |

> El node `3031:40774` documenta solo variantes **horizontales**. No hay frame vertical en este nodo.

## Mapeo Figma → tokens

| Propiedad | Valor Figma | Token / CSS |
|-----------|-------------|-------------|
| Stroke | 1px | `--ds-divider-thickness` |
| Color | border-primary | `--ds-divider-color` → `var(--ds-input-border)` |
| Inset | 16px | `--ds-divider-inset` |
| Ancho preview | 320px | `--ds-divider-preview-width` |

## Variantes (controles)

| Variante | Padding |
|----------|---------|
| Full-width | — |
| Inset | `padding-left: 16px` |
| Middle inset | `padding-left/right: 16px` |

Controles: **Variant**, **Preview width** (320 / 480 / 100%), **Preview mode** (single / all).

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `dividers.module.css` | **Nuevo** |
| `dividers-view.tsx` | **Nuevo** — preview, spec, panel, CodeModal |
| `routes.tsx` | Registro `DividersView` |
| `atom-catalog-routes.ts` | `status: review`, `motion-dividers-view` → `dividers-view.tsx` |

## DoD

- [x] Vista alineada al frame Figma `3031:40774`.
- [x] Sin hex en CSS fuente (color vía `resolveJsonBorderColor` + alias `--ds-input-border`).
- [x] CodeModal html + css.
- [x] `npm run build` en verde.

## Verificación

```
npm run build → OK
npm run test  → OK
```
