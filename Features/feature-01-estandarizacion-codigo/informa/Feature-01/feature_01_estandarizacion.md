# Feature 01 — Estandarización de código (React, APIs y specs)

**Estado:** **Cerrada** — 2026-05-04  
**Informe de ejecución:** **`Ejecuciones/ejecucion_feature_01_react_estandar_2026-05-04.md`**.

---

## 1. Objetivo

Estandarizar **código y estructura** según **`Spec/`**, con **`@Agents/fullstack-design-system`**, con foco en:

- **Arquitectura React** en `desarrollo-listo/` — **`Spec/arquitectura.md`**.
- **Capa API** — **`Spec/api.md`** (`lib/api`, `VITE_*`, errores, Vitest).

---

## 2. Restricción no negociable: UI

- La **UI del design tool** no debe verse afectada: layouts y tokens en **`Spec/arquitectura-visual-ui.md`**.
- Refactors estructurales sin cambiar contrato visual salvo bugfix acordado.

---

## 3. Fuentes de verdad (Specs)

| Documento | Uso |
|-----------|-----|
| **`Spec/proyect.md`** | SDD, mapa repo (**§5**), **§6** sincronización. |
| **`Spec/arquitectura.md`** | Capas y carpetas React. |
| **`Spec/api.md`** | Cliente HTTP React. |
| **`Spec/arquitectura-visual-ui.md`** | Verificación visual. |

---

## 4. Agentes

- **`@Agents/fullstack-design-system`** — implementación y estructura.
- **`@Agents/metodologia-sdd`** — parche de `Spec/` tras cambios.
- **`@Agents/ux-ui-design-system`** — solo si hay duda visual.

---

## 5. Criterios de aceptación

- [x] Stack **React + Vite** documentado; mapa de repo y `src/` alineados a specs.
- [x] **`app/lib/api/`** con ejemplo `getHealthPing`, `requestJson`, `ApiError` y tests Vitest.
- [x] **`npm run build`** y **`npm run test`** desde la raíz.
- [x] Sin regresión de layout por esta entrega (API no cableada a vistas salvo acuerdo).
- [x] `Spec/` y **`Ejecuciones/`** alineados (informe único de cierre).

---

## 6. Fuera de alcance

- Rediseño visual o nuevos tokens.
- Mover el root de Vite fuera de `desarrollo-listo/` sin otra feature.

---

## 7. Notas

- Variables opcionales: **`.env.example`** (`VITE_API_BASE_URL`).
- **PR:** enlazar commit cuando exista remoto.
- **Revalidación 2026-05-04:** ver **`Ejecuciones/ejecucion_feature_01_revalidacion_tasks_2026-05-04.md`**.

---

## 8. Tasks

Carpeta: **`../../tasks/`**.

| Orden | Archivo | Resumen |
|-------|---------|---------|
| 1 | [`task_01_auditoria_specs_y_repo.md`](../../tasks/task_01_auditoria_specs_y_repo.md) | Auditoría Spec ↔ repo |
| 2 | [`task_02_plan_repo_react.md`](../../tasks/task_02_plan_repo_react.md) | Plan de repo React |
| 3 | [`task_03_estructura_carpetas_react.md`](../../tasks/task_03_estructura_carpetas_react.md) | Estructura `desarrollo-listo/src/` |
| 4 | [`task_04_capa_api_plantilla.md`](../../tasks/task_04_capa_api_plantilla.md) | Plantilla API React + tests |
| 5 | [`task_05_higiene_react_sin_impacto_ui.md`](../../tasks/task_05_higiene_react_sin_impacto_ui.md) | Higiene React |
| 6 | [`task_06_verificacion_build_ci_scripts.md`](../../tasks/task_06_verificacion_build_ci_scripts.md) | Build y scripts |
| 7 | [`task_07_regresion_visual_checklist.md`](../../tasks/task_07_regresion_visual_checklist.md) | Regresión visual |
| 8 | [`task_08_cierre_sdd_actualizacion_specs.md`](../../tasks/task_08_cierre_sdd_actualizacion_specs.md) | Cierre SDD |

---

## 9. Ejecución

| Documento |
|-----------|
| [`ejecucion_feature_01_react_estandar_2026-05-04.md`](../../Ejecuciones/ejecucion_feature_01_react_estandar_2026-05-04.md) |
| [`ejecucion_feature_01_revalidacion_tasks_2026-05-04.md`](../../Ejecuciones/ejecucion_feature_01_revalidacion_tasks_2026-05-04.md) — re-ejecución del flujo tasks 01–08 |

Enlaces de compatibilidad en **`tasks/`:** `task_02_plan_convivencia_react_angular.md` y `task_03_scaffold_estructura_angular.md` redirigen a **task_02** y **task_03** vigentes.

---

*Charter en `Features/feature-01-estandarizacion-codigo/informa/Feature-01/`.*
