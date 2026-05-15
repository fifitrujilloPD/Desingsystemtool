# Ejecución — Feature 04 / Task 01 — Plan rutas y navegación (2026-05-14)

**Task:** `Features/feature-04-atoms/tasks/task_01_plan_atoms_rutas_y_navegacion.md`

## Objetivo cumplido

Mapa **un átomo → una ruta → un ítem de sidenav** para las tasks `02`–`23`, con fuente única en código y placeholders para átomos pendientes.

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `desarrollo-listo/src/app/data/atom-catalog-routes.ts` | **Nuevo.** 22 entradas con `path`, `label`, `status` (`review` \| `placeholder`), `viewComponent`, `taskFile`. |
| `desarrollo-listo/src/app/nav/categories.ts` | Children de **Atoms** generados desde `ATOM_CATALOG_ROUTES`. `resolveNavModuleMeta` usa el catálogo para títulos. |
| `desarrollo-listo/src/app/routes.tsx` | Rutas de átomos generadas desde el catálogo; eliminados `atoms/icons` y `atoms/:section`. |
| `desarrollo-listo/src/app/components/placeholder-view.tsx` | Muestra label + `taskFile` del catálogo y tokens `--ds-color-text-*`. |

## Tabla átomo → ruta → estado

| Task | Átomo | Ruta | Vista | Estado |
|------|--------|------|-------|--------|
| 02 | Radio Buttons | `/atoms/radio-buttons` | `radio-button-view.tsx` | Revisión |
| 03 | Checkbox | `/atoms/checkboxes` | `checkbox-view.tsx` | Revisión |
| 04 | Inputs | `/atoms/inputs` | `inputs-view.tsx` | Revisión |
| 05 | Badges | `/atoms/badges` | `badges-view.tsx` | Revisión |
| 06 | Buttons | `/atoms` | `buttons-view.tsx` | Revisión |
| 07 | Dividers | `/atoms/dividers` | placeholder | Implementar |
| 08 | Tabs | `/atoms/tabs` | `tabs-view.tsx` | Revisión |
| 09 | Bar progress | `/atoms/bar-progress` | placeholder | Implementar |
| 10 | Circle progress | `/atoms/circle-progress` | placeholder | Implementar |
| 11 | Steppers | `/atoms/steppers` | placeholder | Implementar |
| 12 | Switch | `/atoms/switch` | `switch-view.tsx` | Revisión |
| 13 | Slider | `/atoms/slider` | placeholder | Implementar |
| 14 | Search | `/atoms/search` | placeholder | Implementar |
| 15 | Side tabs | `/atoms/side-tabs` | placeholder | Implementar |
| 16 | Breadcrumbs | `/atoms/breadcrumbs` | placeholder | Implementar |
| 17 | Table item | `/atoms/table-item` | placeholder | Implementar |
| 18 | Calendar cell | `/atoms/calendar-cell` | placeholder | Implementar |
| 19 | Drop input | `/atoms/drop-input` | placeholder | Implementar |
| 20 | Drop items | `/atoms/drop-items` | placeholder | Implementar |
| 21 | Date picker | `/atoms/date-picker` | placeholder | Implementar |
| 22 | File upload | `/atoms/file-upload` | placeholder | Implementar |
| 23 | Chart mini | `/atoms/chart-mini` | placeholder | Implementar |

## Decisiones

- **Icons en Atoms:** se quitó `/atoms/icons` del sidenav; iconografía vive en **Foundations → Icons** (`/icons`).
- **Drop input / Drop items:** átomos en `/atoms/drop-input` y `/atoms/drop-items`. La molécula compuesta sigue en `/molecules/dropdowns` (sin duplicar implementación).
- **Buttons** conserva ruta corta `/atoms` (índice del grupo Atoms).

## Verificación

- `npm run test` → 2/2 OK
- `npm run build` → OK

## Pendiente

- Ejecutar tasks `02`–`23` sustituyendo placeholders por vistas reales según Figma MCP.
