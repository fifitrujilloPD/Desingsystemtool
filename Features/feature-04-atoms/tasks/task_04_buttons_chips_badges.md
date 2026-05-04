# Task 04 — Buttons, Chips y Badges

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system`

## Objetivo

Alinear **Buttons** y **Badges** existentes; definir **Chips** (distinto de Badge si Figma lo separa: accionable / filtro vs etiqueta estática).

## Entregables

1. `buttons-view.tsx` y `badges-view.tsx` auditados contra tokens y estados del DS.
2. Vista **Chips** si no existe, o sección explícita en Badges con nomenclatura acordada con UX.
3. CTAs del panel sin nuevos hex (migrar a tokens los patrones `Code/SVG` heredados si aplica).

## Reglas

- Variantes (primary, secondary, outline, ghost) mapeadas a `--ds-color-*` / JSON.
- Documentar en `Ejecuciones/` si Chip comparte componente con Badge.

## DoD

- [ ] Sin literales nuevos en vistas de catálogo.
- [ ] Build/test OK.
