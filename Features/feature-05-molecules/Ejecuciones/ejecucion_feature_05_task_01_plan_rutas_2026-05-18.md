# Ejecución — Feature 05 / Task 01 — Plan rutas y navegación (2026-05-18)

**Task:** `Features/feature-05-molecules/tasks/task_01_plan_molecules_rutas_y_navegacion.md`

## Objetivo cumplido

Mapa **una molécula → una ruta → un ítem de sidenav** para la ola 1 (tasks `02`–`05`), con fuente única en código, placeholders con **layout de Inputs** y rutas legacy conviviendo.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `desarrollo-listo/src/app/data/molecule-catalog-routes.ts` | **Nuevo.** 4 entradas ola 1 + `MOLECULE_LEGACY_NAV_ITEMS`. |
| `desarrollo-listo/src/app/components/molecule-placeholder-view.tsx` | **Nuevo.** Placeholder con `previewCard`, `specCard`, `ControlsPanelFrame` (patrón `inputs-view.tsx`). |
| `desarrollo-listo/src/app/nav/categories.ts` | Children de **Molecules** = catálogo ola 1 + legacy. `resolveNavModuleMeta` usa catálogo. |
| `desarrollo-listo/src/app/routes.tsx` | Rutas generadas desde catálogo; legacy explícitas (`forms`, `modals`, `dropdowns`); eliminado `molecules/:section`. |

## Tabla molécula → ruta → estado

| Task | Molécula | Ruta | Vista | Estado |
|------|----------|------|-------|--------|
| 02 | Date picker menu | `/molecules/date-picker-menu` | `date-picker-menu-view.tsx` | Placeholder (layout Inputs) |
| 03 | File upload item base | `/molecules/file-upload-item-base` | `file-upload-item-base-view.tsx` | Placeholder |
| 04 | Snackbar | `/molecules/snackbar` | `snackbar-view.tsx` | Placeholder |
| 05 | Button toggle | `/molecules/button-toggle` | `button-toggle-view.tsx` | Placeholder |

## Legacy (sin cambio de path)

| Ítem | Ruta | Vista |
|------|------|-------|
| Cards | `/molecules` | `molecules-view.tsx` |
| Forms | `/molecules/forms` | `placeholder-view.tsx` |
| Modals | `/molecules/modals` | `placeholder-view.tsx` |
| Dropdowns | `/molecules/dropdowns` | `placeholder-view.tsx` |

## Layout

Cada ruta del catálogo ola 1 monta `MoleculePlaceholderView` (no el layout centrado de `molecules-view.tsx`). Referencia: `inputs-view.tsx`, charter Feature 05 §1.2.

## Decisiones

- **Date picker menu** vs átomo `/atoms/date-picker`: rutas separadas; la molécula compone en task 02.
- **File upload item base** vs átomo `/atoms/file-upload`: ítem de lista vs zona de carga.
- **Dropdowns** legacy en `/molecules/dropdowns`; sin duplicar Drop input/items.

## Verificación

- `npm run test` → 2/2 OK
- `npm run build` → OK

## Pendiente

- Tasks `02`–`05`: sustituir `MoleculePlaceholderView` por vistas reales + Figma MCP.
