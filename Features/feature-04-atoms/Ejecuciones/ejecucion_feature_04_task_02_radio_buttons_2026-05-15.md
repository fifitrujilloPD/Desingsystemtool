# Ejecución — Feature 04 / Task 02 — Radio buttons (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_02_radio_buttons.md`  
**Figma:** [Radio buttons](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=7-16556) · `nodeId: 7:16556`

## Objetivo

Revisar y alinear el átomo **Radio buttons** con el frame Figma y los tokens Feature 02 (`--ds-*`), sin literales de color en JSX del preview.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (7:16556) | `text-primary` #0b1220, `button-color` #003d6d, `text-tertiary` #475467, `bg-container` #ffffff |
| `get_screenshot` (7:16556) | Grid 2×5: fila superior selected, inferior unselected; columnas Default / Hover / Focus / Press / Disabled; state layer circular ~8–12% del color del anillo |

### Mapeo Figma → tokens DS

| Uso en radio | Variable Figma (MCP) | Token JSON (tokens-3) | CSS consumo |
|--------------|----------------------|------------------------|-------------|
| Anillo + punto selected | `button-color` #003d6d | `Button color.button-color` → Brand.700 | `var(--ds-color-brand)` |
| Anillo unselected | `text-primary` | `Text colors.text-primary` → neutral.950 | `var(--ds-color-control-ink)` |
| Hover ring (spec) | — | `Button color.button-hover` → Brand.600 | `var(--ds-color-brand-hover)` |
| Label disabled | `text-tertiary` / secondary | `Text colors.text-secondary` | `var(--ds-color-control-ink-muted)` |
| State layer hover/focus | Alpha / color-mix | — | `color-mix(in srgb, var(--ds-radio-ring-color) 8% \| 12%, transparent)` |

> Los hex del MCP pueden diferir 1 tono del JSON resuelto (p. ej. text-primary MCP #0b1220 vs JSON neutral.950 #001525). **Fuente de verdad en runtime:** primitivos `--foundation-*` en `theme.css` + resolución `resolveJson*` para swatches de documentación.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `desarrollo-listo/src/styles/theme.css` | Primitivos `--foundation-brand-700/600`, `--foundation-text-primary/secondary` (light + dark). |
| `desarrollo-listo/src/styles/ds-tokens.css` | Alias `--ds-color-brand`, `--ds-color-brand-hover`, `--ds-color-control-ink`, `--ds-color-control-ink-muted`. |
| `desarrollo-listo/src/app/utils/token-parser.ts` | `resolveJsonButtonColor`, `resolveJsonTextColor`; grupo `Button color` en `resolveJsonColor`. |
| `desarrollo-listo/src/app/components/radio-button.module.css` | **Nuevo.** Estilos del átomo solo con `var(--ds-*)` y `color-mix`; medidas en custom properties del módulo. |
| `desarrollo-listo/src/app/components/radio-button-view.tsx` | Refactor: preview/spec/panel con tokens; `CodeModal` con `html` + `css` semánticos (sin hex en snippet). |

## DoD

- [x] Vista alineada al frame Figma `7:16556` (estados + galería All States).
- [x] Sin literales de color en estilos del preview (hex solo en tarjetas de documentación vía JSON resuelto).
- [x] **Ver código / variable / token** (`CodeModal` html + css con `var(--ds-*)`).
- [x] `npm run test` y `npm run build` en verde.

## Verificación

```
npm run test  → 2/2 OK
npm run build → OK
```

## Excepciones

Ninguna nueva. Los swatches de la sección **Colors (States)** muestran hex resuelto desde JSON como referencia, con `var(--ds-*)` como valor de consumo.
