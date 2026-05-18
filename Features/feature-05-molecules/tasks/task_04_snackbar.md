# Task 04 — Snackbar

**Feature:** 05 Molecules  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre)  
**Fuente de diseño (obligatoria):** Figma — [Design system / Snackbar](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=78-43989&t=fwMojw4EWqHhGBj4-4)  
**Node ID Figma:** `78:43989`

## Objetivo

Implementar la molécula **Snackbar** (mensaje transitorio con iconografía semántica) en el catálogo **Molecules**.

## Layout de catálogo (obligatorio — referencia Inputs)

Replicar **`inputs-view.tsx`**: columna principal con intro, **preview** del snackbar (variantes por estado en el stage o vía controles), **spec cards** para tokens de tipografía/color/alert icons, y **`ControlsPanelFrame`** para estado semántico y texto. **`CodeModal`** obligatorio desde la preview toolbar.

Ver charter Feature 05 §1.2 y `Spec/arquitectura-visual-ui.md` §3.

## Composición (dependencias)

| Capa | Piezas del repo |
|------|-----------------|
| Foundations | **Alert icons** (Icons → Alert, Feature 03 `task_08_icons_alert.md`, node `556:147108`) |
| Tokens | Variantes de **tipografía** y **color** semánticos (`success`, `warning`, `error`, `info`) vía `var(--ds-*)` |
| Opcional | Botones de acción/cierre solo si el frame Figma los incluye — reutilizar átomo **Buttons** |

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente **debe consultar el frame** vía MCP `user-Figma Desktop`:

1. **`get_design_context`** con `nodeId: "78:43989"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"`.
2. **`get_screenshot`** con el mismo `nodeId` → referencia visual light/dark.
3. **`get_variable_defs`** con el mismo `nodeId` → variables Figma antes de mapear a `--ds-*`.

> Si el MCP no devuelve resultados o el `nodeId` cambió, **no inventar** medidas ni colores: detener, anotar en `Ejecuciones/` y avisar.

## Mapeo a tokens existentes (sin valores nuevos)

| Uso típico | Token / fuente |
|------------|----------------|
| Icono por estado | `var(--ds-color-success)`, `warning`, `error`, `info` (alineado a alert icons) |
| Texto / fondo / borde | Tokens semánticos en `ds-tokens.css` / `theme.css` |

Si el frame muestra un estado sin token, **detener** y registrar el gap.

## Entregables

1. Vista en ruta acordada (p. ej. `/molecules/snackbar`).
2. Variantes de estado del frame (info, success, error, warning si aplica) en matriz de preview.
3. Acción **Ver código / variable / token**.
4. Evidencia MCP en `Ejecuciones/ejecucion_feature_05_task_04_snackbar_<fecha>.md`.

## Reglas

- **Una molécula = una task**; no confundir con toasts de librerías externas (`sonner`, etc.) salvo que el charter documente un wrapper DS.
- Alert icons: mismo criterio de color semántico que Foundations → Alert.

## DoD

- [ ] Layout alineado al patrón **Inputs** (preview + spec cards + `ControlsPanelFrame`).
- [ ] Vista alineada al frame `78:43989` validada contra `get_screenshot`.
- [ ] Alert icons y tokens semánticos sin hex sueltos.
- [ ] Acción **Ver código / variable / token** funcional.
- [ ] `npm run test` y `npm run build` en verde.
