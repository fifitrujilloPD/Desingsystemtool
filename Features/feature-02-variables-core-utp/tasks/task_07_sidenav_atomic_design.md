# Task 07 — Sidenav: Foundations → Atoms → Molecules → Organisms

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md` (shell, sidebar), plan **task_01**

---

## Objetivo

Reorganizar **datos y rutas** del sidebar (`sidebar.tsx`, `routes.tsx`, posible `nav-config` centralizado) para reflejar el orden **Foundations → Atoms → Molecules → Organisms**, con **labels e ids** iguales a diseño/Figma. Estilos del nav deben usar **solo tokens** (no nuevos hex/spacing sueltos).

---

## Entregables

1. Estructura de datos de navegación (array/const) **única** consumida por sidebar y, si aplica, breadcrumbs.
2. Rutas React alineadas; sin rutas huérfanas.
3. Captura o nota en PR alineada a frame Figma (cuando exista link en charter §7).

---

## Criterios de hecho (DoD)

- [ ] Orden de secciones exactamente el acordado con diseño.
- [ ] Nuevo ítem de menú = **solo** datos (ruta + label + grupo), no duplicar estilos.
- [ ] `npm run build` OK.

---

## Orden

Tras **task_01** (tabla rutas). Puede solaparse con **task_06** si se tocan mismos archivos: coordinar en un solo PR o orden estricto sidebar primero.
