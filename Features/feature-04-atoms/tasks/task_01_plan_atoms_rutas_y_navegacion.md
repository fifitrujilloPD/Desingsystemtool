# Task 01 — Plan átomos: rutas y navegación

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/metodologia-sdd`

## Objetivo

Cerrar el mapa **inventario §2 del charter** ↔ **código actual** (`routes.tsx`, `nav/categories.ts`, vistas `*-view.tsx`): definir rutas nuevas, orden del sidenav Atoms y decisiones de fusión (ej. Search como subsección de Inputs vs vista propia).

## Entregables

1. Tabla actualizada en el charter o en este archivo con **path + estado** por átomo.
2. Cambios mínimos en `NAV_CATEGORIES` y `routes.tsx` solo donde la task lo exija (placeholders opcionales).
3. Convención de nombres de ruta (`/atoms/...`) alineada a `Spec/arquitectura-visual-ui.md`.

## Reglas

- No duplicar vistas entre Atoms y Molecules (Dropdown: acordar si el átomo es solo “trigger + item” y la molécula compone el panel completo).
- **Fuente Figma:** cuando exista frame por átomo, preparar URL + `nodeId` para tasks posteriores (MCP obligatorio según `@Agents/metodologia-sdd`).

## DoD

- [ ] Inventario §2 del charter refleja el estado real del repo (✓ existente / pendiente / fusionado).
- [ ] Sin rutas rotas; build y tests en verde tras cambios de navegación.
