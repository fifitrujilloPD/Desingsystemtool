# Ejecución — Feature 04 / Task 10 — Circle progress (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_10_circle_progress.md`  
**Figma:** [Loading indicator](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=978-298965) · `nodeId: 978:298965`

## Objetivo

Implementar el átomo **Circle progress** (indicador circular de carga) en el catálogo con layout estándar Feature 04.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_metadata` | Frame **Loading indicator** 765×148; 8 símbolos: `Property 1` = none \| with text × size sm/md/lg/xl |
| `get_variable_defs` | `bg-brand-ships`, `button-color`, `text-tertiary`, spacing-xl 16, tipografía body/14 y header/20 |
| `get_design_context` | Anillos 32/48/56/64px; gap 16px con texto; copy default "Loading..." |

## Mapeo Figma → tokens

| Uso | Token JSON | CSS var |
|-----|------------|---------|
| Track (anillo fondo) | Background.bg-brand-ships | `--ds-circle-track` |
| Arco activo | Button color.button-color | `--ds-circle-fill` |
| Etiqueta | Text colors.text-tertiary | `--ds-circle-label` |
| Gap vertical | spacing-xl | `--ds-circle-gap` (16px) |

## Tamaños (controles)

| Size | Diámetro | Stroke |
|------|----------|--------|
| sm | 32px | 3px |
| md | 48px | 4px |
| lg | 56px | 4px |
| xl | 64px | 4px |

Controles: **Size**, **Label** (switch), **Label text**, **Animate**, **Preview mode** (single / all variants), **Tokens (resolved)**.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `circle-progress.module.css` | **Nuevo** — anillo SVG, spin, galería |
| `circle-progress-view.tsx` | **Nuevo** |
| `routes.tsx` | `CircleProgressView` |
| `atom-catalog-routes.ts` | `status: review` |

## DoD

- [x] Vista alineada al frame Figma `978:298965`.
- [x] Sin hex en CSS fuente; `token-parser` + vars `--ds-circle-*`.
- [x] CodeModal html + css.
- [x] `npm run build` en verde.

## Verificación

```
npm run build → OK
npm run test  → OK
```
