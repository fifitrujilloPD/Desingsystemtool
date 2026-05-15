# Ejecución — Feature 04 / Task 09 — Bar progress (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_09_bar_progress.md`  
**Figma:** [Progress bar](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=977-298525) · `nodeId: 977:298525`

## Objetivo

Implementar el átomo **Bar progress** (determinate) en el catálogo con layout estándar Feature 04 y controles para todas las variables del frame.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_metadata` | Frame **Progress bar** 2358×554; símbolos por **Style** (none, Right, Bottom, Flotting over, Flotting bottom) × **Progress** (10–100) |
| `get_variable_defs` | `bg-brand-ships`, `button-color`, `text-secondary`, `bg-container`, `border-secondary`, spacing 8/12/4, radius-full, radius-md, shadow-lg |
| `get_design_context` | Track 8px radius-full; fill `button-color`; label body/14; tooltip body/12 medium en `bg-container` + `border-secondary` |

## Mapeo Figma → tokens

| Uso | Token JSON | CSS var |
|-----|------------|---------|
| Track | Background.bg-brand-ships | `--ds-bar-track-bg` |
| Fill | Button color.button-color | `--ds-bar-fill-bg` |
| Label / tooltip text | Text colors.text-secondary | `--ds-bar-label-color`, `--ds-bar-tooltip-text` |
| Tooltip surface | Background.bg-container | `--ds-bar-tooltip-bg` |
| Tooltip border | Border color.border-secondary | `--ds-bar-tooltip-border` |

## Estilos (controles)

| Style | Comportamiento |
|-------|----------------|
| None | Solo barra |
| Right | Barra + % a la derecha (gap 12px) |
| Bottom | Barra + % abajo alineado a la derecha (gap 8px) |
| Floating over | Tooltip sobre el extremo del fill |
| Floating bottom | Tooltip bajo el extremo del fill |

Controles: **Style**, **Progress** (slider 0–100 + presets Figma), **Preview width**, **Preview mode** (single / all styles), panel **Tokens (resolved)**.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `bar-progress.module.css` | **Nuevo** |
| `bar-progress-view.tsx` | **Nuevo** — preview, spec, galerías, CodeModal html+css |
| `routes.tsx` | `BarProgressView` en `ATOM_VIEW_BY_ID` |
| `atom-catalog-routes.ts` | `status: review`, `bar-progress-view.tsx` |

## DoD

- [x] Vista alineada al frame Figma `977:298525` (5 estilos + progreso variable).
- [x] Sin hex en CSS fuente; resolución vía `token-parser`.
- [x] CodeModal html + css.
- [x] `npm run build` en verde.

## Verificación

```
npm run build → OK
npm run test  → OK
```
