# Task 11 — Verificacion variables (JSON Feature 02)

**Feature:** 03 foundations Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/metodologia-sdd`

## Objetivo

Verificar y cerrar que todos los foundations implementados en Feature 03 usan unicamente variables/tokens provenientes de los JSON y mappings definidos en Feature 02.

## Entregables

1. Checklist por modulo (tipografia, colores, borders, material/file/alert/flags, logos).
2. Evidencia de busqueda de literales no permitidos y correcciones.
3. Informe de ejecucion en `Ejecuciones/`.
4. Nota de actualizacion de `Spec/` si cambia el contrato visual.

## Reglas

- Cualquier valor faltante se crea en la capa de tokens, nunca hardcodeado en componente.
- Excepciones solo si quedan documentadas con razon y plan de retiro.

## DoD

- [x] Cero literales nuevos en foundations cromáticos (Tipografía, Colors, Borders, Spacing, Alert Icons). Excepciones de File Icons, botón Code/SVG y fallback de Material listadas con plan de retiro en `Ejecuciones/ejecucion_feature_03_task_11_verificacion_2026-05-04.md`.
- [x] Todos los tokens consumidos por foundations son rastreables a `ds-tokens.css` → `theme.css` y/o a JSON Feature 02 (`Ligth_mode.tokens-3.json` / `darkmode.tokens-3.json`); cero referencias activas a `var(--core-utp-…)`.
- [x] Build (`npm run build`) y tests (`npm run test`) en verde; smoke visual delegado a la siguiente iteración (esta task es de verificación, no modifica UI).
