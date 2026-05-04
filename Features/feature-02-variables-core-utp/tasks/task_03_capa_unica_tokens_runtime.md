# Task 03 — Capa única: tokens en runtime (fuente de verdad técnica)

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md` (tokens, tema), `Spec/arquitectura.md` §3

---

## Objetivo

Definir e implementar **un solo mecanismo** por el cual la app lee tokens (ej. **CSS custom properties** generadas desde JSON, o **extend de theme** Tailwind v4 alimentado desde un build step, o combinación mínima documentada). Los componentes **solo** consumen ese mecanismo — **no** duplicar mapas de color en archivos sueltos.

---

## Entregables

1. Archivo(s) o script de generación: JSON diseño → **una** salida consumible (`theme.css`, `:root`, o tokens Tailwind).
2. Convención de naming **1:1** con semántica del JSON de diseño (o tabla de alias explícita si hace falta).
3. README corto en `insumos/` o en script: cómo regenerar tras cambio de JSON.

---

## Criterios de hecho (DoD)

- [ ] Un cambio en el JSON oficial + regenerar → cambio visible en al menos **un** componente de prueba sin tocar JSX de estilos literales.
- [ ] `npm run build` OK.
- [ ] Actualización **`Spec/`** (vía `@Agents/metodologia-sdd`) describiendo la capa única.

---

## Orden

Después de **task_01** (decisión de pipeline). Bloqueante para **task_04** y **task_05**.
