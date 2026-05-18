# Task 02 — Date picker menu

**Feature:** 05 Molecules  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre)  
**Fuente de diseño (obligatoria):** Figma — [Design system / Date picker menu](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=981-283052&t=fwMojw4EWqHhGBj4-4)  
**Node ID Figma:** `981:283052`

## Objetivo

Implementar la molécula **Date picker menu** (panel/menú de selección de fecha) en el catálogo **Molecules**, componiendo átomos y foundations ya existentes.

## Layout de catálogo (obligatorio — referencia Inputs)

La vista debe usar el **mismo layout que los átomos**, guiándose de **`inputs-view.tsx`** (`/atoms/inputs`) y el charter Feature 05 §1.2:

| Pieza | Implementación |
|-------|----------------|
| Estructura | Raíz `flex gap-8`; columna `flex-1 min-w-0` + `contentPaddingClass` (`useControlsPanel`) |
| Intro | `shell.intro` (`radio-button.module.css`) |
| Preview | `shell.previewCard` → toolbar “Preview” + `CodeXml` → `CodeModal` → `shell.previewStage` (menú + calendario) |
| Spec | `flex flex-col gap-4` con `shell.specCard` (tipografía, spacing, colores de estado según Figma) |
| Controles | `ControlsPanelFrame` + `design-system-controls` (`ControlSelect`, `SegmentedControl`, `Switch`) |

No usar el layout placeholder de `molecules-view.tsx` ni paneles con anchura distinta a `Spec/arquitectura-visual-ui.md` §3.

## Composición (dependencias)

| Capa | Piezas del repo |
|------|-----------------|
| Átomos | **Button**, **Input**, **Calendar cell** (Feature 04; ver `atom-catalog-routes.ts`) |
| Foundations | **Icons** (Material), variantes de **tipografía** y **color** (Feature 02 / 03) |
| Relacionado | Átomo **Date picker** (`977:294082`, `/atoms/date-picker`) — no reimplementar el input/calendario base; la molécula orquesta el menú/panel según el frame |

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente **debe consultar el frame** vía MCP `user-Figma Desktop`:

1. **`get_design_context`** con `nodeId: "981:283052"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"`.
2. **`get_screenshot`** con el mismo `nodeId` → referencia visual light/dark.
3. **`get_variable_defs`** con el mismo `nodeId` → variables Figma antes de mapear a `--ds-*`.

> Si el MCP no devuelve resultados o el `nodeId` cambió, **no inventar** medidas ni colores: detener, anotar en `Ejecuciones/` y avisar.

## Mapeo a tokens existentes (sin valores nuevos)

- Colores, bordes, superficies y texto: solo `var(--ds-*)` y/o resolución desde JSON Feature 02.
- Si el frame usa un valor sin token en `ds-tokens.css` / `theme.css`, **detener** y registrar el gap en `Ejecuciones/` (no introducir hex en JSX/CSS de la vista).

## Entregables

1. Vista de catálogo en ruta acordada en `task_01_plan_molecules_rutas_y_navegacion.md` (p. ej. `/molecules/date-picker-menu`).
2. Composición visible: botones, input, celdas de calendario e iconos según variantes del frame.
3. Acción **Ver código / variable / token** (`CodeModal` o patrón del catálogo).
4. Evidencia MCP en `Ejecuciones/ejecucion_feature_05_task_02_date_picker_menu_<fecha>.md`.

## Reglas

- **Una molécula = una task = un módulo de catálogo** (no mezclar con Snackbar, File upload item, etc.).
- Importar/reutilizar componentes de átomo existentes; no duplicar `calendar-cell`, `inputs` o `buttons` como copias locales.
- Light/dark coherente con `theme-provider`.

## DoD

- [x] Layout idéntico al patrón **Inputs** (preview + spec cards + `ControlsPanelFrame` + `CodeModal`).
- [x] Vista alineada al frame Figma `981:283052` validada contra `get_screenshot`.
- [x] Usa Button, Input y Calendar cell (o wrappers documentados) sin reimplementación redundante.
- [x] Sin literales de color nuevos en la vista (salvo excepción en `Ejecuciones/`).
- [x] Acción **Ver código / variable / token** funcional.
- [x] `npm run test` y `npm run build` en verde tras los cambios.
