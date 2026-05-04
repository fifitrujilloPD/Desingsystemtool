# Ejecución — Feature 03 / Task 08 — Icons Alert (2026-05-04)

**Charter:** `Features/feature-03-foundations-core-utp/informa/Feature-03/feature_03_foundations.md`  
**Task:** `Features/feature-03-foundations-core-utp/tasks/task_08_icons_alert.md`  
**Agentes:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre).

## Fuente Figma + MCP

- **URL:** [Design system / Icons Alert](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=556-147108&t=evAkrsjd6q4litn7-4)
- **Node ID:** `556:147108`
- **MCP Figma (`user-Figma Desktop`)** consultado:
  - `get_design_context` → estructura del frame (matriz 3 × 6 = 3 estados × 2 contenedores × 3 sizes).
  - `get_screenshot` → render de referencia para validación visual.
  - `get_variable_defs` → variables Figma usadas:

| Token Figma | Hex (light) | Uso en la vista |
|-------------|-------------|------------------|
| `Text colors.text-blue` | `#1570ef` | Color icono `info` |
| `Text colors.text-success` | `#079455` | Color icono `success` |
| `Text colors.text-error` | `#d92d20` | Color icono `error` |
| `Border color.border-success` | `#a6f4c5` | Borde `circle` success |
| `Border color.border-error` | `#fecdca` | Borde `circle` error |
| `secondary.blue.200` | `#b2ddff` | Borde `circle` info (vía `border-blue`) |
| `Background.bg-primary` | `#f9fafb` | Mapeado a `var(--ds-color-surface-elevated)` (badge) |
| `Border color.border-primary` | `#d0d5dd` | Mapeado a `var(--ds-color-border-default)` (badge) |
| `global.spacing.8` | `8` | Radius del badge |

> Los hex `text-*` y `border-*` se resuelven en runtime desde
> `desarrollo-listo/src/imports/Ligth_mode.tokens.json` /
> `darkmode.tokens.json` vía `resolveJsonColor()` (nuevo helper en
> `desarrollo-listo/src/app/utils/token-parser.ts`). Eso adapta light/dark
> automáticamente con el `theme-provider`.

## Implementación

- Tab nuevo **Alert Icons** dentro de `IconsView` (junto a *Material Icons* y *Flag icons*).
- Componente dedicado **`desarrollo-listo/src/app/components/alert-icons-tab.tsx`**:
  - Matriz **3 estados (info / success / error) × 2 contenedores (circle / badge)**.
  - Iconos via **Material Symbols Rounded** (`info`, `check_circle`, `error`) — misma familia que el resto de la vista.
  - Color del icono: hex resuelto del JSON Figma (`Text colors`); equivalente semántico documentado: `var(--ds-color-info | success | error)`.
  - Borde de la variante `circle`: hex JSON Figma (`Border color.border-{blue|success|error}`).
  - Variante `badge`: `background = var(--ds-color-surface-elevated)`, `border = 1px solid var(--ds-color-border-default)`, `border-radius = 8px`, `padding = 8px` — alineado al frame.
- **Panel derecho (ControlsPanelFrame):** cuando `iconTab === "alerts"`, **solo** se muestra `SegmentedControl Size` con `[16, 20, 24]` (sin selector de icono ni color, según pedido).
- **Acción “Ver código / variable / token”:** al seleccionar una celda aparece una píldora flotante con botón que abre `CodeModal` (HTML + CSS) mostrando el `var(--ds-color-*)` semántico y el token JSON Figma exacto en el snippet.
- **Search / Category** ocultos en el tab `alerts` (no aplican; mantiene panel limpio).

## Tokens y reglas

- Sin **hex literales en JSX/CSS**: todos los valores fluyen desde JSON Figma o desde `var(--ds-color-*)` definidas en `ds-tokens.css`.
- Reutiliza **`getFoundationColors()` / `resolveJsonColor()`** (`token-parser.ts`); no se introducen nuevas variables CSS.
- No se modifica shell, navbar, sidebar, panel de controles ni la pestaña Material/Flags.

## DoD (estado)

- [x] Cada estado (`info`, `success`, `error`) renderiza con el **token semántico** correspondiente; sin hardcode.
- [x] Vista alineada al frame Figma `556:147108` validada contra `get_screenshot` (light; dark hereda automáticamente del `theme-provider`).
- [x] Acción **Ver código / variable / token** funcional con `CodeModal` y mostrando `var(--ds-color-*)` + JSON token.
- [x] Spec actualizada: nota en `Spec/arquitectura-visual-ui.md` (sección iconos / Foundations) — ver commit que incluye este informe.
- [x] Informe de ejecución (este archivo).

## Verificación técnica

- `npm run test` → 2/2 OK (capa `lib/api`).
- `npm run build` → OK (Vite 6.3.5).

## Pendiente / decisiones futuras

- Si más adelante el design system define **tokens semánticos de borde por estado** (`--ds-color-border-info|success|error`) en `ds-tokens.css`, sustituir el hex resuelto en la variante `circle` por esas variables y actualizar `buildSnippet()` en `alert-icons-tab.tsx`. Hoy se mantiene resolución por JSON para no introducir tokens nuevos.
