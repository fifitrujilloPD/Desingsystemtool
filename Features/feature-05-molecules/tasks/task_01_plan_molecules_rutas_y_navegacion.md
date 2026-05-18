# Task 01 — Plan moléculas: rutas y navegación

**Feature:** 05 Molecules  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/metodologia-sdd`

## Objetivo

Definir el mapa **una molécula → una ruta → una entrada en sidenav** para las tasks `task_02` … `task_05` de la ola 1. Actualizar `desarrollo-listo/src/app/nav/categories.ts`, `routes.tsx` y (si aplica) un archivo de datos tipo `molecule-catalog-routes.ts` siguiendo el patrón de `atom-catalog-routes.ts`.

## Rutas previstas (ola 1)

| Molécula | Path sugerido | Vista (componente) |
|----------|---------------|-------------------|
| Date picker menu | `/molecules/date-picker-menu` | `date-picker-menu-view.tsx` |
| File upload item base | `/molecules/file-upload-item-base` | `file-upload-item-base-view.tsx` |
| Snackbar | `/molecules/snackbar` | `snackbar-view.tsx` |
| Button toggle | `/molecules/button-toggle` | `button-toggle-view.tsx` |

El sidenav de **Molecules** lista **solo** las moléculas del catálogo Feature 05 (ola 1). Ítems legacy (Cards, Forms, Modals, Dropdowns) **no** aparecen en el sidenav; `/molecules` redirige al primer ítem del catálogo.

## Layout de catálogo (convención ola 1)

Todas las vistas `*-view.tsx` de moléculas deben seguir el **mismo layout que átomos**, con **referencia canónica** `inputs-view.tsx` (ver charter Feature 05 §1.2 y `Spec/arquitectura-visual-ui.md` §3):

- Raíz `flex gap-8`; columna principal con `contentPaddingClass` (`useControlsPanel`).
- Bloque **Preview** (`shell.previewCard` + `CodeModal`).
- Stack de **spec cards** (`shell.specCard`).
- **ControlsPanelFrame** a la derecha (no reutilizar el layout centrado de `molecules-view.tsx`).

Documentar en `Ejecuciones/` que cada ruta nueva monta una vista con este patrón (no un wrapper distinto).

## Reglas

- Cada molécula del charter §2 tiene su propia task; **no** agrupar varias moléculas en un solo `.md`.
- Coordinar **Date picker menu** con el átomo Date picker (`/atoms/date-picker`, node `977:294082`) y **File upload item base** con el átomo File upload (`/atoms/file-upload`, node `978:299120`): la molécula compone; el átomo no se duplica.
- Drop input / Drop items viven como átomos en Feature 04 (`/atoms/drop-input`, `/atoms/drop-items`); no hay entrada «Dropdowns» en sidenav Molecules.

## Entregables

1. Tabla en `Ejecuciones/` con **path + vista + estado** por molécula (pendiente / en curso / hecho).
2. Cambios mínimos en navegación y rutas para las cuatro moléculas.
3. Actualización de `insumos/README.md` si cambian node IDs o enlaces.

## DoD

- [x] Las 4 tasks de moléculas (02–05) tienen ruta prevista o existente documentada.
- [x] Sin rutas rotas; `npm run test` y `npm run build` en verde tras cambios de navegación.
- [x] `Spec/proyect.md` §3 refleja el estado de Molecules (ola 1 planificada o en curso).
- [x] Convención de layout (referencia Inputs) documentada en charter §1.2 y aplicable a tasks 02–05.
