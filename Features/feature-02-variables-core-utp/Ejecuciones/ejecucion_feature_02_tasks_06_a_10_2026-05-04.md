# Ejecución — Feature 02: tasks 06 a 10 (refactor tokens, sidenav, layout, SDD, cierre)

**Fecha:** 2026-05-04  
**Agente / criterio:** `@Agents/fullstack-design-system` (+ SDD en `Spec/`)

---

## Task 06 — Refactor a tokens (shell + modales)

### Cambios en código

| Área | Antes | Después |
|------|--------|---------|
| `dashboard-layout.tsx` | `bg-[#FAFAFA]` / dark hex | `bg-[var(--ds-color-surface-app)]` |
| `navbar.tsx` | `bg-white` / `dark:bg-[#111111]` | `bg-[var(--ds-color-surface-chrome)]` + borde token |
| `sidebar.tsx` | igual | superficie + borde token; rutas activas `/` unidas a **Colors** vía `isNavPathActive` |
| `controls-panel-frame.tsx` | hex cromo | `bg-[var(--ds-color-surface-chrome)]` + borde token |
| `code-modal.tsx`, `icons-code-modal.tsx` | `bg-white dark:bg-[#1e1e2e]` | `bg-card text-card-foreground` (tema existente) |

### Fuente única de primitivos shell

- **`theme.css`**: `--layout-page-bg`, `--layout-chrome-bg` en `:root` y `.dark` (únicos hex de página / cromo para esta oleada).
- **`ds-tokens.css`**: `--ds-color-surface-app` → `var(--layout-page-bg)`; `--ds-color-surface-chrome` → `var(--layout-chrome-bg)`.

**Deuda (P2):** vistas `*-view.tsx` con muchos hex (inventario task_02) — **no** cubiertas en esta pasada.

---

## Task 07 — Sidenav Atomic Design

- **`desarrollo-listo/src/app/nav/categories.ts`**: export **`NAV_CATEGORIES`**, **`resolveNavModuleMeta`**, **`isNavPathActive`**.
- **`sidebar.tsx`**: consume `NAV_CATEGORIES` + helpers; orden **Foundations → Atoms → Molecules → Organisms** sin duplicar datos.

**DoD:** cumplido.

---

## Task 08 — Layout módulo + header

- Nuevo **`catalog-module-chrome.tsx`**: encabezado con **módulo Atomic** + **título de página** desde `resolveNavModuleMeta(useLocation().pathname)`.
- **`dashboard-layout.tsx`**: `<Outlet />` envuelto en `<CatalogModuleChrome>`.

**DoD:** cumplido (coherencia con labels del sidenav para rutas listadas).

---

## Task 09 — SDD en `Spec/`

| Archivo | Cambio |
|---------|--------|
| **`Spec/arquitectura-visual-ui.md`** | §2 tabla shell/nav/sidebar/header módulo; **§2.1** tokens semánticos (`--ds-*`); **§11** rutas `nav/categories.ts`, `catalog-module-chrome`, estilos. |
| **`Spec/arquitectura.md`** | Tabla §3: fila **`app/nav/`**. |

**Nota:** script documentado como **`npm run tokens:ds`** (no `tokens:build`).

---

## Task 10 — Cierre, regresión, propagación

### Comandos

```text
npm run test  → OK
npm run build → OK
```

### Prueba de propagación (documentada)

1. **Archivo tocado:** `desarrollo-listo/src/styles/theme.css` — variables **`--layout-page-bg`** y/o **`--layout-chrome-bg`** en `:root` / `.dark`.
2. **Sin editar JSX** de: `dashboard-layout.tsx`, `navbar.tsx`, `sidebar.tsx`, `controls-panel-frame.tsx` (ya consumen `var(--ds-*)` → `var(--layout-*)`).
3. **Efecto UI:** al cambiar p. ej. `--layout-page-bg` en claro, el **fondo de página** del layout completo cambia; al cambiar `--layout-chrome-bg`, **navbar**, **sidebar** y **panel de controles** comparten el nuevo cromo.

**Segundo punto de propagación:** `CatalogModuleChrome` usa `--ds-color-text-primary` / `text-muted` / `border-default`; al ajustar esos alias en **`ds-tokens.css`** o primitivos en **`theme.css`**, el **header de módulo** y el resto de UI enlazada a esos tokens se actualizan sin tocar el componente del header.

### Aprobación visual

Recomendado **smoke manual** en `/`, `/atoms`, `/colors` tras merge.

---

## Resumen tasks 06–10

| Task | Estado |
|------|--------|
| 06 | Parcial — shell + modales; vistas catálogo pendientes P2 |
| 07 | OK |
| 08 | OK |
| 09 | OK |
| 10 | OK — evidencia arriba |

---

*Informe complementario a `ejecucion_feature_02_tasks_01_a_05_2026-05-04.md`.*
