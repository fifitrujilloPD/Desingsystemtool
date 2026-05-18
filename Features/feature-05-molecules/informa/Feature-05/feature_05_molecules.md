# Feature 05 — Molecules (componentes compuestos)

**Producto / contexto:** Design System en `desarrollo-listo/`.  
**Estado:** Abierta — planificación (primera ola: 4 moléculas + Figma MCP).  
**Agente principal sugerido:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system` + `@Agents/metodologia-sdd`.

**Dependencias:** Feature 02 (tokens `--ds-*`), Feature 03 (Foundations: colores, tipografía, iconos Material / Alert / File), Feature 04 (átomos reutilizables listados por molécula en §2).

---

## 1. Objetivo (épica)

Implementar la **primera ola de moléculas** del catálogo como **módulos independientes**: una task, una vista (o subruta), un frame Figma y un informe de ejecución por molécula. Cada molécula **compone átomos y foundations existentes**; no reimplementar átomos salvo ajustes de API documentados en `Ejecuciones/`.

---

## 1.1 Principio operativo (no negociable)

- **Una molécula = un archivo en `tasks/`** con URL + `Node ID` Figma y bloque MCP obligatorio (`@Agents/metodologia-sdd.md`).
- Colores y espaciado: solo `var(--ds-*)` y JSON Feature 02; sin hex nuevos en vistas (salvo excepción en `Ejecuciones/`).
- La vista de catálogo vive bajo **`/molecules/...`** (ver `task_01_plan_molecules_rutas_y_navegacion.md`); el placeholder genérico en `molecules-view.tsx` se sustituye por rutas reales al ejecutar las tasks.

---

## 1.2 Layout de catálogo (obligatorio — referencia Inputs)

Las vistas de **Molecules** usan el **mismo layout de catálogo que Atoms**. La **referencia canónica** es:

- **Vista:** `desarrollo-listo/src/app/components/inputs-view.tsx` (ruta `/atoms/inputs`)
- **Spec:** `Spec/arquitectura-visual-ui.md` §3 (panel de controles), §5 (tipografía), §9 (checklist)
- **Shell compartido:** clases de `radio-button.module.css` (`intro`, `previewCard`, `previewToolbar`, `previewStage`, `specCard`, `specHeading`, `panelTitle`, `configBox`, …)
- **Panel derecho:** `ControlsPanelFrame` + `useControlsPanel()` → `contentPaddingClass` (`pr-80` / `pr-12`)

| Zona | Patrón (como Inputs) |
|------|----------------------|
| Raíz | `flex gap-8` + `*.module.css` local para la molécula |
| Columna izquierda | `flex-1 min-w-0` + `contentPaddingClass` |
| Intro | `shell.intro` |
| Preview | `shell.previewCard` → toolbar “Preview” + botón código (`CodeXml` → `CodeModal`) → `shell.previewStage` |
| Especificación | `flex flex-col gap-4` de `shell.specCard` (Typography, spacing, colores por estado, etc.) |
| Controles | `ControlsPanelFrame` con `ControlSelect` / `SegmentedControl` / `Switch` y **Current Config** si aplica |

**Prohibido** para moléculas de esta épica: layout del placeholder `molecules-view.tsx`, panel derecho con anchura distinta a `w-80`/`w-12`, o página sin preview + spec cards + controles.

---

## 2. Inventario de moléculas (ola 1) y tasks

| # | Molécula | Task | Node ID Figma | Átomos / foundations que consume |
|---|----------|------|---------------|----------------------------------|
| 01 | Plan rutas/navegación | `task_01_plan_molecules_rutas_y_navegacion.md` | — | — |
| 02 | Date picker menu | `task_02_date_picker_menu.md` | `981:283052` | Button, Input, Calendar cell; iconos; tipografía y color (Foundations) |
| 03 | File upload item base | `task_03_file_upload_item_base.md` | `978:299288` | Bar progress, Circle progress, File icons, Checkbox, Buttons; tipografía y color |
| 04 | Snackbar | `task_04_snackbar.md` | `78:43989` | Alert icons; tipografía y color |
| 05 | Button toggle | `task_05_button_toggle.md` | `719:257900` | Buttons; tipografía y color |

**Relación con átomos cercanos (no duplicar):**

| Átomo (Feature 04) | Node ID | Molécula relacionada |
|--------------------|---------|----------------------|
| Date picker | `977:294082` | Date picker **menu** compone input/calendario del átomo dentro del panel/menú |
| File upload | `978:299120` | File upload **item base** es la fila/ítem dentro del flujo de carga |

Enlaces Figma (misma fuente): [Design system — Copy](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-).

---

## 3. Criterios de aceptación (épica)

- [x] Task 01: rutas `/molecules/...` y sidenav alineados (sin rutas rotas).
- [ ] Las 4 moléculas (02–05) con task propia y Figma MCP documentado.
- [ ] Cada molécula reutiliza átomos/foundations del inventario §2 (sin copiar implementación de átomo en la vista de molécula).
- [ ] Acción **Ver código / variable / token** en cada módulo.
- [ ] Cada vista de molécula (02–05) replica el **layout de Inputs** (preview card, spec cards, `ControlsPanelFrame`, `CodeModal`).
- [ ] `Spec/proyect.md` §3 y, si cambia navegación, `Spec/arquitectura-visual-ui.md` §11 sincronizados al cierre.

---

## 4. Insumos

`Features/feature-05-molecules/insumos/README.md` — índice de enlaces por molécula.

---

## 5. Ejecuciones

`Features/feature-05-molecules/Ejecuciones/` — un informe por task ejecutada: `ejecucion_feature_05_task_XX_<slug>_<fecha>.md`.

---

*Charter: `Features/feature-05-molecules/informa/Feature-05/feature_05_molecules.md`.*
