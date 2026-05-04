# Task 01 — Plan: tokens Core-UTP + sidenav Atomic Design

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system` (validación Figma)  
**Specs:** `Spec/arquitectura-visual-ui.md`, `Spec/arquitectura.md`, `Spec/proyect.md` §6

---

## Principio rector (no negociable)

**No crear ni acumular CSS “basura”** (valores sueltos, duplicados, overrides ad hoc). Los componentes y vistas deben **consumir solo la capa de tokens** acordada (variables CSS generadas desde JSON, utilidades derivadas, o mapping único en `theme.css` / Tailwind theme). Si cambia un token en diseño/JSON, el cambio debe **propagar** al UI sin reescribir cada componente a mano.

---

## Objetivo

Fijar **antes de codificar en masa**: ingesta de JSON (Colors, Spacing, Borders, Typography), **un solo pipeline** hacia `desarrollo-listo/src/imports/` (o generación equivalente), y **árbol de rutas + labels** del sidenav **Foundations → Atoms → Molecules → Organisms**, alineado a Figma.

---

## Entregables

1. JSON versionados en repo (`insumos/` o ruta acordada).
2. Tabla **ruta** | **label UI** | **nivel Atomic** | **notas Figma**.
3. Decisión escrita: **cómo** referencian los componentes los tokens (convención de clases / `var(--*)` / theme Tailwind).

---

## Criterios de hecho (DoD)

- [ ] Insumos **dentro del repo**, no solo rutas locales del dev.
- [ ] Link Figma navegación en charter **§7**.
- [ ] Documento corto “**regla: sin literales nuevos**” aprobado o en PR (puede vivir en `Ejecuciones/` + enlace en spec).

---

## Orden

Primera task. Bloqueante para **task_02** en paralelo de auditoría y para **task_03** en adelante.
