# Task 07 — Regresión visual del design tool

**Feature:** 01 estandarización de código  
**Agente:** `@Agents/ux-ui-design-system` (revisión) + `@Agents/fullstack-design-system` (fixes solo si aplica)  
**Specs:** `Spec/arquitectura-visual-ui.md` (§2–6, §9 checklist)

---

## Objetivo

Dar por **cerrada** la verificación de que la UI del catálogo no cambió de forma perceptible tras todos los PRs de la feature.

---

## Checklist mínimo (marcar en PR final)

- [ ] Shell: navbar `h-16`, sidebar `w-64`, `main` con márgenes/padding según spec.
- [ ] Panel de controles: `ControlsPanelFrame`, anchos `w-80` / `w-12`, padding `pr-80` / `pr-12`.
- [ ] Modo claro y oscuro: toggle y legibilidad.
- [ ] Una vista de **átomos** (p. ej. botones) y una **foundation** (colores): jerarquía tipográfica y separadores coherentes.

---

## Criterios de hecho (DoD)

- [ ] Checklist anterior completado sin hallazgos **bloqueantes**; mejoras menores abiertas como issues si no son de esta feature.
- [ ] Aprobación explícita en PR o comentario de diseño/reviewer.

---

## Orden

Última línea antes del **cierre SDD** (task_08) o junto con task_06.
