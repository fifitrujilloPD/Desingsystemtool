# Task 05 — Higiene de código React (`desarrollo-listo`) sin impacto UI

**Feature:** 01 estandarización de código  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md` (no regresión), `Spec/proyect.md` §5

---

## Objetivo

Reducir deuda **local y segura** en el design tool: imports sin uso, duplicación obvia, comentarios confusos, tipos laxos **sin** cambiar clases Tailwind, layout, textos de UI ni orden de componentes en pantalla.

---

## Entregables

1. PR(s) pequeños con diff acotado; lista de archivos tocados.
2. Si se renombra o mueve archivos solo internos, **grep** de imports actualizado.

---

## Criterios de hecho (DoD)

- [ ] `npm run build` OK.
- [ ] Revisión manual rápida: home + 2–3 rutas de átomos + una foundation (colores) — **aspecto idéntico** al esperado por **`Spec/arquitectura-visual-ui.md`**.
- [ ] Sin cambios en `theme.css` / tokens salvo bug de contraste acordado fuera de esta task.
- [ ] Opcional: captura antes/después en PR si el equipo lo pide.

---

## Orden

Puede ejecutarse **en paralelo** con task_03–04 si no hay conflictos de merge; evitar el mismo archivo que otra task.
