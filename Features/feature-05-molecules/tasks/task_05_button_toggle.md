# Task 05 — Button toggle

**Feature:** 05 Molecules  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre)  
**Fuente de diseño (obligatoria):** Figma — [Design system / Button toggle](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=719-257900&t=fwMojw4EWqHhGBj4-4)  
**Node ID Figma:** `719:257900`

## Objetivo

Implementar la molécula **Button toggle** (grupo de botones con selección única o múltiple según el frame) en el catálogo **Molecules**.

## Layout de catálogo (obligatorio — referencia Inputs)

Mismo shell que **`inputs-view.tsx`** / **`buttons-view.tsx`** (átomos): `flex gap-8`, `contentPaddingClass`, preview del grupo toggle, spec cards (tipografía, color selected/unselected), **`ControlsPanelFrame`** (cantidad de opciones, tamaño, disabled, etc.) y **`CodeModal`**. Shell visual vía `radio-button.module.css` — no inventar cards o panel distinto.

## Composición (dependencias)

| Capa | Piezas del repo |
|------|-----------------|
| Átomos | **Buttons** (Feature 04, node `2:7813`, `/atoms/buttons`) — variantes, tamaños y estados del átomo |
| Tokens | Variantes de **tipografía** y **color** (Feature 02 / 03) |

No confundir con el átomo **Switch** (`99:57111`): Button toggle es composición de botones, no control switch nativo, salvo que el frame indique lo contrario (documentar en `Ejecuciones/`).

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente **debe consultar el frame** vía MCP `user-Figma Desktop`:

1. **`get_design_context`** con `nodeId: "719:257900"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"`.
2. **`get_screenshot`** con el mismo `nodeId` → referencia visual light/dark.
3. **`get_variable_defs`** con el mismo `nodeId` → variables Figma antes de mapear a `--ds-*`.

> Si el MCP no devuelve resultados o el `nodeId` cambió, **no inventar** medidas ni colores: detener, anotar en `Ejecuciones/` y avisar.

## Mapeo a tokens existentes (sin valores nuevos)

- Estados selected/unselected/disabled: tokens de control y superficie ya usados en `buttons-view` / `--ds-color-control-*`.
- Sin hex nuevos; gaps → `Ejecuciones/`.

## Entregables

1. Vista en ruta acordada (p. ej. `/molecules/button-toggle`).
2. Variantes del frame (tamaño, densidad, cantidad de opciones) en preview + controles.
3. Acción **Ver código / variable / token**.
4. Evidencia MCP en `Ejecuciones/ejecucion_feature_05_task_05_button_toggle_<fecha>.md`.

## Reglas

- **Una molécula = una task**; componer `Button` (átomo), no reescribir estilos de botón en la molécula salvo tokens de contenedor/grupo documentados.
- Accesibilidad: patrón de grupo (`role="group"` / `radiogroup` o `toolbar`) según comportamiento del frame.

## DoD

- [ ] Layout alineado al patrón **Inputs** (preview + spec cards + `ControlsPanelFrame`).
- [ ] Vista alineada al frame `719:257900` validada contra `get_screenshot`.
- [ ] Usa el átomo Buttons (o API exportada) para cada segmento.
- [ ] Sin literales de color nuevos (salvo excepción en `Ejecuciones/`).
- [ ] Acción **Ver código / variable / token** funcional.
- [ ] `npm run test` y `npm run build` en verde.
