# Ejecución — Feature 03 / Task 07 — Icons File (2026-05-04)

**Charter:** `Features/feature-03-foundations-core-utp/informa/Feature-03/feature_03_foundations.md`  
**Task:** `Features/feature-03-foundations-core-utp/tasks/task_07_icons_file.md`  
**Agentes:** `@Agents/fullstack-design-system` (implementación) + `@Agents/metodologia-sdd` (cierre).

## Fuente Figma + MCP

- **URL:** [Design system / Icons File](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=974-291724&t=evAkrsjd6q4litn7-4)
- **Node ID:** `974:291724`
- **MCP Figma (`user-Figma Desktop`)** consultado:
  - `get_design_context` → estructura del frame y tabla de combinaciones (`color × fileType`).
  - `get_screenshot` → render de referencia para validación visual (matriz `3 × 6` por variante).
  - `get_variable_defs` → `Layout/Background = #ffffff`, `Layout/Divider = #dbdbdb`, `Neutral/300 = #d4d4d8` (estructura del set; los colores por extensión **no** están tokenizados como variables Figma).

### Variantes del set (3)

| Variante (Figma) | ID interno | Cobertura |
|------------------|------------|-----------|
| `Solid` | `solid` | 26 extensiones (PDF…SVG) |
| `Outline + Color` | `outlineColor` | 26 extensiones (PDF…SVG) |
| `Icon + Outline` | `iconOutline` | 9 archivos genéricos (Folder, Image, Code, Video, Video 2, Audio, PDF, Documents, Excel) |

### Mapa brand → asset (extraído de `bg-[#…]` del JSX MCP)

| Hex brand | Extensiones |
|-----------|-------------|
| `#d92d20` | PDF |
| `#155eef` | DOC, DOCX, PSD, MP4, MPEG, AVI, MKV |
| `#343a3e` | TXT |
| `#079455` | CSV, XLS, XLSX |
| `#e62e05` | PPT, PPTX |
| `#7f56d9` | FIG, IMG, JPG, PNG, SVG |
| `#e04f16` | AI |
| `#ba24d5` | INDD |
| `#6938ef` | AEP |
| `#dd2590` | MP3, WAV |
| `#414651` | ZIP, RAR |

> Estos hex se almacenan en `desarrollo-listo/src/app/data/file-icons-catalog.ts` (`EXTENSION_BRAND_HEX`) y se documentan como **asset brand del set de file icons**, **no** como tokens semánticos del DS. Si más adelante el sistema define `--ds-color-file-{ext}` o similares, sustituir las constantes y eliminar los hex.

## Implementación

- **Catálogo:** `desarrollo-listo/src/app/data/file-icons-catalog.ts`
  - Variantes (`FileIconVariant`), extensiones (`ExtensionFileType`), genéricos (`GenericFileType`), `EXTENSION_BRAND_HEX`, `GENERIC_FILE_ICON` (Material Symbols Rounded), tamaños permitidos (`FILE_ICON_SIZES = [16, 20, 24, 32, 40]`).
  - `getFileIconEntries()` produce 26 + 26 + 9 = **61** entradas.
- **Componente:** `desarrollo-listo/src/app/components/file-icons-tab.tsx`
  - `FileIcon` dibuja un papel 32×32 con corner-fold (`PAPER_PATH` + `FOLD_PATH`) en SVG inline.
    - `Solid`: papel relleno con `brandHex` + sombra blanca de fold + texto blanco con la extensión.
    - `Outline + Color`: papel blanco con `var(--ds-color-surface-elevated)` + stroke `var(--ds-color-border-default)` + tag inferior con `brandHex` + texto blanco.
    - `Icon + Outline`: papel del DS + glifo Material Symbols Rounded encima usando `var(--ds-color-text-secondary)`.
  - `FileIconsTab` agrupa las entradas en tres `<section>` (Solid / Outline + Color / Icon + Outline) y respeta selección externa.
  - `buildFileIconSvg` genera un SVG **autocontenido** descargable (sin `var()`) con el hex brand horneado, listo para usarse fuera de la app.
  - `buildFileIconSnippet` produce HTML + CSS para el `CodeModal` (cita `EXTENSION_BRAND_HEX["…"]` y las variables `var(--ds-color-…)` del papel/borde).
- **Integración:** `desarrollo-listo/src/app/components/icons-view.tsx`
  - Nuevo tab “File icons” junto a *Material / Flags / Alert*.
  - Search/Category ocultos en este tab (no aplican).
  - Panel derecho:
    - `SegmentedControl Size` con `[16, 20, 24, 32, 40]` (default `32`).
    - Bloque **Selected file icon** (cuando hay selección): preview, nombre, variante, brand swatch + referencia simbólica `EXTENSION_BRAND_HEX["…"]`, tokens DS de `Paper` y `Border`, glyph cuando aplica.
    - Botones **Code** (abre `CodeModal`) y **SVG** (descarga vía `buildFileIconSvg`, igual al patrón de Flag icons / Material).
- **Paneles previos** (Material / Flags / Alert) intactos.

## Tokens y reglas

- Papel y bordes: `var(--ds-color-surface-elevated)`, `var(--ds-color-border-default)`, `var(--ds-color-text-secondary)` (todas existentes en `ds-tokens.css`).
- Hex brand confinados al catálogo TS; no aparecen en JSX/CSS de la vista, ni en utilidades fuera del catálogo.
- No se inventaron tokens nuevos. No se modificaron shell, navbar, sidebar, panel de controles ni los tabs Material/Flags/Alert.

## Decisiones / gaps registrados

- **Geometría del papel** (`PAPER_PATH` / `FOLD_PATH`) y posición del tag se derivaron de los inset relativos del JSX MCP (`inset-[0_10%]`, `inset-[0_10%_70%_60%]`, tag en `top-[15.2px]`). No es un export pixel-perfect: el frame Figma compone los assets con SVGs del servidor `localhost:3845` que solo viven durante la sesión.
- **Pendiente futuro (gap):** exportar a `desarrollo-listo/public/file-icons/<variant>/<file>.svg` los SVGs persistentes (uno por combinación) usando un script `scripts/merge-file-icons.mjs` o manualmente desde Figma; el componente `FileIcon` quedaría con un fallback `<img>` que apunte al asset persistente y caería al SVG inline si falta. Eso eleva la fidelidad sin tocar la API del componente.
- **Glifo en SVG descargado** (Icon + Outline): el archivo descargado usa `<text font-family="Material Symbols Rounded">` con el glifo. El SVG renderiza correctamente en navegadores con la fuente cargada; en entornos sin la fuente, se ve el codepoint. Documentado dentro del propio SVG con un comentario.

## DoD (estado)

- [x] Tab **File icons** integrado en `IconsView` con la misma estructura de tabs que Material / Flags / Alert.
- [x] Las 26 extensiones del frame `974:291724` se renderizan en `Solid` y `Outline + Color`; los 9 genéricos en `Icon + Outline`. Sin extensiones inventadas.
- [x] Papel y bordes vienen del DS (`var(--ds-color-surface-elevated)`, `var(--ds-color-border-default)`, `var(--ds-color-text-secondary)`). Los hex brand viven en `EXTENSION_BRAND_HEX` (`file-icons-catalog.ts`) como asset brand y NO en JSX/CSS de la vista.
- [x] Panel derecho con **Size** + **Selected file icon** + **Code** + **SVG** funcionando, replicando el patrón de Flag icons / Alert.
- [x] Vista validada contra `get_screenshot`; gap pixel-perfect anotado arriba.
- [x] Spec sin cambios estructurales (Icons sigue en `/icons` con cuatro tabs).
- [x] Este informe.

## Verificación técnica

- `ReadLints` → sin errores.
- `npm run test` → 2/2 OK (capa `lib/api`).
- `npm run build` → OK (Vite 6.3.5).
