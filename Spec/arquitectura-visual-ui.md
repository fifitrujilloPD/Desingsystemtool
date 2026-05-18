# Spec — Arquitectura visual UI

Estándar de **layout, superficies, tipografía, color e iconografía** de la plataforma de design system **tal como está implementada hoy**. Todo trabajo nuevo de UI en este repositorio debe **encajar** en este marco salvo decisión explícita documentada (PR + actualización de esta spec).

Complementa **`Spec/proyect.md`** (Atomic Design, SDD). Si el cambio altera el aspecto del shell, del panel de controles o de los patrones de página de catálogo, **actualizá este documento** en el mismo ciclo (cláusula de sincronización).

---

## 1. Rol de Figma y MCP

- **Figma** es la referencia de diseño de componentes y foundations; los tokens exportados viven bajo **`desarrollo-listo/src/imports/`** (JSON de modo claro/oscuro, etc.).
- El **MCP de Figma** se usa para **extraer contexto** (variables, estructura de componentes, medidas) al crear o actualizar piezas que **ya existen o están definidas** en el archivo de diseño; no sustituye esta spec: la implementación debe **seguir los patrones de código y layout** descritos abajo.
- Flujo recomendado (SDD): **spec / criterios** → consulta Figma (MCP) → implementación alineada a tokens y a esta arquitectura visual → revisión visual frente a Figma.

---

## 2. Shell de aplicación (layout global)

| Zona | Comportamiento visual | Referencia de implementación |
|------|------------------------|------------------------------|
| **Fondo de página** | Superficie neutra clara u oscura con transición suave de tema. | `bg-[var(--ds-color-surface-app)]` — valores primitivos en **`theme.css`** (`--layout-page-bg` light/dark). |
| **Navbar** | Fija arriba, altura **64px** (`h-16`), ancho completo, borde inferior sutil, z-index alto para permanecer sobre el contenido. | `bg-[var(--ds-color-surface-chrome)]`, borde `border-[var(--ds-color-border-default)]` (Feature 02). |
| **Header de módulo** | Muestra **módulo Atomic** (Foundations, Atoms, …) y **título de página** alineados al ítem activo del sidenav. | `CatalogModuleChrome` + `resolveNavModuleMeta()` desde **`desarrollo-listo/src/app/nav/categories.ts`**. |
| **Título de producto** | `text-lg font-semibold`, texto primario claro/oscuro. | Navbar: `text-gray-900 dark:text-white`. |
| **Sidebar** | Fija a la izquierda, ancho **256px** (`w-64`); el contenido principal compensa con **margen izquierdo** (`ml-64`). | Misma superficie/cromo que navbar: `bg-[var(--ds-color-surface-chrome)]`, borde tokenizado. Datos de menú: **`nav/categories.ts`** (`NAV_CATEGORIES`). |
| **Área principal** | Debajo de la navbar, con padding generoso y scroll propio del documento. | `main`: `flex-1 ml-64 mt-16 p-8 pt-4` (ajustar solo si la spec de layout cambia de forma acordada). |

**Regla:** no introducir segunda barra superior fija ni sidebars flotantes adicionales sin actualizar esta spec (evita competencia visual con la navbar `z-50`).

### 2.1 Tokens semánticos `--ds-*` (variables y anti‑literals)

- **Primitivos de layout** (`--layout-page-bg`, `--layout-chrome-bg`) viven en **`desarrollo-listo/src/styles/theme.css`** (`:root` / `.dark`) — única fuente de los hex de shell acordados con diseño.
- **Capa semántica** `--ds-*` en **`desarrollo-listo/src/styles/ds-tokens.css`** (solo `var(...)`, sin nuevos hex en ese archivo).
- **Ingesta futura** desde JSON en **`Features/feature-02-variables-core-utp/insumos/`**: comando **`npm run tokens:ds`** → `desarrollo-listo/src/styles/generated/ds-tokens-generated.css` (ver **`Spec/proyect.md` §5.3`**).
- **Tipografía foundations (Feature 03):** escala H1–body en **`desarrollo-listo/src/styles/ds-tokens.css`** bajo `--ds-typography-*` (tamaños y alturas de línea en px, alineados al catálogo existente); metadatos y nombres de token en **`desarrollo-listo/src/app/data/typography-foundation-scale.ts`**. La vista **`typography-view.tsx`** consume `var(--ds-typography-*)` y puede sobreescribir **`--ds-typography-font-family`** en el scope de la página con el valor de **`global.typography.fontFamily.Primary`** del JSON exportado (`Ligth_mode.tokens-3.json` / `darkmode.tokens-3.json` en runtime).
- **Regla de implementación:** nuevos fondos/bordes del shell y del header de módulo deben usar **tokens** (`var(--ds-*)` o utilidades `bg-card`, etc.); no añadir `#rrggbb` sueltos en JSX salvo excepción documentada en la feature 02.

### 2.2 Paquetes de tokens (ZIP) — lineage desde Feature 02

Los paquetes **referenciados en diseño** (ZIP exportados desde Figma / equipo de diseño) fueron acordados en la épica **Feature 02** como fuentes formales de dominios de token:

| Paquete (referencia charter Feature 02) | Dominio | Rol |
|------------------------------------------|---------|-----|
| **Colors.zip** | Color | Paletas primarias/secundarias, neutros, estado y uso semántico en JSON de modo claro/oscuro. |
| **Typography.zip** | Tipografía | Familia, escalas, pesos, line-height y letter-spacing según export del sistema de texto. |
| **Spacing.zip** | Espaciado | Escala de espacio vertical y horizontal alineada a grid/implementación. |
| **borders.zip** | Bordes | Grosores, radios y tokens de borde compartidos con superficies. |

**Foundations en catálogo (Feature 03):** el módulo **Borders** vive en **`desarrollo-listo/src/app/components/borders-view.tsx`** (ruta `/borders`, sidenav Foundations → Borders). Hoy expone solo la **escala de radios** desde `global.radius.*` (Figma, JSON modo claro de `desarrollo-listo/src/imports/`); los **colores de borde** siguen documentados en **Colors → Foundation Colors → Border** (`getFoundationColors()`), sin duplicar pantalla. Charter: **`Features/feature-03-foundations-core-utp/tasks/task_05_borders_foundation.md`**.

**Convención de repo (versionado)**  

1. Los artefactos descomprimidos o JSON exportados deben vivir en **`Features/feature-02-variables-core-utp/insumos/`**, siguiendo la tabla de nombres esperados del **`insumos/README.md`** de esa feature (`colors.tokens.json`, `spacing.tokens.json`, `borders.tokens.json`, `typography.tokens.json`, etc.).  
2. Tras añadir o cambiar insumos, ejecutar **`npm run tokens:ds`** (detalle técnico en **`Spec/proyect.md` §5.3**) para regenerar **`desarrollo-listo/src/styles/generated/ds-tokens-generated.css`**.  
3. La **capa semántica manual** **`desarrollo-listo/src/styles/ds-tokens.css`** sigue siendo el lugar acordado para alias `--ds-*` solo con `var(...)` hacia primitivos definidos en **`theme.css`** (sin nuevos hex en ese archivo).

**Estado operativo en el design tool (hoy)**  

- Las vistas que necesitan **paletas y foundations por JSON** consumen principalmente **`desarrollo-listo/src/imports/Ligth_mode.tokens.json`** y **`desarrollo-listo/src/imports/darkmode.tokens.json`** (par modo claro/oscuro). Considéralos **referencia runtime principal** hasta que la ingesta desde **`insumos/`** unifique todo el corpus en un solo pipeline.  
- Existen variantes numeradas (`Ligth_mode.tokens-1.json`, `*-2.json`, `*-3.json`, y equivalentes `darkmode.tokens-*.json`) usadas por **algunas vistas de catálogo** durante migraciones incrementales; al cerrar duplicados, preferí consolidar en los dos JSON raíz + **`token-parser`** / vistas únicas.  
- **`desarrollo-listo/src/app/utils/token-parser.ts`** centraliza lectura de grupos de color para Foundations (**Colors**) donde aplique; otras vistas importan JSON directamente cuando el contrato es distinto.

**Trazabilidad SDD (ejecución registrada)**  

- Charter y alcance: **`Features/feature-02-variables-core-utp/informa/Feature-02/feature_02_variables.md`**.  
- Evidencia técnica (tasks 01–05 y cierre 06–10): **`Features/feature-02-variables-core-utp/Ejecuciones/ejecucion_feature_02_tasks_01_a_05_2026-05-04.md`** y **`Features/feature-02-variables-core-utp/Ejecuciones/ejecucion_feature_02_tasks_06_a_10_2026-05-04.md`**.

**Regla de sincronización:** cualquier nuevo ZIP o cambio de convención de nombres en **`insumos/`** debe reflejarse aquí y en **`Features/feature-02-variables-core-utp/insumos/README.md`** en el mismo ciclo de PR que actualice el script **`merge-ds-tokens.mjs`** o los imports consumidos por vistas.

---

## 3. Panel de controles (derecha)

Patrón estándar para vistas de componente que permiten variar props / tokens:

| Estado | Ancho | Comportamiento |
|--------|--------|----------------|
| **Expandido** | **320px** (`w-80`) | Panel completo con scroll vertical interno. |
| **Colapsado** | **48px** (`w-12`) | Franja con control para reexpandir. |

- **Posición:** `fixed right-0 top-16` (debajo de la navbar), borde izquierdo alineado al resto del sistema (`border-gray-200` / `dark:border-gray-800`).
- **Superficie:** `bg-white` / `dark:bg-[#111111]` (misma familia que navbar para coherencia).
- **Contenido principal** debe reservar padding derecho coherente: **`pr-80`** expandido, **`pr-12`** colapsado (vía `ControlsPanelProvider` / `contentPaddingClass`).
- **Accesibilidad mínima:** botón de colapsar con `aria-expanded`, `aria-controls`, `title` descriptivo (ES/EN según convención del archivo existente).

**Regla:** nuevas vistas de catálogo con playground de props deben usar **`ControlsPanelFrame`** + contexto compartido, no un panel derecho ad hoc con otra anchura.

---

## 4. Color, bordes y modo oscuro

- **Escala:** priorizar **Tailwind** `gray-*` con pares `dark:` para texto, bordes y fondos secundarios (`gray-100`, `gray-200`, `gray-500`, `gray-800`, `gray-900`, etc.), alineado a las vistas existentes.
- **Tokens semánticos** del tema global (variables CSS en `desarrollo-listo/src/styles/theme.css`: `--primary`, `--border`, `--sidebar-*`, etc.) aplican a componentes **`ui/`** y a piezas que ya consumen esas variables; **no** mezclar sistemas de color sin motivo (p. ej. hex arbitrarios en un solo componente cuando el resto usa tokens o la escala gray).
- **Modo oscuro:** clase **`dark`** en el árbol (ver `theme-provider`); todo bloque nuevo debe definir variante `dark:` o variable que ya tenga contraste en `.dark`.

---

## 5. Tipografía y jerarquía en páginas de catálogo

Patrones recurrentes en vistas (`*-view.tsx`):

- **Título de sección / “Controls”:** `text-sm font-semibold` + texto primario; descripciones cortas con `text-xs text-gray-500 dark:text-gray-400`.
- **Etiquetas de grupo:** `text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400`.
- **Separadores:** `h-px bg-gray-200 dark:bg-gray-800` entre bloques del panel o de la página.
- **Fuentes de preview** alineadas a tokens de Figma cuando se documente tipografía (p. ej. familia desde JSON de imports).

**Regla:** nuevas pantallas de documentación repiten esta jerarquía para **scanability** homogénea.

---

## 6. Iconografía

- **Cromo de app** (sidebar, navbar, panel): **Lucide** (`lucide-react`), tamaños coherentes (`w-4 h-4`, `w-5 h-5` según contexto).
- **Material / catálogo de iconos** de producto: según la vista (p. ej. Material Symbols con `fontVariationSettings` acordados en la vista de botones/iconos); no mezclar familias en el mismo control sin criterio documentado.

---

## 7. Componentes primitivos (`desarrollo-listo/src/app/components/ui/`)

- Base **shadcn-like / Radix**: composición con utilidades Tailwind y variables de **`theme.css`**.
- Nuevos primitivos deben **seguir** el mismo nivel de encapsulación y naming que los existentes (`button.tsx`, `input.tsx`, etc.).
- Las **vistas de catálogo** orquestan variantes; la lógica de negocio mínima y el wiring a tokens viven en la vista o en helpers compartidos (`design-system-controls`, etc.), no duplicada en cada átomo.

---

## 8. Atomic Design (mapeo visual)

| Nivel | Dónde se “ve” en la app |
|-------|-------------------------|
| Foundations | Páginas Colors, Typography, Spacing, **Borders** (`/borders` — Feature 03 / `task_05_borders_foundation.md`), Icons (cuadrículas, tablas, swatches). |
| Atoms | Vistas bajo `/atoms/...`: rejilla de previews + panel de controles estándar. |
| Molecules / Organisms | Misma línea visual y **mismo layout de catálogo que Atoms** (referencia: `inputs-view.tsx` — preview card, spec cards, `ControlsPanelFrame`); ver Feature 05 §1.2. |

---

## 9. Checklist para nuevas vistas o componentes UI

- [ ] Layout respeta **navbar + sidebar + main** y, si aplica, **panel derecho** con anchos de esta spec.
- [ ] Colores y bordes alineados a **gray + dark:** o a **variables** de `theme.css`.
- [ ] Tipografía y separadores coherentes con **§5**.
- [ ] Iconos: **Lucide** en chrome; familia de catálogo según la vista hermana más cercana.
- [ ] Tokens desde **`desarrollo-listo/src/imports/`** (pare claro/oscuro) cuando el diseño los defina; nuevos dominios desde **`Features/feature-02-variables-core-utp/insumos/`** + **`npm run tokens:ds`** según **`Spec/proyect.md` §5.3**; sin valores mágicos sueltos si ya existe token.
- [ ] Tras cambios visuales globales, **actualizar esta spec** y, si aplica, capturas o enlace a frame de Figma en la descripción del PR.

### 9.1 Registro de verificación (feature 01 — 2026-05-04)

Estandarización **React** (feature 01): el design tool no alteró contrato visual del shell ni del panel de controles al añadir capa `lib/api` y tests (sin wiring nuevo en vistas salvo acuerdo explícito). Ejecuciones: **`Features/feature-01-estandarizacion-codigo/Ejecuciones/ejecucion_feature_01_react_estandar_2026-05-04.md`** (cierre inicial) y **`Features/feature-01-estandarizacion-codigo/Ejecuciones/ejecucion_feature_01_revalidacion_tasks_2026-05-04.md`** (re-ejecución tasks 01–08, checklist visual estático). Specs de referencia: **`Spec/arquitectura.md`**, **`Spec/api.md`**.

### 9.2 Registro — Feature 02: tokens ZIP → repo → runtime (2026-05-04)

Dominios **Colors, Typography, Spacing, Borders** acordados como ZIP en charter (**`Features/feature-02-variables-core-utp/informa/Feature-02/feature_02_variables.md`**, §6). Convención de archivos versionados en **`Features/feature-02-variables-core-utp/insumos/`**; pipeline **`npm run tokens:ds`** → **`desarrollo-listo/src/styles/generated/ds-tokens-generated.css`** (**`Spec/proyect.md` §5.3**). Consumo actual documentado en **§2.2**; evidencia de tareas: **`Features/feature-02-variables-core-utp/Ejecuciones/ejecucion_feature_02_tasks_01_a_05_2026-05-04.md`** y **`Features/feature-02-variables-core-utp/Ejecuciones/ejecucion_feature_02_tasks_06_a_10_2026-05-04.md`**.

---

## 10. Relación con otras specs

| Documento | Uso |
|-----------|-----|
| **`Spec/proyect.md`** | Visión, Atomic Design, SDD, **mapa del repositorio** (§5). |
| **`Spec/arquitectura.md`** | Capas y carpetas **React** (`desarrollo-listo/`); coherencia estructural con el catálogo documentado aquí. |
| **`Spec/api.md`** | No regula layout; regula **errores y datos** expuestos desde la capa HTTP en React. |

---

## 11. Rutas de implementación en `desarrollo-listo/src/` (design tool, este repo)

Toda la app bajo la carpeta padre **`desarrollo-listo/`** (ver **`Spec/proyect.md`** §5).

| Ruta | Responsabilidad visual / UI |
|------|-----------------------------|
| **`desarrollo-listo/src/app/App.tsx`** | Raíz de la app React. |
| **`desarrollo-listo/src/app/routes.tsx`** | Definición de rutas y layout con `DashboardLayout`. |
| **`desarrollo-listo/src/app/nav/categories.ts`** | **NAV_CATEGORIES** (orden Atomic) + **`resolveNavModuleMeta`** / **`isNavPathActive`** para sidenav y header de módulo. |
| **`desarrollo-listo/src/app/components/`** | Vistas de catálogo (`*-view.tsx`), shell (`dashboard-layout`, `navbar`, `sidebar`, `catalog-module-chrome`), panel de controles (`controls-panel-*`), controles compartidos (`design-system-controls`). |
| **`desarrollo-listo/src/app/components/ui/`** | Primitivos reutilizables (patrón shadcn/Radix + Tailwind). |
| **`desarrollo-listo/src/app/components/figma/`** | Utilidades ligadas a assets Figma cuando aplique. |
| **`desarrollo-listo/src/app/data/`** | Catálogos y JSON generados (p. ej. flags) consumidos por vistas. |
| **`desarrollo-listo/src/app/utils/`** | Utilidades de app no visuales. |
| **`desarrollo-listo/src/imports/`** | Tokens y artefactos exportados desde **Figma** (JSON modo claro/oscuro y variantes durante migraciones); lineage desde ZIP de diseño documentado en **§2.2**. |
| **`Features/feature-02-variables-core-utp/insumos/`** | JSON/ZIP **versionados** entregados por diseño (Colors, Typography, Spacing, Borders); convención de nombres en **`insumos/README.md`** de la feature; entrada del script **`tokens:ds`**. |
| **`desarrollo-listo/src/styles/`** | Entrada global (`index.css`), **`theme.css`**, **`ds-tokens.css`**, **`generated/ds-tokens-generated.css`**, Tailwind. |
| **`desarrollo-listo/src/main.tsx`** | Bootstrap de React. |

Cualquier **nueva vista** de documentación de componentes debería ubicarse bajo `desarrollo-listo/src/app/components/` y seguir los patrones de layout de las secciones anteriores de esta spec.

**Molecules (Feature 05, ola 1):** catálogo en `molecule-catalog-routes.ts`; sidenav solo con las cuatro moléculas de la ola; `/molecules` redirige al primer ítem. Layout de catálogo: **`inputs-view.tsx`** (§1.2 del charter).

---

*Documento vivo: si el equipo adopta un grid de 12 columnas explícito o un segundo tema, añadir sección y ejemplo en código de referencia.*
