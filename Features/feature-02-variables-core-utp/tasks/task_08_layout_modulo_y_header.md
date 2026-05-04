# Task 08 — Layout por módulo + header con nombre del módulo

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system`  
**Specs:** `Spec/arquitectura-visual-ui.md`, `Spec/arquitectura.md` (rutas)

---

## Objetivo

Contenedor de contenido donde las vistas del DS se renderizan por **módulo**, con **navegación entre módulos** desde el sidenav y un **header** que muestra el **nombre del módulo activo** (texto legible; estilos mínimos usando **tokens** — sin diseño final elaborado).

---

## Entregables

1. Layout o wrapper (ej. dentro de `DashboardLayout` / `Outlet`) que reciba **metadata de módulo** (desde ruta, loader, o config compartida con sidebar).
2. Header reutilizable: prop `title` o derivado de ruta.
3. Navegación entre al menos dos módulos verificada en dev.

---

## Criterios de hecho (DoD)

- [ ] Título coherente con label del sidenav para la misma ruta.
- [ ] Sin CSS nuevo con literales: spacing/tipo/color desde tokens.
- [ ] Documentar en `Spec/arquitectura-visual-ui.md` si cambia el contrato del shell.

---

## Orden

Después de **task_07** (o en paralelo si el layout no choca con rutas).
