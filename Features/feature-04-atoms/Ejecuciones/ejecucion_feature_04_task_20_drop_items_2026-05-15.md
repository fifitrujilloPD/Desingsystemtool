# Ejecución — Feature 04 / Task 20 Drop items

**Fecha:** 2026-05-15  
**Task:** `Features/feature-04-atoms/tasks/task_20_drop_items.md`  
**Figma node:** `3:25753` (Building Blocks / Nav item — drop items)

## MCP Figma Desktop

1. **`get_design_context`** (`nodeId: "3:25753"`, `artifactType: DESIGN_SYSTEM`, `taskType: CREATE_ARTIFACT`, `clientLanguages: typescript,tsx,css`, `clientFrameworks: react,tailwind,vite`)  
   - Componente **BuildingBlocksNavItem**: variantes `Text` | `Icon` | `Person`, prop `selected`, `subtitle` opcional; ancho referencia 274px en código generado (catálogo usa **mín. 320px** alineado a drop input); padding 12×16, radio 6px, icono 24px, avatar 32px, tipografía 14/20.

2. **`get_screenshot`** (`nodeId: "3:25753"`)  
   - Captura usada para validar matriz 3×2: columnas Icon+label / Label only / Person+label; filas default vs seleccionado (fondo claro + texto marca).

3. **`get_variable_defs`** (`nodeId: "3:25753"`)  
   - Referencias: `text-secondary`, `text-primary-brand`, `button-color`, `bg-primary`, `bg-container`, tipografía body 14.

## Implementación

- Vista: `desarrollo-listo/src/app/components/drop-items-view.tsx`, estilos `drop-items.module.css`.  
- Tokens solo vía `resolveJsonTextColor` / `resolveJsonBackgroundColor` (sin hex nuevos en JSX/CSS).  
- Catálogo: rutas y `atom-catalog-routes` → `drop-items` en **review**.  
- `CodeModal`, `ControlsPanelFrame`, specs y matriz alineados al layout de otros átomos (drop-input / inputs).

## Verificación

- `npm run build` — OK  
- `npm run test` — OK  
