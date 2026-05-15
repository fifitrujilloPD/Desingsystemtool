# Ejecución — Feature 04 / Task 22 File upload

**Fecha:** 2026-05-15  
**Task:** `Features/feature-04-atoms/tasks/task_22_file_upload.md`  
**Figma node:** `978:299120` — **FileUploadBase**

## MCP Figma Desktop

1. **`get_design_context`**: componente con estados **Default | Hover | Disabled**; zona `bg-primary`, borde `border-primary` (1px) o **Hover** `border-2` `button-hover`; padding **16×24**, radio exterior **12px**; tile icono **40px** radio **8px** `bg-container` + borde; copy CTA **text-primary-brand** semibold 14/20, cola **text-secondary**, hint **text-tertiary** 12/16; icono upload.

2. **`get_screenshot`**: tres filas Default / Hover / Disabled.

3. **`get_variable_defs`**: espaciados, radios, colores semánticos y sombras skeumorphic en variables Figma.

## Implementación

- `file-upload-view.tsx` + `file-upload.module.css`: **`FileUploadZone`** + preview (hover real si estado Default), input `file` oculto, matriz 3 columnas, panel, **`CodeModal`**.
- Tokens solo vía **`token-parser`** (sin sombras composite Figma: no hay `--ds-*` equivalentes documentados en `theme.css`; UI usa borde/fondo/token de texto según spec del átomo).
- Rutas: **`file-upload`** → **review** en `atom-catalog-routes.ts` y `routes.tsx`.

## Verificación

- `npm run build` — OK  
- `npm run test` — OK  
