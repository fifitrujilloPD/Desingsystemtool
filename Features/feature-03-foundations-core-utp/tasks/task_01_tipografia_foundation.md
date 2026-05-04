# Task 01 — Tipografia foundation

**Feature:** 03 foundations Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`

## Objetivo

Implementar o ajustar el foundation de tipografia ya existente para que use solamente variables/tokens del baseline definido en Feature 02.

## Entregables

1. Preview editable (live text).
2. Tabla de especificaciones tipograficas con token asociado.
3. Accion "Ver codigo / variable / token".

## Reglas

- Si ya existe la vista, no duplicar: modificar variables y revisar colores.
- Prohibido agregar literales tipograficos nuevos.

## DoD

- [x] Solo tokens/variables aprobadas (vista + `ds-tokens.css` + `typography-foundation-scale.ts`).
- [x] Familia desde JSON `global.typography.fontFamily.Primary`; escala px en variables `--ds-typography-*` (2026-05-04).
