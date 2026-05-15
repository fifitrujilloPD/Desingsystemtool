# Task 01 — Plan átomos: rutas y navegación

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/metodologia-sdd`

## Objetivo

Definir el mapa **un átomo → una ruta → una entrada en sidenav** para las tasks `task_02` … `task_23`, sin agrupar módulos. Actualizar `desarrollo-listo/src/app/nav/categories.ts` y `routes.tsx` solo donde haga falta (placeholders para átomos aún no implementados).

## Reglas

- Cada átomo del charter §2 tiene su propia task; **no** crear tasks multi-átomo.
- Rutas bajo `/atoms/...` salvo decisión explícita documentada en este informe.
- Coordinar Drop input / Drop items con Molecules (`/molecules/dropdowns`) sin duplicar responsabilidades.

## Entregables

1. Tabla en el charter o en `Ejecuciones/` con **path + vista + estado** por átomo (existente / pendiente / revisión).
2. PR o cambios mínimos en navegación para átomos nuevos (Dividers, Progress, Search, etc.).
3. Lista de vistas en modo **revisión** vs **implementar** (ya reflejada en charter §2).

## DoD

- [x] Las 22 tasks de átomos (02–23) tienen ruta prevista o existente documentada (`atom-catalog-routes.ts` + informe `Ejecuciones/ejecucion_feature_04_task_01_plan_rutas_2026-05-14.md`).
- [x] Sin rutas rotas; `npm run test` y `npm run build` en verde tras cambios de navegación.
