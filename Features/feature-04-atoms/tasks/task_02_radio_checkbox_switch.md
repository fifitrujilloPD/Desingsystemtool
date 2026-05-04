# Task 02 — Radio, Checkbox y Switch

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system`

## Objetivo

Alinear **Radio Buttons**, **Checkbox** y **Switch** a tokens Feature 02 (`--ds-*`), JSON de foundations y — si aplica — frame Figma del componente.

## Entregables

1. Vistas `radio-button-view.tsx`, `checkbox-view.tsx`, `switch-view.tsx` consumiendo solo tokens semánticos en estilos de catálogo.
2. Estados documentados en UI (default, hover, focus, disabled, error donde aplique).
3. Acción **Ver código / variable / token** coherente con Foundations.

## Reglas

- Resolver colores vía `token-parser` / JSON cuando el átomo duplica patrones de Foundations (texto, borde, superficie).
- Sin `#hex` nuevos en JSX/CSS de las vistas.

## DoD

- [ ] Sin literales de color prohibidos en las tres vistas (salvo excepción documentada).
- [ ] Build/test OK.
