# Ejecución — Feature 04 / Task 03 — Checkbox (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_03_checkbox.md`  
**Figma:** [Checkbox](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=6-6708) · `nodeId: 6:6708`

## Objetivo

Revisar y alinear el átomo **Checkbox** (selected, indeterminate, unselected, disabled) con el frame Figma y tokens Feature 02 (`--ds-*`).

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (6:6708) | `button-color` #003d6d, `text-primary-white` #ffffff, `text-primary` #0b1220, `text-secondary` #344054, `border-brand` #cfe4f3, `bg-container` #ffffff |
| `get_screenshot` (6:6708) | Grid 3×5: filas Selected / Indeterminate / Unselected; columnas Default / Hover / Focus / Press / Disabled; state layer circular; caja 18px radius 2px |

### Mapeo Figma → tokens DS

| Uso en checkbox | Variable Figma (MCP) | Token JSON | CSS consumo |
|-----------------|----------------------|------------|-------------|
| Fill selected / indeterminate | `button-color` #003d6d | `Button color.button-color` | `var(--ds-color-brand)` |
| Borde unselected | `text-secondary` #344054 | `Text colors.text-secondary` | `var(--ds-color-control-ink-muted)` |
| Icono check / dash | `text-primary-white` #ffffff | `Text colors.text-primary-white` | `var(--ds-color-on-primary)` |
| Fill disabled | `text-primary` | `Text colors.text-primary` | `var(--ds-color-control-ink)` |
| Label | `text-primary` | `Text colors.text-primary` | `var(--ds-color-control-ink)` |
| Label disabled | `text-secondary` | `Text colors.text-secondary` | `var(--ds-color-control-ink-muted)` |
| State layer | color-mix | — | 8% hover / 12% focus·press sobre `--ds-checkbox-state-color` |

> Reutiliza primitivos y alias añadidos en task_02 (`--foundation-*`, `--ds-color-brand`, `--ds-color-control-ink*`). Sin tokens nuevos en `theme.css` / `ds-tokens.css`.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `desarrollo-listo/src/app/components/checkbox.module.css` | **Nuevo.** Estilos del átomo con `var(--ds-*)`, `data-type` / `data-state` / `data-disabled`. |
| `desarrollo-listo/src/app/components/checkbox-view.tsx` | Refactor: sin hex inline; shell del catálogo vía `radio-button.module.css`; `CodeModal` con `html` + `css` semánticos. |

## DoD

- [x] Vista alineada al frame Figma `6:6708` (galería All States: 3 tipos × 5 estados).
- [x] Sin literales de color en estilos del preview (hex solo en tarjetas JSON de documentación).
- [x] **Ver código / variable / token** funcional.
- [x] `npm run test` y `npm run build` en verde.

## Verificación

```
npm run test  → 2/2 OK
npm run build → OK
```

## Corrección (2026-05-15) — iconos centrados

**Problema:** check/dash hechos con bordes CSS (`border-left` + `rotate`) quedaban descentrados respecto al box 18×18.

**Solución (Figma 6:6708):** iconos Material `check_small` / `check_indeterminate_small` como SVG 24×24 en `.iconOverlay`, centrados con `position: absolute; left/top: 50%; transform: translate(-50%, -50%)` sobre el **state layer** (40px), no dentro del contenedor 18×18 — igual que el frame.

## Excepciones

Ninguna nueva.
