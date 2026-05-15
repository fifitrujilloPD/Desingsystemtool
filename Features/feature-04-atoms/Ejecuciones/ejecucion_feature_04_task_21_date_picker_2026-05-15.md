# Ejecución — Feature 04 / Task 21 Date picker

**Fecha:** 2026-05-15  
**Task:** `Features/feature-04-atoms/tasks/task_21_date_picker.md`  
**Figma node:** `977:294082` — componente **Datapicker**

## MCP Figma Desktop

1. **`get_design_context`** (`artifactType: DESIGN_SYSTEM`, `taskType: CREATE_ARTIFACT`, stack TS/React/Vite): props `type` Label text | Input text, `state` Default | Focused | Filed | Error | Disabled, `description`, `icon`, `requiredField`; campo con radio 8px, padding 12/14/14, gap interno 8px y 14px al borde; icono **calendar_today** 24px; Input text con label flotante 12px y asterisco requerido; tipografía valor 16/24.

2. **`get_screenshot`** (`nodeId: "977:294082"`): referencia matriz dos columnas (Label text / Input text) × estados.

3. **`get_variable_defs`**: border-primary, border-brand (button-color), text-primary/secondary/tertiary/disabled, bg-container, spacing 8, error border/text, etc.

## Implementación

- `date-picker-view.tsx` + `date-picker.module.css`: `DatePickerField` + preview con foco simulado (patrón drop-input); matriz 2× estados; strip Label text; **stub de mes** ilustrativo bajo el preview (tokens `button-color` / `text-primary-white` día seleccionado).
- Rutas: `date-picker` → **review**, vista registrada en `routes.tsx`.
- Colores solo vía `token-parser` / variables `--ds-date-*`.

## Verificación

- `npm run build` — OK  
- `npm run test` — OK  
