# Ejecución — Feature 04 / Task 04 — Inputs (2026-05-15)

**Task:** `Features/feature-04-atoms/tasks/task_04_inputs.md`  
**Figma:** [Inputs](https://www.figma.com/design/Oe6iEqTP8ieLJrSa5zHE0a/Design-system--Copy-?node-id=2-8432) · `nodeId: 2:8432`

## Objetivo

Estandarizar el átomo **Inputs** a tokens `--ds-*` sin alterar el diseño visual ya validado en catálogo.

## MCP Figma (evidencia)

| Herramienta | Resultado |
|-------------|-----------|
| `get_variable_defs` (2:8432) | `border-primary` #d0d5dd, `border-brand-color` #003d6d, `text-primary` #0b1220, `text-secondary` #344054, `text-disabled` #98a2b3, `text-error` vía semantic #d92d20, `bg-container` #ffffff, body 16/14 |

### Mapeo Figma → tokens DS

| Uso | Token JSON | CSS consumo |
|-----|------------|-------------|
| Borde default / disabled | `Border color.border-primary` | `var(--ds-input-border)` |
| Borde focus (1.5px) | `Button color.button-hover` | `var(--ds-input-border-focus)` |
| Borde error | `Text colors.text-error` | `var(--ds-input-border-error)` |
| Texto primary | `Text colors.text-primary` | `var(--ds-color-control-ink)` |
| Texto secondary / placeholder | `Text colors.text-secondary` | `var(--ds-color-control-ink-muted)` |
| Texto disabled | `Text colors.text-disabled` | `var(--ds-input-text-disabled)` |
| Helper / error | `Text colors.text-error` | `var(--ds-input-text-error)` |
| Floating label cutout | `Background.bg-container` | `var(--ds-input-surface)` |
| Switch panel ON | `Button color.button-color` | `var(--ds-color-brand)` |

## Cambios en código

| Archivo | Cambio |
|---------|--------|
| `theme.css` | Primitivos `--foundation-border-primary`, `--foundation-text-disabled`, `--foundation-text-error` (light/dark). |
| `ds-tokens.css` | Alias `--ds-input-*` para bordes, texto y superficie del input. |
| `token-parser.ts` | `resolveJsonBorderColor`. |
| `inputs.module.css` | **Nuevo.** Estilos del preview con `data-state` / `data-has-value`; sin hex. |
| `inputs-view.tsx` | Refactor: sin `resolveColor` en preview; shell `radio-button.module.css`; `CodeModal` html+css con `var(--ds-*)`. |

## DoD

- [x] Vista alineada al frame Figma `2:8432` (diseño visual preservado).
- [x] Sin literales de color en estilos del preview (hex solo en tarjetas JSON).
- [x] **Ver código / variable / token** funcional.
- [x] `npm run test` y `npm run build` en verde.

## Verificación

```
npm run test  → 2/2 OK
npm run build → OK
```

## Excepciones

- Banderas emoji en selector de país (contenido, no token de color).
- `style={{ fontSize: 18 }}` en fila de dropdown solo para tamaño de emoji.
