# Feature 02 — Variables Core-UTP (tokens + sidenav + layout)

**Producto / contexto:** **Core-UTP** — reestructuración del Design System en la herramienta **React** (`desarrollo-listo/`).  
**Estado:** **Cerrada (fase implementación shell + nav + SDD)** — 2026-05-04 — ingesta JSON masiva y refactor de vistas **P2** (seguimiento).  
**Agente principal sugerido:** `@Agents/fullstack-design-system` (implementación + estructura); **`@Agents/ux-ui-design-system`** (alineación Figma / `Spec/arquitectura-visual-ui.md`); **`@Agents/metodologia-sdd`** (actualizar `Spec/` tras cambios de tokens o navegación).

---

## 1. Objetivo (épica)

Reestructurar y estandarizar el Design System de **Core-UTP** mediante:

1. La organización de **variables (design tokens)**: colores, tipografía, spacing, borders, sombras, efectos, etc.
2. La **reorganización del sidenav** bajo **Atomic Design**, en este orden: **Foundations → Atoms → Molecules → Organisms**.
3. La **construcción del layout** (card / área de contenido) donde se renderizan las vistas, con **navegación entre módulos** y **header con el nombre del módulo** activo (el header aún no requiere diseño final detallado).

**Meta:** consistencia visual, escalabilidad y facilidad de implementación en código, con **nomenclatura y semántica alineadas al JSON de diseño**.

### 1.1 Principio operativo (anti “CSS basura”)

- Los componentes se construyen y mantienen **referenciando solo tokens** (capa única documentada en **task_03**).  
- **No** introducir valores sueltos nuevos (`#…`, `px` arbitrarios, `font-size` ad hoc) salvo **excepción** listada en auditoría (**task_02**) y aprobada.  
- Objetivo práctico: cambiar color / tipografía / spacing **en el JSON o en la capa de tokens** y que el cambio **se propague** sin tocar cada archivo de componente (**task_10** valida esto).

---

## 2. Contexto

| Situación actual | Consecuencia |
|------------------|--------------|
| Inconsistencias en variables (colores, tipografía, spacing, borders) | Duplicidad de estilos y esfuerzo de mantenimiento |
| Falta de estandarización en la estructura de componentes | Dificultad para escalar el sistema |
| Desalineación Figma ↔ código | UX inconsistente |
| Ausencia de jerarquía clara Atomic Design | Navegación y mental model poco claros |

---

## 3. Alcance

### 3.1 Revisión y estandarización de variables (design tokens)

**Se consideran tokens:** colores, tipografía, borders, spacing, shadows, efectos, y demás definidos por diseño.

**Pasos:**

- Tomar como fuente de verdad los **JSON entregados por diseño** (ver **§6 Insumos**).
- **Mantener nomenclatura y semántica** definidas por el equipo (ej. `primary`, `success`, `error`, …).
- Nombrar / mapear en código con **convenciones claras** acordadas con diseño (ej. `color-primary-500`, `spacing-16`, `font-size-lg`) sin romper la semántica del JSON.
- **Eliminar duplicados e inconsistencias** entre tokens legacy en `desarrollo-listo/src/imports/` y los nuevos insumos.
- Definir / mantener **tokens light/dark** si el JSON y el producto lo exigen.
- Documentar **jerarquías de uso** (qué token usar y cuándo) según lo ya definido en el JSON o en Figma.

### 3.2 Reestructuración del sidenav (arquitectura del DS)

Orden de secciones en navegación:

1. **Foundations**  
2. **Atoms**  
3. **Molecules**  
4. **Organisms**

**Definir:**

- Estructura de navegación **clara y escalable** (se incorporará **link de diseño** de la navegación cuando esté disponible — añadir en §7).
- **Categorización consistente** con Atomic Design.
- **Naming uniforme** alineado a diseño en todos los niveles.
- **Relación diseño ↔ código** (rutas, labels, orden).

### 3.3 Layout y vistas por módulo

- Navegación funcional entre **módulos** desde el sidenav.
- En cada módulo, **header con el nombre del módulo** visible (sin exigir aún diseño final del header).

---

## 4. Fuera de alcance (por ahora)

- Diseño pixel-perfect del header de módulo (solo nombre visible).
- Lo no acordado explícitamente en JSON/Figma compartido por Core-UTP.

---

## 5. Criterios de aceptación

- [x] Pipeline tokens + primitivos shell (`--layout-*`, `--ds-*`); ingesta JSON **pendiente** de insumos en `insumos/` (**task_04** siguiente oleada).
- [x] Shell principal sin literales en JSX para fondos/cromo (página, navbar, sidebar, panel); modales usan `bg-card`.
- [x] Sidenav ordenado **Foundations → Atoms → Molecules → Organisms**; datos únicos en **`app/nav/categories.ts`**.
- [x] **Header de módulo** (`CatalogModuleChrome`) con módulo Atomic + título de página alineados al sidenav.
- [x] **`Spec/arquitectura-visual-ui.md`** y **`Spec/arquitectura.md`** actualizados (SDD).

---

## 6. Insumos de diseño (JSON / ZIP)

Los archivos siguientes son **entregables del equipo de diseño**; deben **copiarse o descomprimirse dentro del repositorio** (ruta sugerida: `Features/feature-02-variables-core-utp/insumos/` o la que acuerde el equipo) para versionarlos y usarlos en ingesta — **no depender de rutas absolutas locales** en CI.

| Tema | Origen (máquina local — referencia) |
|------|-------------------------------------|
| Colores | `~/Desktop/Colors.zip` |
| Spacing | `~/Downloads/Spacing.zip` |
| Borders | `~/Downloads/borders (1).zip` |
| Typography | `~/Downloads/Typography.zip` |

**Acción siguiente:** quien tenga los ZIP los coloca en **`Features/feature-02-variables-core-utp/insumos/`** (crear carpeta) y registra en un informe de **`Ejecuciones/`** la versión y la fecha.

---

## 7. Enlaces y decisiones pendientes

- **Figma — navegación sidenav:** *(pendiente — pegar URL cuando exista)*  
- **Decisión técnica (tasks 01–05):** capa **`--ds-*`** en `desarrollo-listo/src/styles/ds-tokens.css` (solo `var(--*)` hacia `theme.css`); generado opcional vía **`npm run tokens:ds`**. Detalle: **`Ejecuciones/ejecucion_feature_02_tasks_01_a_05_2026-05-04.md`**.

---

## 8. Tasks

Carpeta: **`../../tasks/`**. Orden recomendado (ajustar dependencias en PR si se paraleliza):

| Orden | Archivo | Resumen |
|-------|---------|---------|
| 01 | [`task_01_plan_tokens_y_navegacion.md`](../../tasks/task_01_plan_tokens_y_navegacion.md) | Plan: insumos, pipeline, sidenav Atomic; principio solo-tokens |
| 02 | [`task_02_auditoria_literales_vs_tokens.md`](../../tasks/task_02_auditoria_literales_vs_tokens.md) | Inventario de literales vs tokens (prioridad refactor) |
| 03 | [`task_03_capa_unica_tokens_runtime.md`](../../tasks/task_03_capa_unica_tokens_runtime.md) | Una sola capa técnica JSON → runtime (CSS vars / theme) |
| 04 | [`task_04_ingesta_json_core_utp.md`](../../tasks/task_04_ingesta_json_core_utp.md) | Ingesta Colors, Spacing, Borders, Typography |
| 05 | [`task_05_light_dark_y_alias_semanticos.md`](../../tasks/task_05_light_dark_y_alias_semanticos.md) | Light/dark y alias semánticos sin duplicar |
| 06 | [`task_06_refactor_componentes_a_solo_tokens.md`](../../tasks/task_06_refactor_componentes_a_solo_tokens.md) | Refactor incremental UI/vistas → solo tokens |
| 07 | [`task_07_sidenav_atomic_design.md`](../../tasks/task_07_sidenav_atomic_design.md) | Sidenav Foundations → … → Organisms |
| 08 | [`task_08_layout_modulo_y_header.md`](../../tasks/task_08_layout_modulo_y_header.md) | Layout módulo + header nombre |
| 09 | [`task_09_sdd_specs_tokens_y_navegacion.md`](../../tasks/task_09_sdd_specs_tokens_y_navegacion.md) | Actualizar `Spec/` (SDD) |
| 10 | [`task_10_cierre_regresion_y_ejecucion.md`](../../tasks/task_10_cierre_regresion_y_ejecucion.md) | Cierre, regresión, prueba propagación token |

---

## 9. Ejecuciones

Carpeta: **`../../Ejecuciones/`**.

| Documento |
|-----------|
| [`ejecucion_feature_02_tasks_01_a_05_2026-05-04.md`](../../Ejecuciones/ejecucion_feature_02_tasks_01_a_05_2026-05-04.md) — tasks 01–05 |
| [`ejecucion_feature_02_tasks_06_a_10_2026-05-04.md`](../../Ejecuciones/ejecucion_feature_02_tasks_06_a_10_2026-05-04.md) — tasks 06–10 |

---

*Charter: `Features/feature-02-variables-core-utp/informa/Feature-02/feature_02_variables.md`.*
