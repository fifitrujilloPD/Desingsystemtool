# Task 05 — Light / dark y alias semánticos (primary, success, …)

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md`

---

## Objetivo

Si diseño define **modos** y **tokens semánticos** (`primary`, `error`, `surface`, …), mapearlos a la capa única (**task_03**) **una sola vez**. Evitar dos definiciones distintas del mismo concepto (ej. dos grises “casi iguales”).

---

## Entregables

1. Tabla **token semántico** | **token primitivo** (o escala) | **modo** (light/dark).
2. Toggle de tema existente debe seguir usando **solo** variables/tokens (sin literales nuevos).

---

## Criterios de hecho (DoD)

- [ ] Cambiar un token primitivo en JSON regenerado actualiza **ambos** modos donde corresponda.
- [ ] Documentación en `Spec/` o en charter **§7** de excepciones (si las hay).

---

## Orden

Tras **task_04**. Puede fusionarse con task_04 si el JSON ya trae modos en un solo paquete.
