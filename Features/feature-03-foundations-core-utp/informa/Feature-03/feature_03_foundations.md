# Feature 03 — Foundations Core-UTP (tipografia, colores, borders, iconografia, branding)

**Producto / contexto:** Core-UTP en `desarrollo-listo/`.  
**Estado:** Abierta — planificacion.  
**Agente principal sugerido:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system` + `@Agents/metodologia-sdd`.

---

## 1. Objetivo (epica)

Definir, estructurar y documentar las bases visuales del Design System (Foundations), incluyendo tipografia, colores, **bordes (borders)**, iconografia y branding, asegurando consistencia, reutilizacion y alineacion directa con desarrollo mediante tokens.

---

## 1.1 Principio operativo (no negociable)

- En CSS/SCSS/Tailwind (colores, tipografia, spacing, border, radius, sombras, efectos) se usan **solo variables/tokens ya creados**.
- No se permiten literales nuevos en implementacion (`#hex`, `rgb/rgba`, `hsl`, `px` arbitrarios, `font-size` ad hoc), salvo excepcion documentada y aprobada.
- Si un valor no existe en tokens, primero se incorpora en la capa de tokens y luego se consume en componentes.
- Toda decision visual en foundations debe quedar trazable en "Ver codigo / variable / token".

---

## 2. Contexto

Para este punto del proyecto, ya deben existir tokens y navegacion definidos/aprobados.

Actualmente:

- No existe documentacion centralizada de foundations.
- Los estilos visuales no estan completamente estandarizados.
- Hay inconsistencias en colores, tipografia, bordes e iconos.
- No hay una conexion clara entre diseno y codigo.

Esto genera:

- Experiencias inconsistentes.
- Dificultad para escalar el sistema.
- Ambiguedad en decisiones de diseno.
- Friccion con desarrollo.

---

## 3. Alcance

### 3.1 Tipografia

- Definir una sola `font-family` principal.
- Definir escala tipografica (`h1`, `h2`, `h3`, `body`, `caption`, etc.) desde JSON de estilos.
- Definir pesos (`regular`, `medium`, `semibold`, `bold`) con nomenclatura universal (`sm`, `md`, `lg`, `xl`).
- Definir `line-height` y `letter-spacing` desde estilos.
- Conectar todo a tokens ya aprobados.
- Implementar vista con preview editable (live text) y tabla de especificaciones.

### 3.2 Colores

#### 3.2.1 Primary & Secondary

- Definir paletas completas de `50` a `950`.
- Naming esperado: `color-primary-500`, `color-secondary-300`.

#### 3.2.2 Foundation Colors (semanticos)

- Definir mapeo semantico (light/dark) sobre primary/secondary:
  - Success
  - Warning
  - Error
  - Info
  - Background
  - Border
  - Text
- Naming de uso esperado: `bg-primary`, `text-primary`, `border-primary` (y equivalentes semanticos).
- Los tokens seran recibidos por el equipo de diseno.

### 3.3 Borders (foundation)

- Definir tokens de **borde** (grosor, estilo, color de trazo cuando aplique) y **radio** desde el JSON del paquete **Borders** (ZIP / `borders.tokens.json` en insumos Feature 02, ver **`Spec/arquitectura-visual-ui.md`** §2.2).
- Variantes **light/dark** cuando el JSON lo defina.
- Vista de catalogo con preview y tabla de especificaciones; accion **Ver codigo / variable / token**.

### 3.4 Iconografia

#### 3.4.1 Material Icons

- Uso exclusivo: Material Icons rounded, sin fill.
- Tamaños soportados: `16`, `20`, `24`, `32`, `40`.
- Colores restringidos a tokens (ejemplo: `primary-600`).
- Vista con buscador y preview.
- Naming de size por nomenclatura: `sm`, `md`, `lg`, `xl`.

#### 3.4.2 File Icons

- Tipos minimos: PDF, DOC, XLS, IMG.
- Definir estilo consistente: color, forma, tamano.

#### 3.4.3 Alert Icons

- Success, Warning, Error, Info.
- Alineados a colores semanticos de foundations.

### 3.5 Flag Icons

- Representacion de paises.
- Uso en idiomas y configuraciones regionales.

### 3.6 Brand Logos

- Representa logos institucionales UTP.
- Versiones: principal, secundario, isotipo, monocromatico.
- Estados: claro y oscuro.
- Reglas de uso: tamano minimo, safe area, usos incorrectos.

### 3.7 Caracteristica repetible (regla transversal)

Cada modulo foundations debe incluir una accion visible para: **Ver codigo / variable / token**.

---

## 4. Criterios de aceptacion

- [ ] Existe una documentacion centralizada de Foundations en este feature.
- [ ] Cada modulo foundations expone accion de ver codigo, variable o token.
- [ ] En estilos de foundations no hay literales nuevos; solo consumo de tokens/variables aprobadas.
- [ ] Tipografia conectada a tokens y con preview + tabla de specs.
- [ ] Colores primary/secondary y semanticos definidos para light/dark.
- [ ] Foundation **Borders** documentada e implementada con tokens Feature 02.
- [ ] Iconografia (material, file, alert, flags) normalizada y tokenizada.
- [ ] Brand logos documentados con variantes y reglas de uso.
- [ ] `Spec/arquitectura-visual-ui.md` y `Spec/arquitectura.md` actualizados cuando aplique.

---

## 5. Insumos de diseno

Carpeta recomendada: `Features/feature-03-foundations-core-utp/insumos/`.

Pendientes de carga:

- JSON de tipografia.
- JSON de colores y alias semanticos.
- JSON / ZIP de **borders** (alineado a Feature 02 `borders.tokens.json` o export equivalente).
- ZIP/API/repositorio de iconografia.
- Logos institucionales UTP y guia de marca.

---

## 6. Enlaces y decisiones pendientes

- Figma foundations (tipografia, colors, borders, icons, logos): pendiente.
- Confirmacion de fuente oficial para Material Icons.
- Confirmacion de pack oficial para flags e iconos de archivo.

---

## 7. Tasks

Carpeta: `../../tasks/`.

| Orden | Archivo | Resumen |
|------:|---------|---------|
| 01 | `task_01_tipografia_foundation.md` | Tipografia foundation (preview + tabla + tokens) |
| 02 | `task_02_colores_secondary.md` | Escala de colores secondary (50-950) |
| 03 | `task_03_colores_primary_y_secondary.md` | Vista combinada primary & secondary y validacion |
| 04 | `task_04_foundation_colors_semanticos.md` | Success/Warning/Error/Info/Background/Border/Text (light/dark) |
| 05 | `task_05_borders_foundation.md` | Foundation borders (radios, grosores, tokens; JSON Borders Feature 02) |
| 06 | `task_06_icons_material.md` | Material icons (rounded, sin fill, buscador y preview) |
| 07 | `task_07_icons_file.md` | Iconos de archivo (PDF, DOC, XLS, IMG) |
| 08 | `task_08_icons_alert.md` | Iconos de alerta (success, warning, error, info) |
| 09 | `task_09_icons_flags.md` | Flag icons para idioma/regionalizacion |
| 10 | `task_10_brand_logos.md` | Logos institucionales UTP y reglas de uso |
| 11 | `task_11_verificacion_variables_json_feature_02.md` | Verificacion final: solo variables/tokens desde JSON de Feature 02 |

---

## 8. Ejecuciones

Carpeta: `../../Ejecuciones/`.

| Documento |
|-----------|
| `README.md` (indice inicial) |

---

*Charter: `Features/feature-03-foundations-core-utp/informa/Feature-03/feature_03_foundations.md`.*
