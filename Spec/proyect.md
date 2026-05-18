# Proyecto — Plataforma core del design system

Documento maestro de **reglas transversales a nivel de negocio** y marco de trabajo. Las especificaciones detalladas por dominio viven en esta carpeta `Spec/` y deben evolucionar junto al producto.

---

## 1. Visión y propósito de negocio

Somos una **plataforma core** cuyo objetivo es concentrar el **repositorio canónico de componentes, tokens y patrones** de la organización. La herramienta no es solo un catálogo visual: es el punto de referencia para **descubrir, documentar, probar y alinear** lo que se construye en producto con lo que existe en diseño y en código.

**Reglas transversales de negocio:**

1. **Una sola fuente de verdad funcional.** Lo que se muestra en la plataforma debe reflejar componentes y tokens que la organización considera **oficiales** o en camino a oficializarse, con su estado (estable, experimental, deprecado) explícito cuando aplique.
2. **Coherencia diseño–código.** Los componentes documentados deben poder **rastrearse** hasta implementación (rutas, props, variantes) y, cuando exista, hasta **Figma o tokens** importados; no se promueve documentación desconectada del artefacto real.
3. **Reutilización antes que duplicación.** Nuevas piezas deben **apoyarse** en átomos y tokens existentes salvo decisión explícita de negocio para una excepción documentada.
4. **Accesibilidad y calidad como requisito, no anexo.** Las variantes y ejemplos expuestos deben respetar criterios mínimos de **accesibilidad, consistencia visual y mantenibilidad** acordados por el equipo.
5. **Evolución controlada.** Cambios que afecten contratos visuales o de API de componentes deben ir acompañados de **decisión de producto/diseño** y de **actualización de especificación** (ver sección 5).

---

## 2. Metodología: Spec-Driven Development (SDD)

Trabajamos **spec-first**: antes o en paralelo cercano al cambio, se define o actualiza el comportamiento esperado en `Spec/`. El código y la UI de la herramienta **implementan** esa especificación; no al revés sin dejar rastro documental.

**Principios SDD en este proyecto:**

- Las specs describen **qué** debe cumplirse y **por qué** (negocio, usuario, consistencia), no solo listados técnicos.
- Una spec **aceptable** es aquella que permite a otra persona **validar** si una implementación la cumple o no.
- Los detalles por área (átomos, tokens, iconografía, layout del dashboard, etc.) se **particionan** en archivos o secciones dentro de `Spec/` para no sobrecargar este documento.

Este archivo `proyect.md` concentra **reglas globales**; el resto de archivos en `Spec/` amplían por dominio.

---

## 3. Marco de organización: Atomic Design

La herramienta se construye y se estructura bajo **Atomic Design** como metodología de referencia:

| Nivel (Atomic Design) | Rol en la plataforma |
|----------------------|----------------------|
| **Tokens / foundations** | Colores, tipografía, espaciado, sombras, etc. Base sobre la que se componen las piezas. |
| **Átomos** | Componentes mínimos indivisibles en UI (botón, input, badge, switch, etc.). |
| **Moléculas** | Combinaciones simples de átomos con una responsabilidad clara. |
| **Organismos** | Secciones o bloques complejos reutilizables. |

**Regla transversal:** la navegación, los nombres y la documentación en la app deben **respetar** esta jerarquía salvo que una spec de dominio documente una excepción temporal y su plan de migración.

**Estado actual del producto (referencia):** la aplicación incluye vistas de **Foundations** (colores, tipografía, espaciado, iconos Material / Alert / File / Flags), vistas de **átomos** en catálogo (`/atoms/...`, Feature 04), y **Molecules** con catálogo ola 1 en rutas dedicadas (`molecule-catalog-routes.ts`, sidenav solo con esas 4 moléculas, placeholders con layout Inputs). **Feature 05** (`Features/feature-05-molecules/`):

| Molécula | Node Figma | Átomos / foundations que compone |
|----------|------------|----------------------------------|
| Date picker menu | `981:283052` | Button, Input, Calendar cell; iconos; tipografía y color |
| File upload item base | `978:299288` | Bar progress, Circle progress, File icons, Checkbox, Buttons; tipografía y color |
| Snackbar | `78:43989` | Alert icons; tipografía y color |
| Button toggle | `719:257900` | Buttons; tipografía y color |

Organismos: sección en expansión según roadmap.

---

## 4. Alcance de la carpeta `Spec/`

- Centralizar **criterios de aceptación**, glosario de negocio, políticas de versionado de componentes y enlaces entre diseño, tokens y código.
- Servir de insumo para **revisiones** (diseño, frontend, producto) y para incorporar nuevos miembros al criterio del design system.

**Specs de dominio (índice):**

| Documento | Contenido |
|-----------|------------|
| **`Spec/arquitectura-visual-ui.md`** | Arquitectura visual del design tool: shell, panel de controles, color/tipografía/iconos, tokens Figma/MCP, patrones de vistas de catálogo. |
| **`Spec/arquitectura.md`** | Arquitectura objetivo **React + Vite** en `desarrollo-listo/`: capas, carpetas, rutas, hooks/`lib/api` recomendado, Atomic Design. |
| **`Spec/api.md`** | Cliente HTTP y contratos en **React** (`fetch` / `lib/api`, `VITE_*`, errores, tests Vitest, SDD por endpoint). |

---

## 5. Mapa del repositorio y política de carpetas

`Spec/` y `Agents/` concentran **metodología, arquitectura y lineamientos**. El **código ejecutable y los assets** de la app viven bajo **`desarrollo-listo/`**; la documentación **describe** esas rutas y debe **actualizarse** cuando cambie el árbol relevante (SDD); **no sustituye** tener el código en el disco.

### 5.1 Tabla de carpetas en la raíz

| Carpeta / archivo | Rol | Dónde se documenta el detalle |
|--------------------|-----|-------------------------------|
| **`desarrollo-listo/`** | **Carpeta padre del desarrollo:** contiene `src/`, `public/`, `scripts/` e `index.html` de la app Vite + React. Ver `desarrollo-listo/README.md`. | **`Spec/arquitectura-visual-ui.md`** (§11), **`Spec/arquitectura.md`** (§3). |
| **`desarrollo-listo/src/`** | Código fuente: rutas, vistas del design system, UI primitiva, tokens importados, estilos. | §11 de **`Spec/arquitectura-visual-ui.md`**. |
| **`desarrollo-listo/public/`** | Assets estáticos (p. ej. banderas SVG tras ingesta). Respetar `.gitignore` para temporales masivos. | Esta tabla; **§5.3**. |
| **`desarrollo-listo/scripts/`** | Automatización Node (ingesta Figma → `desarrollo-listo/public/` + JSON en `desarrollo-listo/src/app/data/`). | Cabecera de cada script; **§5.3**. |
| **`dist/`** | Salida de **`npm run build`** en la raíz (configurado en `vite.config.ts`). Regenerable. | `.gitignore` |
| **`node_modules/`** | Dependencias de **`npm i`** en la raíz (convención npm). No editar a mano. | `package.json` / lockfile |
| **`vite.config.ts`**, **`package.json`** | Configuración de build y dependencias en la raíz (app React). | — |
| **`Features/`** | Registro por feature: `informa/` (charter `feature_*`), **`tasks/`** (tareas `.md`), **`Ejecuciones/`** (informes de resultado). Épicas activas: Feature 04 (átomos), **Feature 05 (moléculas — ola 1: Date picker menu, File upload item base, Snackbar, Button toggle)**. No sustituye `Spec/` ni el código en `desarrollo-listo/`. | `Features/feature-04-atoms/`, `Features/feature-05-molecules/`; charter `feature_05_molecules.md`. |
| **`guidelines/`** | *(Eliminada)* Plantilla genérica; criterio en **`Spec/`** y **`Agents/`**. | — |

### 5.2 Política explícita (estandarización)

- **No eliminar** `desarrollo-listo/` (ni su `src/`, `public/`, `scripts/`) ni `node_modules/` como sustituto de la documentación: se perdería la aplicación, los assets o el entorno de desarrollo.
- **`dist/`** puede borrarse en limpiezas locales; se recrea con **`npm run build`**.
- Cualquier **nueva carpeta** de primer nivel con significado para el producto debe **reflejarse** en esta sección o en la spec de dominio correspondiente.

### 5.3 Scripts documentados

Definidos en **`package.json`** de la raíz.

| Script (npm run) | Comando / ruta | Propósito breve |
|------------------|------------------|-----------------|
| `build` | `vite build` | Build producción del design tool React (`dist/` en raíz). |
| `test` | `vitest run` | Tests unitarios (p. ej. capa `lib/api`); ver **`Spec/api.md`**. |
| `test:watch` | `vitest` | Vitest en modo watch. |
| `dev` | `vite` | Servidor de desarrollo Vite (root `desarrollo-listo/`). |
| `flags:ingest` | `node desarrollo-listo/scripts/ingest-figma-flags.mjs` | Lee SVG en `desarrollo-listo/public/flags-temp/`, escribe `desarrollo-listo/public/flags/` y JSON bajo `desarrollo-listo/src/app/data/`. **Requiere** `flags-temp` poblado; si falta, falla con mensaje del script (esperado). |
| `tokens:ds` | `node desarrollo-listo/scripts/merge-ds-tokens.mjs` | Feature 02: lee JSON en **`Features/feature-02-variables-core-utp/insumos/`** y regenera `desarrollo-listo/src/styles/generated/ds-tokens-generated.css` (stub si no hay insumos). Capa semántica manual: **`desarrollo-listo/src/styles/ds-tokens.css`**. |

---

## 6. Clausula de sincronización ante cambios (obligatoria)

**Cada vez que se produzcan cambios** en el repositorio que afecten comportamiento, contrato público de componentes, tokens, rutas de usuario o reglas de negocio descritas aquí o en otras specs:

1. **Se debe revisar** la especificación correspondiente en `Spec/` (y este `proyect.md` si el cambio es transversal).
2. **Se deben hacer los cambios** en la documentación para que quede alineada con la realidad del código y del diseño; no se mergea o entrega trabajo “solo en código” sin actualizar la spec cuando la spec exista o el cambio sea relevante para el design system.
3. Si no existe aún una spec para ese dominio, **se crea** un archivo o sección mínima que cubra el nuevo comportamiento o la decisión tomada.

Esta cláusula aplica a features, refactors que cambien contratos visibles, deprecaciones y correcciones que modifiquen el comportamiento documentado.

---

## 7. Glosario breve

- **Plataforma core:** esta herramienta y su contenido como referencia organizacional del design system.
- **Spec:** documento en `Spec/` que define intención, reglas y criterios verificables.
- **Componente canónico:** pieza reconocida por el sistema y expuesta (o en proceso de exposición) en el repositorio de la plataforma.

---

*Última convención de nombres: este archivo se llama `proyect.md` por decisión del equipo; si se unifica el idioma de nombres de archivos a inglés, puede renominarse manteniendo el mismo contenido y actualizando referencias.*
