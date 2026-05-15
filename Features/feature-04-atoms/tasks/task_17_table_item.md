# Task 17 — Table item

**Feature:** 04 Atoms  
**Agente:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre)  
**Fuente de diseño (obligatoria):** Figma — [Design system / Table item](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=340-137006&t=IlFtdNLpuU9YgPZu-4)  
**Node ID Figma:** `340:137006`

## Objetivo

Implementar el átomo **Table item** (celda/fila atómica; la tabla completa sigue en Organisms).

## Fuente Figma + uso del MCP (obligatorio)

Antes de implementar o ajustar la vista, el agente **debe consultar el frame** vía MCP `user-Figma Desktop`:

1. **`get_design_context`** con `nodeId: "340:137006"`, `clientLanguages: "typescript,tsx,css"`, `clientFrameworks: "react,tailwind,vite"`, `artifactType: "DESIGN_SYSTEM"`, `taskType: "CREATE_ARTIFACT"`.
2. **`get_screenshot`** con el mismo `nodeId` → referencia visual light/dark.
3. **`get_variable_defs`** con el mismo `nodeId` → variables Figma antes de mapear a `--ds-*`.

> Si el MCP no devuelve resultados o el `nodeId` cambió, **no inventar** medidas ni colores: detener, anotar en `Ejecuciones/` y avisar.

## Mapeo a tokens existentes (sin valores nuevos)

- Colores, bordes, superficies y texto: solo `var(--ds-*)` y/o resolución desde JSON Feature 02 (`token-parser.ts`).
- Si el frame Figma usa un valor sin token en `ds-tokens.css` / `theme.css`, **detener** y registrar el gap en `Ejecuciones/` (no introducir hex en JSX/CSS de la vista).

## Entregables

1. Vista del átomo en el catálogo **Atoms** (ruta acordada en `task_01_plan_atoms_rutas_y_navegacion.md`).
2. Estados y variantes del frame Figma visibles en la UI (preview + panel de controles donde aplique).
3. Acción **Ver código / variable / token** (`CodeModal` o patrón equivalente del catálogo).
4. Evidencia MCP (`get_screenshot`) referenciada en `Ejecuciones/ejecucion_feature_04_task_17_table_item_<fecha>.md`.

## Reglas

- **Un átomo = una task = un módulo de catálogo** (no mezclar con otros átomos).
- Reutilizar componentes UI existentes en `desarrollo-listo/src/app/components/ui/` cuando aplique; no duplicar pantallas.
- Light/dark coherente con `theme-provider`.

## DoD

- [ ] Vista alineada al frame Figma `340:137006` validada contra `get_screenshot`.
- [ ] Sin literales de color nuevos en la vista (salvo excepción documentada en `Ejecuciones/`).
- [ ] Acción **Ver código / variable / token** funcional.
- [ ] `npm run test` y `npm run build` en verde tras los cambios.
