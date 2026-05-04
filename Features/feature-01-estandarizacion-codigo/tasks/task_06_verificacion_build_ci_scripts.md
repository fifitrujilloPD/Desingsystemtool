# Task 06 — Verificación de build, scripts y rutas

**Feature:** 01 estandarización de código  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/proyect.md` §5.3

---

## Objetivo

Asegurar que **`npm run dev`**, **`npm run build`** y **`npm run flags:ingest`** (si aplica) funcionan tras los cambios de la feature; documentar cualquier prerequisito (p. ej. `public/flags-temp`).

---

## Entregables

1. Log o checklist en PR: comandos ejecutados y resultado.
2. Si se rompió un path por mover carpetas, fix en `package.json` / `vite.config.ts` / script documentado en **§5.3**.

---

## Criterios de hecho (DoD)

- [ ] `npm run build` desde raíz del repo: éxito.
- [ ] `flags:ingest` documentado como “opcional” si faltan assets de entrada; si se ejecuta: éxito o error esperado documentado.
- [ ] Scripts relevantes (`build`, `test`, `dev`, `flags:ingest` si aplica) documentados o coherentes con **`Spec/proyect.md` §5.3**.

---

## Orden

Cerca del cierre de la feature, o tras cada merge grande de task_03–05.
