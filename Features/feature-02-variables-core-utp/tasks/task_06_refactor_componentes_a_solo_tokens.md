# Task 06 — Refactor: componentes y vistas consumen solo tokens

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md`, inventario **task_02**

---

## Objetivo

Sustituir de forma **incremental** (PRs pequeños) literales por referencias a la **capa única** (**task_03**): clases utilitarias derivadas de tokens, `var(--*)`, o utilidades Tailwind generadas — **nunca** nuevos `#rrggbb` o `16px` sueltos sin justificación en inventario.

**Orden sugerido de refactor:** layout shell → `components/ui/` primitivos más usados → vistas `*-view.tsx` por sección.

---

## Entregables

1. PR(s) por carpeta o por atomic level con checklist “sin literales nuevos”.
2. Actualización del inventario **task_02** (tachar ítems resueltos).

---

## Criterios de hecho (DoD)

- [ ] Cada PR enlaza tokens usados (nombre semántico o primitivo según convención).
- [ ] `npm run build` y smoke visual en rutas tocadas.
- [ ] Regresión documentada en **`Ejecuciones/`** si el cambio es grande.

---

## Orden

Después de **task_04**/**task_05**. Puede dividirse en sub-PRs paralelos por carpeta.
