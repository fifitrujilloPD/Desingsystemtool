# Task 04 — Capa API React (plantilla según spec)

**Feature:** 01 estandarización de código  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/api.md` (§2–3, plantilla §5), `Spec/arquitectura.md` (capa HTTP / `lib/api`)

---

## Objetivo

Implementar la **plantilla** de consumo HTTP en **React** bajo `desarrollo-listo/`: módulo dedicado en **`src/app/lib/api/`** (o ruta equivalente ya descrita en spec), **`fetch`** (o wrapper único), variables **`import.meta.env.VITE_*`** para base URL, manejo de errores alineado a **`Spec/api.md`**, y **un** método de ejemplo con test **Vitest** (y **MSW** si la spec lo exige) como referencia para el equipo.

---

## Entregables

1. Cliente o función de ejemplo (p. ej. `getHealth()` / `getConfig()`) sin backend obligatorio (mock, URL desactivada o MSW).
2. Test del módulo siguiendo **`Spec/api.md`** (checklist de tests).
3. Si existe endpoint real: completar fila en la **plantilla §5** de `Spec/api.md` (actualización vía `@Agents/metodologia-sdd` o mismo PR). Registrar el cierre en **`Ejecuciones/ejecucion_feature_01_*.md`** o en el informe de feature vigente.

---

## Criterios de hecho (DoD)

- [ ] Ninguna vista de catálogo con URLs sueltas como práctica estándar; consumo vía capa `lib/api` o patrón documentado.
- [ ] DTOs/interfaces para la respuesta de ejemplo.
- [ ] Errores tipados o manejados según **`Spec/api.md`** (sin filtrar datos sensibles al usuario).
- [ ] **UI del design tool:** sin cambios visuales salvo wiring mínimo invisible.

---

## Orden

Tras **task_03** (o en paralelo si la estructura de carpetas ya está lista). Antes de integrar muchos endpoints reales.
