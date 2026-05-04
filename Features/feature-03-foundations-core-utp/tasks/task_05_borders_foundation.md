# Task 05 — Borders foundation

**Feature:** 03 foundations Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`  
**SDD:** tras implementar o cambiar rutas/vistas, actualizar **`Spec/arquitectura-visual-ui.md`** (foundations / tokens) si cambia el contrato visual.

## Objetivo

Documentar e implementar el foundation de **bordes** (grosor, estilo, radio, tokens semanticos de borde) alineado a los JSON del paquete **Borders** (ZIP / export Figma) ya acordado en **Feature 02** (`Features/feature-02-variables-core-utp/insumos/` convencion `borders.tokens.json`; runtime paralelo en `desarrollo-listo/src/imports/` hasta ingesta unificada).

## Entregables

1. Vista o seccion de catalogo **Borders** (o extension de foundations existente) con preview por token (width, style, radius si aplica).
2. Tabla o listado de especificaciones: nombre token, valor resuelto, uso recomendado (light/dark).
3. Accion **Ver codigo / variable / token** en el modulo.

## Reglas

- Si ya existe modulo o ruta de borders/spacing que cubra radios, **reutilizar** y solo ajustar variables; no duplicar pantallas.
- Solo variables/tokens aprobados; sin literales nuevos en CSS/TSX.
- Alineacion con **`Spec/arquitectura-visual-ui.md`** §2.2 (dominio Borders del lineage Core-UTP).

## DoD

- [x] Tokens de borde trazables a JSON de Feature 02 (radios `global.radius.{0,4,8,10,12,16,24}` consumidos en `borders-view.tsx`; color de borde via `var(--ds-color-border-default)` y radio base `--ds-radius-default` ↔ `radius-10`).
- [x] Smoke visual light/dark sin regresiones no documentadas (vista nueva en `/borders`; sin tocar shell, panel de controles ni Foundation Colors).
- [x] Spec actualizada (**`Spec/arquitectura-visual-ui.md`** §2.2 y §8) con ruta y alcance: solo radios; color de borde sigue en Colors → Foundation Colors → Border (no se duplica).
