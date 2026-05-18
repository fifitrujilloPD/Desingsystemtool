# Ejecución — Feature 05 / Task 02 — Date picker menu (2026-05-18)

**Task:** `Features/feature-05-molecules/tasks/task_02_date_picker_menu.md`  
**Node Figma:** `981:283052`  
**MCP:** `get_design_context`, `get_screenshot`, `get_variable_defs` (2026-05-18)

## Objetivo cumplido

Molécula **Date picker menu** en `/molecules/date-picker-menu` con layout de catálogo (Inputs), componiendo átomos existentes.

## Composición de átomos

| Átomo | Implementación en molécula |
|-------|---------------------------|
| Input | `MenuInputField` → `inputs.module.css` (campo compacto 44px) |
| Button | `CatalogButton` + `resolveButtonAppearance` exportados desde `buttons-view.tsx` |
| Calendar cell | `CalendarCellPreview` + `calendarCellThemeVars` desde `calendar-cell-view.tsx` |
| Icons | Material Symbols (`navigate_before`, `navigate_next`) |

## Archivos nuevos / modificados

| Archivo | Cambio |
|---------|--------|
| `date-picker-menu.tsx` | Componente molécula `DatePickerMenu` |
| `date-picker-menu.module.css` | Panel 328px, sombra, grid, footer |
| `date-picker-menu-view.tsx` | Vista catálogo + controles + CodeModal |
| `menu-input-field.tsx` | Wrapper Input para menú |
| `buttons-view.tsx` | Export `CatalogButton`, `resolveButtonAppearance` |
| `calendar-cell-view.tsx` | Export `calendarCellThemeVars` |
| `molecule-catalog-routes.ts` | `date-picker-menu` → status `review` |
| `routes.tsx` | `MOLECULE_VIEW_BY_ID` → `DatePickerMenuView` |

## Variantes en preview (panel)

- Type: Single date / Dual dates  
- Breakpoint: Desktop / Mobile  
- Pre-set ranges (dual)  
- Footer actions (Cancelar / Aplicar)  
- Día seleccionado interactivo en cuadrícula demo (Enero 2024)

## Mapa Figma → tokens

| Uso | Token |
|-----|--------|
| Panel surface | `var(--ds-color-surface-container)` |
| Border | `var(--ds-color-border-default)` |
| Month / secondary text | `var(--ds-color-control-ink-muted)` |
| Selected cell | `var(--ds-cal-cell-selected-bg)` → `button-color` JSON |
| Primary CTA | `resolveButtonAppearance` Primary |

## Verificación

- `npm run test` → 2/2 OK  
- `npm run build` → OK  
- Smoke: `/molecules/date-picker-menu` — preview + panel + código

## Pendiente / P2

- Cuadrícula: datos estáticos demo; conectar navegación de mes real en producto.  
- Variante Dual dates Desktop con columna preset ampliada si Figma exige más ancho que 328+140.  
- Enlazar apertura del menú desde átomo `DatePickerField` en flujo de producto.
