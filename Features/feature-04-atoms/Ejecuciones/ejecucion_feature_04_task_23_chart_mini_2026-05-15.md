# Ejecución — Feature 04 / Task 23 Chart mini

**Fecha:** 2026-05-15  
**Task:** `Features/feature-04-atoms/tasks/task_23_chart_mini.md`  
**Figma node:** `982:291981` — **ChartMini**

## MCP Figma Desktop

1. **`get_design_context`**: variantes **`property1`** → Single | Type 1 | Organic | Line; **`type`** → bad | success; **`marck`**. Altura ~**56px**; anchos **112px** (**128px** en Single sin marcas). Líneas **2px**, relleno bajo curva degradado desde ink semántico; marcadores anillo exterior ~**20%** opacidad + centro `bg-container` + borde **2px**.
2. **`get_screenshot`**: referencia light/dark (validación visual contra preview + matriz del catálogo).
3. **`get_variable_defs`**: `text-success`, `text-error`, `bg-container`, etc., mapeadas vía **`token-parser`**.

## Implementación

- `chart-mini-view.tsx` + `chart-mini.module.css`: **`ChartMiniGraphic`** en SVG (`single` vb 128×56; resto 112×56), tonos **resolveJsonTextColor** success/error, marcadores opcionales (**Line** → dos puntos; **Single** sin marcadores), **`CodeModal`**, **`ControlsPanelFrame`**, fichas tipo inputs.
- Sin literales hex en JSX/CSS del render (solo resoluciones token en snippet de ejemplo / hex en fichas como resto del catálogo).
- **`chart-mini`** → **review** en `atom-catalog-routes.ts` y `routes.tsx`.

## Verificación

- `npm run build` — OK  
- `npm run test` — OK
