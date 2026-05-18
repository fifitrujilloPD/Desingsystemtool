# Task 03 — File upload item base

**Feature:** 05 Molecules  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre)  
**Fuente de diseño (obligatoria):** Figma — [Design system / File upload item base](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=978-299288&t=fwMojw4EWqHhGBj4-4)  
**Node ID Figma:** `978:299288`

## Objetivo

Implementar la molécula **File upload item base** (fila/ítem de archivo en progreso o completado) en el catálogo **Molecules**.

## Layout de catálogo (obligatorio — referencia Inputs)

Misma convención que **`inputs-view.tsx`** y Feature 05 §1.2: intro, **preview card** con el ítem base y estados, **spec cards** (tipografía, progreso, colores), panel **`ControlsPanelFrame`** para variantes (estado de carga, éxito, error, etc.) y **`CodeModal`** desde el botón de código en la toolbar del preview.

Referencias: `radio-button.module.css` (shell), `controls-panel-frame.tsx`, `controls-panel-context.tsx`.

## Composición (dependencias)

| Capa | Piezas del repo |
|------|-----------------|
| Átomos | **Bar progress**, **Circle progress**, **Checkbox**, **Buttons** (Feature 04) |
| Foundations | **File icons** (Icons → File, Feature 03 `task_07_icons_file.md`); variantes de **tipografía** y **color** |
| Relacionado | Átomo **File upload** (`978:299120`, `/atoms/file-upload`) — zona de carga vs ítem de lista; la molécula es el ítem base, no la drop zone completa |

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente **debe consultar el frame** vía MCP `user-Figma Desktop`:

1. **`get_design_context`** con `nodeId: "978:299288"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"`.
2. **`get_screenshot`** con el mismo `nodeId` → referencia visual light/dark.
3. **`get_variable_defs`** con el mismo `nodeId` → variables Figma antes de mapear a `--ds-*`.

> Si el MCP no devuelve resultados o el `nodeId` cambió, **no inventar** medidas ni colores: detener, anotar en `Ejecuciones/` y avisar.

## Mapeo a tokens existentes (sin valores nuevos)

- Colores, bordes, superficies y texto: solo `var(--ds-*)` y/o resolución desde JSON Feature 02.
- Progreso (bar/circle): tokens ya usados en `bar-progress-view` / `circle-progress-view`.
- Si el frame usa un valor sin token, **detener** y registrar el gap en `Ejecuciones/`.

## Entregables

1. Vista en ruta acordada (p. ej. `/molecules/file-upload-item-base`).
2. Estados del frame (cargando, éxito, error, selección, etc.) visibles en preview + panel de controles donde aplique.
3. Acción **Ver código / variable / token**.
4. Evidencia MCP en `Ejecuciones/ejecucion_feature_05_task_03_file_upload_item_base_<fecha>.md`.

## Reglas

- **Una molécula = una task**; no mezclar con File upload (átomo) en la misma vista de catálogo.
- Reutilizar átomos de progreso, checkbox y botones; file icons desde el catálogo de foundations.

## DoD

- [ ] Layout alineado al patrón **Inputs** (preview + spec cards + panel derecho estándar).
- [ ] Vista alineada al frame `978:299288` validada contra `get_screenshot`.
- [ ] Bar progress, circle progress, file icons, checkbox y buttons integrados (no duplicados).
- [ ] Sin literales de color nuevos (salvo excepción en `Ejecuciones/`).
- [ ] Acción **Ver código / variable / token** funcional.
- [ ] `npm run test` y `npm run build` en verde.
