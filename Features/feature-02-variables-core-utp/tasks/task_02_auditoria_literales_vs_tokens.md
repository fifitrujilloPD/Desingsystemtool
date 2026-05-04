# Task 02 — Auditoría: literales vs tokens (deuda visual)

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md`

---

## Objetivo

Inventariar en `desarrollo-listo/src/` **dónde** hay colores, tipografía, spacing o borders **hardcodeados** (hex sueltos, `px` mágicos, `font-size` arbitrarios) frente a lo que ya existe como token en `imports/` o `theme.css`. Priorizar **vistas** (`*-view.tsx`) y **`components/ui/`**.

**No** corregir todo en esta task: solo **lista priorizada** (archivo + tipo de literal + sugerencia de token destino cuando exista).

---

## Entregables

1. Tabla o CSV: `ruta` | `tipo` (color/spacing/typo/border) | `evidencia` | `P0/P1/P2` | `token sugerido o TBD`.
2. Conteo aproximado por carpeta para planificar **task_06**.

---

## Criterios de hecho (DoD)

- [ ] Cubiertas al menos `app/components/` (vistas + layout + sidenav) y `styles/theme.css`.
- [ ] Criterio explícito: **no añadir** nuevos literales en PRs posteriores salvo excepción documentada.

---

## Orden

En paralelo con **task_01** cuando ya exista borrador de convención de tokens; antes de **task_06**.
