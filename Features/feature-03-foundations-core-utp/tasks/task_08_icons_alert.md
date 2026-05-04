# Task 08 — Icons Alert

**Feature:** 03 foundations Core-UTP  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre de spec)  
**Fuente de diseño (obligatoria):** Figma — frame [Design system / Icons Alert](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=556-147108&t=evAkrsjd6q4litn7-4)  
**Node ID Figma:** `556:147108`

## Objetivo

Implementar el set de **icons de alert** del catálogo (Foundations → Icons → Alert) tomando como **única referencia visual** el frame Figma indicado arriba, conectado a los **colores semánticos** ya definidos en el design system (`success`, `warning`, `error`, `info`).

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente de implementación **debe consultar el frame** vía el MCP de Figma del workspace (servidor **`user-Figma Desktop`**):

1. **`get_design_context`** con `nodeId: "556:147108"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"` (o `CHANGE_ARTIFACT` si ya existía la vista) → estructura, medidas, jerarquía de cada icon de alert.
2. **`get_screenshot`** con el mismo `nodeId` → captura de referencia para revisión visual contra implementación.
3. **`get_variable_defs`** sobre el mismo nodo → confirma qué **variables semánticas** (`success`, `warning`, `error`, `info` y sus pares de borde / fondo si aplican) usa el frame, antes de mapearlas a los tokens del repo.

> Si el MCP no devuelve resultados o el frame cambió de `nodeId`, **no inventar** medidas ni tonos: detener, anotar el gap en `Ejecuciones/` y avisar antes de seguir.

## Mapeo a tokens existentes (sin valores nuevos)

Los iconos deben consumir **solo** variables ya disponibles en el design system:

| Estado | Color del icono / borde | Token semántico CSS |
|--------|-------------------------|---------------------|
| Success | success | `var(--ds-color-success)` |
| Warning | warning | `var(--ds-color-warning)` |
| Error | error | `var(--ds-color-error)` (texto sobre fondo de error: `var(--ds-color-on-error)`) |
| Info | info | `var(--ds-color-info)` |

Si el frame muestra un fondo o borde adicional, mapearlo a la **variante existente** en `theme.css` / `ds-tokens.css` o, si no hay token aún, **detener** y registrar el gap (no introducir hex sueltos en JSX/CSS).

## Entregables

1. Set de **alert icons por estado** en la sección Icons del catálogo, fiel al frame Figma referenciado.
2. **Mapeo de color semántico** por estado documentado en la propia vista (etiqueta visible junto al icono o tooltip) y trazable a la tabla anterior.
3. Acción **“Ver código / variable / token”** consistente con la convención usada en otras vistas (modal o snippet inline; reutilizar `CodeModal` si aplica).
4. Captura del frame (vía `get_screenshot`) **referenciada** en la ejecución de la feature (`Ejecuciones/`) para validar smoke visual light/dark.

## Reglas

- Si ya existe módulo o subvista de iconos de alerta, **reutilizar** y solo ajustar variables, **sin duplicar pantallas** (regla compartida con `task_05_borders_foundation.md`).
- Mantener consistencia visual con **Foundation Colors** (Colors → Foundation → Text/Border/Background); no abrir un segundo set de colores de estado.
- **MCP Figma como única fuente de medidas/jerarquía** del frame `556:147108`; cualquier desviación debe quedar anotada en `Ejecuciones/`.
- Sin hex literales en TSX/CSS para color del icono o de superficie.

## DoD

- [x] Cada estado (`info`, `success`, `error`) renderiza con el **token semántico** correspondiente; sin hardcode de color (warning queda fuera del frame Figma `556:147108` y no se inventa).
- [x] Vista alineada al frame Figma `556:147108` (matriz 3 estados × 2 contenedores) validada contra `get_screenshot`; light/dark heredan del `theme-provider` vía hex resuelto JSON.
- [x] Acción **Ver código / variable / token** funcional con `CodeModal` y snippet HTML + CSS que cita `var(--ds-color-*)` y el token JSON Figma correspondiente.
- [x] Spec sin cambios estructurales (Icons sigue en `/icons` con tabs internos: Material / Flags / Alert); cualquier ajuste posterior debe pasar por `Spec/arquitectura-visual-ui.md` §6 / §11.
- [x] Informe de ejecución en `Features/feature-03-foundations-core-utp/Ejecuciones/ejecucion_feature_03_task_08_alert_icons_2026-05-04.md` con `nodeId`, fecha y mapa de variables Figma → tokens del DS.
