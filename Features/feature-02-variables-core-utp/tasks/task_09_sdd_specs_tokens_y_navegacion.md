# Task 09 — SDD: specs para tokens y navegación Core-UTP

**Feature:** 02 variables Core-UTP  
**Agente:** `@Agents/metodologia-sdd` (principal) + `@Agents/fullstack-design-system`  
**Specs:** `Spec/proyect.md` §6; editar solo `.md` existentes salvo orden explícita

---

## Objetivo

Dejar en **`Spec/`** la verdad comprobable: **dónde** viven los tokens, **cómo** se regeneran, **tabla** ruta ↔ módulo Atomic, y reglas de **no literales**. Preferir ampliar **`Spec/arquitectura-visual-ui.md`** y/o **`Spec/proyect.md` §5.3** antes de crear archivo nuevo (regla SDD).

---

## Entregables

1. Secciones nuevas o tablas en specs ya existentes (sin duplicar el charter completo).
2. Enlace al script `tokens:build` (o nombre final) si existe.
3. “Qué token usar cuándo” resumido (o enlace al JSON semántico en repo).

---

## Criterios de hecho (DoD)

- [ ] Un revisor puede, leyendo solo `Spec/`, entender el pipeline y la prohibición de CSS basura.
- [ ] Charter **§5** criterios de aceptación actualizados a `[x]` donde corresponda.

---

## Orden

Cuando **task_03**–**task_08** estén en estado estable o por fases al cerrar cada oleada.
