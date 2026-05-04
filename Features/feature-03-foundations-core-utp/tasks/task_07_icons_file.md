# Task 07 — Icons File

**Feature:** 03 foundations Core-UTP  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre de spec)  
**Fuente de diseño (obligatoria):** Figma — frame [Design system / Icons File](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=974-291724&t=evAkrsjd6q4litn7-4)  
**Node ID Figma:** `974:291724`

## Objetivo

Implementar el set de **icons de archivo** del catálogo (Foundations → Icons → File) tomando como **única referencia visual** el frame Figma indicado arriba, alineado con los **tokens existentes** del design system y reutilizando el patrón de tabs y panel ya usado por `task_08_icons_alert.md` (mismo módulo *Icons*, **nuevo tab “File icons”**).

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente de implementación **debe consultar el frame** vía el MCP de Figma del workspace (servidor **`user-Figma Desktop`**):

1. **`get_design_context`** con `nodeId: "974:291724"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"` (o `CHANGE_ARTIFACT` si la subvista ya existía) → estructura, medidas, jerarquía y nombres de cada variante de file icon.
2. **`get_screenshot`** con el mismo `nodeId` → captura de referencia para revisión visual contra implementación.
3. **`get_variable_defs`** sobre el mismo nodo → confirma qué **variables** (Layout / Neutral / Brand) usa el frame antes de mapearlas a tokens del repo.

> Si el MCP no devuelve resultados, el frame cambió de `nodeId` o el color de una extensión **no está tokenizado** ni en Figma ni en `ds-tokens.css`, **no inventar** hex: detener, anotar el gap en `Ejecuciones/` y proponer la decisión al usuario antes de seguir.

## Alcance del frame `974:291724`

El frame agrupa **tres variantes** del set:

1. **Solid** — bandera con fondo de color completo y la extensión en blanco encima (ej. `PDF`, `DOC`, `DOCX`, `TXT`, `CSV`, `XLS`, `XLSX`, `PPT`, `PPTX`, `FIG`, `AI`, `PSD`, `INDD`, `AEP`, `MP3`, `WAV`, `MP4`, `MPEG`, `AVI`, `MKV`, `ZIP`, `RAR`, `IMG`, `JPG`, `PNG`, `SVG`).
2. **Outline tag** — papel blanco con la pestaña inferior coloreada por extensión (mismas extensiones que la fila Solid).
3. **Generic / monocromo** — íconos de propósito general en gris neutro (`code`, `folder`, `image`, `video`, `file`, `audio`, `pdf`, `sheet`, etc.).

> Mantener la **paridad de extensiones** con el frame; si Figma agrega o quita una, ajustar la lista en código y registrar la diferencia en `Ejecuciones/`.

## Mapeo a tokens existentes (sin valores nuevos)

- **Lienzo / fondo del documento (papel)** → `var(--ds-color-surface-elevated)` (= `--card`).
- **Separadores y borde por defecto del icon** → `var(--ds-color-border-default)`.
- **Texto sobre bandera Solid** → `var(--ds-color-on-error)` u otra variable de “texto sobre superficie” cuando exista; si no hay token aún, **detener** y registrar el gap.
- **Color por extensión (Solid + tag)** → si el frame usa hex “horneados” (no semánticos), tratar el SVG como **asset de marca** y servirlo desde `desarrollo-listo/public/file-icons/` o `src/imports/`, **sin** inyectar hex en TSX/CSS.
- Variables Figma confirmadas vía `get_variable_defs` para este nodo: `Layout/Background = #ffffff`, `Layout/Divider = #dbdbdb`, `Neutral/300 = #d4d4d8` (estructura del set; **no** son los colores por extensión).

## Entregables

1. **Nuevo tab “File icons”** dentro del módulo *Icons* (`IconsView`), junto a *Material Icons*, *Flag icons* y *Alert Icons* — sin abrir vista paralela.
2. Set completo de iconos del frame (Solid + Outline tag + Generic) con preview por extensión y meta (label, variante, source asset).
3. **Panel derecho** con las mismas reglas que `task_08_icons_alert.md`:
   - Solo control de **Size** (tamaño de preview).
   - Bloque **Selected file icon** al seleccionar una celda, con preview, etiqueta, extensión, variante y acción **“Ver código / variable / token”**.
4. Captura del frame (`get_screenshot`) y mapa de variables (`get_variable_defs`) referenciados en `Ejecuciones/ejecucion_feature_03_task_07_file_icons_<fecha>.md`.

## Reglas

- Si ya existe módulo o subvista de iconos de archivo, **reutilizar** y solo ajustar variables; **no duplicar pantallas** (regla compartida con `task_05`, `task_06`, `task_08`, `task_09`).
- Mantener consistencia visual con **Foundation Colors** y con el patrón de tabs ya implementado en `IconsView` (no abrir un panel propio ni un side-rail nuevo).
- **MCP Figma como única fuente de medidas/jerarquía/extensiones** del frame `974:291724`; cualquier desviación o gap (token faltante, color sin variable) debe quedar anotado en `Ejecuciones/` y comunicado al usuario.
- **Sin hex literales** en TSX/CSS para color de superficie, borde o texto. Los colores por extensión que no estén tokenizados deben venir como **asset SVG** servido desde `public/` o `src/imports/`, no escritos a mano.

## DoD

- [x] Tab **File icons** integrado en `IconsView` con la misma estructura de tabs que Material / Flags / Alert.
- [x] Las 26 extensiones del frame `974:291724` se renderizan en **Solid** y **Outline + Color**, y los 9 archivos genéricos en **Icon + Outline**; sin extensiones inventadas.
- [x] Papel y bordes consumen tokens DS (`var(--ds-color-surface-elevated)`, `var(--ds-color-border-default)`, `var(--ds-color-text-secondary)`); los hex brand por extensión viven aislados en `desarrollo-listo/src/app/data/file-icons-catalog.ts` como **asset brand del DS** (no token semántico) y sin `#` literales en JSX/CSS de la vista.
- [x] Panel derecho muestra solo **Size** + bloque **Selected file icon** + acciones **Code** y **SVG** (`buildFileIconSvg` genera el archivo); replica el patrón de `task_08` (Alert) y de Flag icons.
- [x] Vista basada en el frame Figma `974:291724` validada contra `get_screenshot`; geometría aproximada (papel 32×32 con corner-fold y tag por variante). Las diferencias pixel-perfect quedan registradas en `Ejecuciones/` como gap “export SVGs MCP a `public/file-icons/`”.
- [x] `Spec/arquitectura-visual-ui.md` (§6 / §11) sin cambios estructurales (Icons sigue en `/icons` con tabs internos: Material / Flags / Alert / **Files**); cualquier ajuste posterior pasa por SDD.
- [x] Informe en `Features/feature-03-foundations-core-utp/Ejecuciones/ejecucion_feature_03_task_07_file_icons_2026-05-04.md` con `nodeId`, fecha, `get_variable_defs`, mapa Figma → tokens DS y gap de fidelidad pixel-perfect.
