# Feature 04 — Atoms (componentes base)

**Producto / contexto:** Design System en `desarrollo-listo/`.  
**Estado:** Abierta — planificación (tasks por átomo + Figma MCP).  
**Agente principal sugerido:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system` + `@Agents/metodologia-sdd`.

**Dependencias:** Feature 02 (tokens JSON + `--ds-*`), Feature 03 (Foundations).

---

## 1. Objetivo (épica)

Implementar y/o **revisar** cada **átomo** del catálogo como **módulo independiente**: una task, una vista (o subruta), un frame Figma y un informe de ejecución. Sin agrupar varios átomos en un mismo archivo de task.

---

## 1.1 Principio operativo (no negociable)

- **Un átomo = un archivo en `tasks/`** con URL + `Node ID` Figma y bloque MCP obligatorio (`@Agents/metodologia-sdd.md`).
- Colores y espaciado: solo `var(--ds-*)` y JSON Feature 02; sin hex nuevos en vistas (salvo excepción en `Ejecuciones/`).
- Átomos **ya implementados** (Buttons, Inputs, Badges, Radio, Checkbox, Tabs, Switch): modo **revisión** — validar Figma, alinear tokens y estructura; no rehacer desde cero salvo deuda crítica.

---

## 2. Inventario de átomos y tasks

| # | Átomo | Task | Node ID Figma | Modo |
|---|--------|------|---------------|------|
| 01 | Plan rutas/navegación | `task_01_plan_atoms_rutas_y_navegacion.md` | — | Plan |
| 02 | Radio buttons | `task_02_radio_buttons.md` | `7:16556` | Revisión |
| 03 | Checkbox | `task_03_checkbox.md` | `6:6708` | Revisión |
| 04 | Inputs | `task_04_inputs.md` | `2:8432` | Revisión |
| 05 | Badges | `task_05_badges.md` | `3:8722` | Revisión |
| 06 | Buttons | `task_06_buttons.md` | `2:7813` | Revisión |
| 07 | Dividers | `task_07_motion_dividers.md` | `3031:40774` | Implementar |
| 08 | Tabs | `task_08_tabs.md` | `2:8279` | Revisión |
| 09 | Bar progress | `task_09_bar_progress.md` | `977:298525` | Implementar |
| 10 | Circle progress | `task_10_circle_progress.md` | `978:298965` | Implementar |
| 11 | Steppers | `task_11_steppers.md` | `167:66289` | Implementar |
| 12 | Switch | `task_12_switch.md` | `99:57111` | Revisión |
| 13 | Slider | `task_13_slider.md` | `981:288514` | Implementar |
| 14 | Search | `task_14_search.md` | `241:123115` | Implementar |
| 15 | Side tabs | `task_15_side_tabs.md` | `131:69223` | Implementar |
| 16 | Breadcrumbs | `task_16_breadcrumbs.md` | `981:286037` | Implementar |
| 17 | Table item | `task_17_table_item.md` | `340:137006` | Implementar |
| 18 | Calendar cell | `task_18_calendar_cell.md` | `981:282277` | Implementar |
| 19 | Drop input | `task_19_drop_input.md` | `2:8532` | Implementar |
| 20 | Drop items | `task_20_drop_items.md` | `3:25753` | Implementar |
| 21 | Date picker | `task_21_date_picker.md` | `977:294082` | Implementar |
| 22 | File upload | `task_22_file_upload.md` | `978:299120` | Implementar |
| 23 | Chart mini | `task_23_chart_mini.md` | `982:291981` | Implementar |
| 24 | Verificación tokens | `task_24_verificacion_atoms_tokens_feature_02.md` | — | Auditoría |

Enlaces Figma (misma fuente): [Design system — Copy](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-).

---

## 3. Criterios de aceptación (épica)

- [ ] 22 átomos con task propia (02–23) y Figma MCP documentado.
- [ ] Átomos en modo revisión alineados a frame + tokens sin reimplementación innecesaria.
- [ ] Acción **Ver código / variable / token** en cada módulo.
- [ ] Task 24 (verificación) cerrada con informe en `Ejecuciones/`.
- [ ] `Spec/` actualizado solo si cambian rutas o contrato de navegación.

---

## 4. Insumos

`Features/feature-04-atoms/insumos/README.md` — índice de enlaces por átomo.

---

## 5. Ejecuciones

`Features/feature-04-atoms/Ejecuciones/` — un informe por task ejecutada: `ejecucion_feature_04_task_XX_<slug>_<fecha>.md`.

---

*Charter: `Features/feature-04-atoms/informa/Feature-04/feature_04_atoms.md`.*
