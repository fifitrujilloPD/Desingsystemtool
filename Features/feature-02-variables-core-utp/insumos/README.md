# Insumos Core-UTP (diseño)

Colocar aquí los artefactos **versionados** entregados por diseño (descomprimir ZIP o copiar JSON).

## Nombres esperados (convención repo)

| Dominio | Archivo sugerido |
|---------|-------------------|
| Colores | `colors.tokens.json` (o el JSON raíz que exporte Figma) |
| Spacing | `spacing.tokens.json` |
| Borders | `borders.tokens.json` |
| Typography | `typography.tokens.json` |

Tras añadir o actualizar archivos, ejecutar en la raíz del monorepo:

```bash
npm run tokens:ds
```

Eso regenera `desarrollo-listo/src/styles/generated/ds-tokens-generated.css` (puede quedar vacío si aún no hay parser para tu formato; ver informe de ejecución de la feature).
