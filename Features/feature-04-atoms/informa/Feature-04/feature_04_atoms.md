# Feature 04 — Atoms (componentes base)

**Producto / contexto:** Design System en `desarrollo-listo/`.  
**Estado:** Abierta — planificación.  
**Agente principal sugerido:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system` + `@Agents/metodologia-sdd`.

**Dependencias:** Feature 02 (tokens JSON + `--ds-*`), Feature 03 (Foundations consumibles).

---

## 1. Objetivo (épica)

Implementar, estandarizar y documentar en el catálogo **todos los átomos** listados abajo: mismo patrón que Foundations (vista dedicada, panel de controles donde aplique, acción **Ver código / variable / token**, consumo exclusivo de tokens Feature 02).

---

## 1.1 Principio operativo (no negociable)

- Colores, tipografía, spacing, radios y bordes: **solo** `var(--ds-*)` y datos resueltos desde JSON Feature 02 (`Ligth_mode.tokens-3.json` / `darkmode.tokens-3.json`).
- Sin literales nuevos en JSX/CSS (`#hex`, `px` arbitrarios), salvo **excepción documentada** en `Ejecuciones/` con plan de retiro (misma política que Foundations).
- Cada átomo con frame Figma debe declarar **URL + Node ID** y uso obligatorio del MCP `user-Figma Desktop` (`get_design_context`, `get_screenshot`, `get_variable_defs`) — ver `@Agents/metodologia-sdd.md` § Convención de fuente Figma + MCP.

---

## 2. Inventario de átomos (alcance)

| # | Átomo | Notas / naming |
|---|--------|----------------|
| 1 | Radio buttons | Selección única en grupo |
| 2 | Checkbox | Estados checked / indeterminate / disabled |
| 3 | Inputs | Campos de texto, máscaras, estados |
| 4 | Chips | Etiquetas accionables / filtro |
| 5 | Buttons | Ya existe vista base en `/atoms`; alinear a tokens + Figma |
| 6 | Dividers | Separadores horizontales/verticales |
| 7 | Tabs | Navegación por pestañas (tabs horizontales) |
| 8 | Progress | Barra y círculo (determinate / indeterminate) |
| 9 | Steppers | Pasos de flujo (horizontal/vertical) |
| 10 | Switch | Toggle on/off |
| 11 | Slider | Rango de valor continuo |
| 12 | Search | Campo de búsqueda con icono / clear |
| 13 | Side tabs | Pestañas laterales (navegación vertical en rail) |
| 14 | Breadcrumbs | Ruta jerárquica |
| 15 | Ítem de tabla | Celda/fila atómica reutilizable |
| 16 | Date picker | Selector de fecha (popover/calendario embebido) |
| 17 | Dropdown | Contenedor del dropdown (trigger + panel) |
| 18 | Dropdown items | Ítems del menú desplegable |
| 19 | Calendar cell | Celda individual del calendario |

---

## 3. Estado actual vs backlog (catálogo React)

Referencias: `desarrollo-listo/src/app/nav/categories.ts`, `routes.tsx`.

| Átomo | Ruta sugerida / existente | Estado (referencia) |
|-------|---------------------------|---------------------|
| Buttons | `/atoms` | Vista existente — revisión tokens/Figma |
| Inputs | `/atoms/inputs` | Vista existente |
| Badges | `/atoms/badges` | Vista existente (chips pueden alinearse o diferenciarse) |
| Radio | `/atoms/radio-buttons` | Vista existente |
| Checkbox | `/atoms/checkboxes` | Vista existente |
| Tabs | `/atoms/tabs` | Vista existente |
| Switch | `/atoms/switch` | Vista existente |
| Dividers | — | **Pendiente** ruta + vista |
| Progress (bar/circle) | — | **Pendiente** |
| Steppers | — | **Pendiente** |
| Slider | — | **Pendiente** |
| Search | — | **Pendiente** (o submódulo de Inputs) |
| Side tabs | — | **Pendiente** |
| Breadcrumbs | — | **Pendiente** |
| Table item | — | **Pendiente** (átomo; tabla completa sigue en Organisms) |
| Date picker | — | **Pendiente** |
| Dropdown / items | — | **Pendiente** (coordinar con Molecules `/molecules/dropdowns`) |
| Calendar cell | — | **Pendiente** |

La task `task_01` consolida rutas, sidenav y evitar duplicados con Molecules.

---

## 4. Criterios de aceptación (épica)

- [ ] Cada átomo del inventario §2 tiene vista en catálogo o decisión explícita de fusión (ej. Search bajo Inputs).
- [ ] Sin literales de color nuevos; solo tokens Feature 02 / `--ds-*`.
- [ ] Acción **Ver código / variable / token** en cada módulo de átomo (reutilizar `CodeModal` / patrón Foundations).
- [ ] Light/dark coherentes con `theme-provider`.
- [ ] `Spec/arquitectura-visual-ui.md` §6 (patrones de catálogo) y §11 actualizados cuando cambien rutas o tabs.
- [ ] Informes en `Ejecuciones/` por ola de trabajo.

---

## 5. Insumos de diseño

Carpeta: `Features/feature-04-atoms/insumos/`.

- Enlaces Figma por átomo (frames o component sets).
- Exportaciones SVG / JSON cuando el MCP no sea suficiente para assets estáticos.

---

## 6. Tasks

Carpeta: `../../tasks/`.

| Orden | Archivo | Resumen |
|------:|---------|---------|
| 01 | `task_01_plan_atoms_rutas_y_navegacion.md` | Inventario vs código, rutas, sidenav, convenciones MCP |
| 02 | `task_02_radio_checkbox_switch.md` | Radio, Checkbox, Switch |
| 03 | `task_03_inputs_search_slider.md` | Inputs, Search, Slider |
| 04 | `task_04_buttons_chips_badges.md` | Buttons, Chips; alineación con Badges existente |
| 05 | `task_05_dividers_tabs_side_tabs.md` | Dividers, Tabs, Side tabs |
| 06 | `task_06_progress_steppers.md` | Progress bar/circle, Steppers |
| 07 | `task_07_breadcrumbs_table_item.md` | Breadcrumbs, ítem de tabla |
| 08 | `task_08_date_picker_dropdown_calendar.md` | Date picker, Dropdown, ítems, Calendar cell |
| 09 | `task_09_verificacion_atoms_tokens_feature_02.md` | Auditoría final literales vs tokens |

---

## 7. Ejecuciones

Carpeta: `../../Ejecuciones/`. Ver `README.md`.

---

*Charter: `Features/feature-04-atoms/informa/Feature-04/feature_04_atoms.md`.*
