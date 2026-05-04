# Task 09 — Verificación átomos vs tokens Feature 02

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/metodologia-sdd`

## Objetivo

Auditoría final: todos los módulos de átomos entregados consumen solo **tokens / JSON Feature 02**; listar excepciones aprobadas y gaps.

## Entregables

1. Checklist por vista `*-view.tsx` en `desarrollo-listo/src/app/components/` (Atoms).
2. Reporte `grep` / búsqueda de `#hex` y literales no permitidos.
3. Informe en `Ejecuciones/ejecucion_feature_04_task_09_verificacion_YYYY-MM-DD.md`.

## Reglas

- Misma política que Feature 03 task 11: excepciones solo con razón + plan de retiro.

## DoD

- [ ] Cero literales nuevos no documentados.
- [ ] `npm run test` y `npm run build` en verde.
- [ ] Actualización de `Spec/arquitectura-visual-ui.md` solo si cambió el contrato de rutas/navegación.
