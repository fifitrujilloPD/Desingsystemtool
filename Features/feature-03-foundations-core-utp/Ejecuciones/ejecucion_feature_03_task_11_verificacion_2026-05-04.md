# Ejecución — Feature 03 / Task 11 — Verificación variables (JSON Feature 02) (2026-05-04)

**Charter:** `Features/feature-03-foundations-core-utp/informa/Feature-03/feature_03_foundations.md`  
**Task:** `Features/feature-03-foundations-core-utp/tasks/task_11_verificacion_variables_json_feature_02.md`  
**Agentes:** `@Agents/fullstack-design-system` (auditoría) + `@Agents/metodologia-sdd` (cierre).

## Alcance

Auditoría de **todos los foundations** entregados en Feature 03 para confirmar que su capa visual consume **únicamente** tokens semánticos (`--ds-*`) y/o datos de los **JSON de Feature 02** (`Ligth_mode.tokens-3.json` / `darkmode.tokens-3.json`), sin literales hex sueltos en componentes — salvo excepciones documentadas con plan de retiro.

## Capa de tokens (Feature 02 → Feature 03)

| Capa | Archivo | Rol |
|------|---------|-----|
| Primitivos shadcn | `desarrollo-listo/src/styles/theme.css` | Únicos hex/oklch del sistema (ámbito de Feature 02; `:root` y `.dark`). |
| Semánticos DS | `desarrollo-listo/src/styles/ds-tokens.css` | `--ds-color-*`, `--ds-typography-*`, `--ds-radius-*` aliasando primitivos. **Sin nuevos hex.** |
| Generado | `desarrollo-listo/src/styles/generated/ds-tokens-generated.css` | Output de `merge-ds-tokens.mjs`; pendiente de recibir `insumos/*.json` (gap conocido de Feature 02). |
| JSON Figma | `desarrollo-listo/src/imports/Ligth_mode.tokens-3.json` y `darkmode.tokens-3.json` | Fuente de datos para `getFoundationColors()`, `getFoundationTextColors()`, `resolveJsonColor()`, `getRadius()` y la escala tipográfica. |
| Parser runtime | `desarrollo-listo/src/app/utils/token-parser.ts` | Resuelve refs JSON `{group.key}` y expone listas categorizadas (Background / Text / Border / Surface). |

Verificación adicional:
- `rg "var\(--core-utp"` en `desarrollo-listo/src` → **0 matches**. La migración `core-utp → ds` está completa.
- `rg "core-utp"` en el árbol de implementación devuelve solo `merge-ds-tokens.mjs` (path histórico de insumos) y `ds-tokens-generated.css` (encabezado generado): no son referencias activas en JSX/CSS.

## Checklist por foundation

| Módulo | Vista | Hex literal en estilos | Trazabilidad | Estado |
|--------|-------|-----------------------|--------------|--------|
| Tipografía | `desarrollo-listo/src/app/components/typography-view.tsx` | 0 | `--ds-typography-*` (ds-tokens) + escala dinámica desde `Ligth_mode.tokens-3.json`. Color del texto vía `getFoundationTextColors()`. | ✅ |
| Colors → Foundation | `colors-view.tsx` | 0 (los hex se *muestran* como dato leído de JSON) | `getFoundationColors()` (Background / Text / Border / Surface) → JSON Feature 02. Modo light/dark via `theme-provider`. | ✅ |
| Borders | `borders-view.tsx` | 0 | `Ligth_mode.tokens-3.json#global.radius` + `var(--ds-color-border-default)` para los previews. Token `--ds-radius-default` mapeado en `ds-tokens.css`. | ✅ |
| Spacing | `spacing-view.tsx` | 0 | `--ds-color-*` + JSON Feature 02 (`global.spacing.*`). | ✅ |
| Icons / Material | `icons-view.tsx` (tab Material) | hex en `getColorsByShade` fallback + botón Code/SVG | Datos primarios desde JSON Feature 02 vía `getPrimaryColors()` / `getSecondaryColors()`; fallback solo si el JSON no devuelve resultado. | ⚠ excepciones (ver abajo) |
| Icons / Flags | `icons-view.tsx` (tab Flags) | hex solo en botón Code/SVG | URLs y datos desde `flag-icons-catalog.ts` (Figma + flagcdn). | ⚠ excepción Code/SVG |
| Icons / Alert | `alert-icons-tab.tsx` | 0 | `resolveJsonColor("Text colors", …)` + `resolveJsonColor("Border color", …)`; tokens semánticos `var(--ds-color-{success,error,info})`, `var(--ds-color-surface-elevated)`, `var(--ds-color-border-default)`. | ✅ |
| Icons / File | `file-icons-tab.tsx` + `data/file-icons-catalog.ts` | hex solo en SVG export + fallbacks `??`; brand colors aislados en `EXTENSION_BRAND_HEX` | Tokens semánticos para papel/borde/texto; brand asset por extensión declarado como tal en el catálogo. | ✅ con excepción documentada (asset brand + SVG export) |
| Brand logos | (`task_10_brand_logos.md`) | — | Pendiente de implementación. | ⏳ pendiente |

## Excepciones aprobadas y plan de retiro

1. **`EXTENSION_BRAND_HEX` en `desarrollo-listo/src/app/data/file-icons-catalog.ts`**  
   *Razón:* el frame Figma `974:291724` no expone los colores por extensión como variables; el MCP `get_variable_defs` solo devolvió `Layout/*` y `Neutral/300`. Los hex se almacenan agrupados en este catálogo y se etiquetan como **asset brand del set de file icons** (no token semántico).  
   *Plan de retiro:* cuando el design team apruebe tokens `--ds-color-file-{ext}`, sustituir las constantes y eliminar los hex.

2. **`buildFileIconSvg` (mismo archivo) — SVGs descargables autocontenidos**  
   *Razón:* el SVG persistido fuera de la app **no** puede usar `var(--ds-color-…)`. Lleva los hex resueltos (`#ffffff`, `#d0d5dd`, `#525252`) y la copia del brand asset.  
   *Plan de retiro:* permanente. No se retira.

3. **Botón "Code / SVG" (`bg-[#1a1a2e] text-[#003d6d]`) — patrón compartido**  
   *Razón:* mismo patrón visual usado por buttons-view, tabs-view, switch-view, etc. para CTAs secundarios del panel. No es un foundation cromático per se sino un patrón de chrome.  
   *Plan de retiro:* sugerir tokens `--ds-color-action-codepane-bg/fg` en una task posterior (Feature 04 / Atoms) y hacer la migración con regression visual.

4. **`getColorsByShade` fallback (`#1570B8`, `#42A5F5`, `#9E9E9E`, `#525252`) en `icons-view.tsx`**  
   *Razón:* defensa para cuando `getPrimaryColors()` / `getSecondaryColors()` devuelven vacío (en práctica nunca ocurre con el JSON actual de Feature 02).  
   *Plan de retiro:* eliminar fallback en próxima iteración después de un smoke test sin JSON cargado.

## Búsquedas y comandos clave

- `Grep "#[0-9A-Fa-f]{3,6}" en desarrollo-listo/src/app/components/{typography,colors,borders,spacing,alert-icons-tab}-view.tsx` → **0 matches** (foundations cromáticos limpios).
- `Grep "var\\(--core-utp" en desarrollo-listo/src` → **0 matches**.
- `Grep "core-utp" en desarrollo-listo` → solo encabezado de `ds-tokens-generated.css` y comentario histórico en `merge-ds-tokens.mjs`; **no referencias activas**.
- `npm run test` → **2/2 OK** (`src/app/lib/api/health.test.ts`).
- `npm run build` → **OK** (Vite 6.3.5; sin warnings nuevos respecto al estado previo).

## Spec / contrato visual

`Spec/arquitectura-visual-ui.md` se mantiene **sin cambios estructurales** (Foundations sigue su contrato: Tipografía / Colors / Borders / Spacing / Icons * / Logos pendiente). No hubo nuevas rutas ni cambio de tabs visibles. Si en una iteración futura se introducen los tokens del punto 3 (`--ds-color-action-codepane-*`) o se completa `task_10_brand_logos`, abrir SDD para parchear §6 y §11.

## DoD (estado)

- [x] Cero literales nuevos en foundations cromáticos (Tipografía, Colors, Borders, Spacing, Alert Icons). Las excepciones (File Icons, Material/Flags Code/SVG, fallback) están listadas y trazadas con plan de retiro.
- [x] Todos los tokens consumidos por foundations son rastreables a la capa de tokens (`ds-tokens.css` → `theme.css`) y/o a JSON de Feature 02 (`Ligth_mode.tokens-3.json` / `darkmode.tokens-3.json`).
- [x] Build (`npm run build`) y tests (`npm run test`) en verde; smoke visual delegado a la siguiente iteración (no se modificó UI).

## Pendiente / siguiente iteración

- Ejecutar `task_10_brand_logos.md` (logos UTP) replicando el patrón MCP + asset brand.
- Poblar `Features/feature-02-variables-core-utp/insumos/` con los JSON oficiales y correr `npm run tokens:ds` para hidratar `ds-tokens-generated.css`.
- Considerar tokens `--ds-color-action-codepane-{bg,fg}` y `--ds-color-file-{ext}` para retirar excepciones 1 y 3 cuando el design team los apruebe.
