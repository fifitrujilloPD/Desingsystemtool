# Task 10 — Cierre: regresión + prueba de propagación de token

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/fullstack-design-system` + `@Agents/ux-ui-design-system`  
**Specs:** checklist `Spec/arquitectura-visual-ui.md`

---

## Objetivo

Cerrar la feature con **evidencia**: build, tests si existen, checklist visual (shell, sidenav nuevo, módulos), y **prueba explícita de propagación**: cambiar **un** token en la fuente (JSON + regenerar) y verificar que **al menos dos** pantallas cambian sin editar JSX de esas pantallas.

---

## Entregables

1. **`Ejecuciones/ejecucion_feature_02_*.md`** con comandos, capturas opcionales, resultado de la prueba de propagación.
2. Charter: estado **Cerrada** y enlaces a informes.
3. Lista corta de **seguimiento** (P2) si quedó deuda del inventario **task_02**.

---

## Criterios de hecho (DoD)

- [ ] `npm run build` (y `npm run test` si aplica) OK.
- [ ] Prueba de propagación documentada (qué token, qué archivos se tocaron, qué UI cambió).
- [ ] Aprobación visual humana recomendada en PR para cierre final.

---

## Orden

Última task, después de **task_09** (o junto si la doc va en el mismo PR final).
