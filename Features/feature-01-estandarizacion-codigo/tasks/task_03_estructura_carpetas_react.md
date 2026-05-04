# Task 03 — Estructura de carpetas en `desarrollo-listo/`

**Feature:** 01 estandarización de código  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/arquitectura.md` §3 (capas y tabla de carpetas)

---

## Objetivo

Mantener el árbol bajo **`desarrollo-listo/src/`** alineado a **`Spec/arquitectura.md`**: `app/components/`, `app/components/ui/`, `app/lib/api/`, `app/data/`, `app/utils/`, `imports/`, `styles/`, etc.

---

## Entregables

1. Carpetas y responsabilidades coherentes con la spec (sin duplicar patrones).
2. Si se añade carpeta transversal nueva, actualizar **`Spec/arquitectura.md` §3** en el mismo ciclo (**`@Agents/metodologia-sdd`**).

---

## Criterios de hecho (DoD)

- [ ] Sin dependencias circulares entre capas (vista → `ui` → datos / `lib/api`).
- [ ] **No** cambios masivos de UI en esta task.
- [ ] **`npm run build`** desde la raíz del repo en verde.

---

## Orden

Después de **task_02**; antes o en paralelo conceptual con **task_04**.
