# Ejecución — Feature 05 / Task 03 — File upload item base (2026-05-18)

**Task:** `Features/feature-05-molecules/tasks/task_03_file_upload_item_base.md`  
**Node Figma:** `978:299288`  
**MCP:** `get_metadata` OK · `get_screenshot` OK · `get_design_context` falló (fetch)

## Objetivo cumplido

Molécula **File upload item base** en `/molecules/file-upload-item-base` con layout de catálogo (Inputs).

## Composición de átomos

| Átomo / foundation | Implementación |
|--------------------|----------------|
| Bar progress | `BarProgressPreview` (`style="none"`) exportado desde `bar-progress-view.tsx` |
| Circle progress | `CircleProgressRing` (`size="sm"`) exportado desde `circle-progress-view.tsx` |
| File icons | `FileIcon` — `file-icons-tab.tsx` + `file-icons-catalog.ts` |
| Checkbox | `CheckboxPreview` (opcional) exportado desde `checkbox-view.tsx` |
| Acciones | Material Symbols `delete` / `check` (no duplicar átomo Button para icon-only) |

## Variantes (panel + Figma)

| Eje | Valores |
|-----|---------|
| Progress type | Progress bar · Progress fill |
| Icon type | File type (PDF solid) · Simple (iconOutline + draft) |
| State | In progress · Complete · Error |
| Locale | ES · EN |

## Archivos

| Archivo | Rol |
|---------|-----|
| `file-upload-item-base.tsx` | Molécula `FileUploadItemBase` |
| `file-upload-item-base.module.css` | Layout 512px, estados, fill pane |
| `file-upload-item-base-view.tsx` | Catálogo + controles + CodeModal |
| `molecule-catalog-routes.ts` | status → `review` |
| `routes.tsx` | `FileUploadItemBaseView` |

## Mapa tokens

| Uso | Token / JSON |
|-----|----------------|
| Surface | `bg-container` |
| Border | `border-primary` |
| Error | `border-error`, `text-error` |
| Meta | `text-secondary` |
| Progress | `button-color`, `bg-brand-ships` |
| Link retry | `text-primary-brand` |

## Verificación

- `npm run test` → OK  
- `npm run build` → OK  
- Ruta: `/molecules/file-upload-item-base`

## Pendiente / P2

- Validar medidas finas con `get_design_context` cuando MCP responda.  
- Conectar ítem a lista real del flujo File upload (átomo `978:299120`).
