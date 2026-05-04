# Desarrollo listo

Aquí vive el **código ejecutable** de la herramienta de design system: la app **Vite + React**, los assets estáticos y los scripts de automatización.

| Contenido | Descripción |
|-----------|-------------|
| **`src/`** | Aplicación: rutas, vistas, componentes UI, capa HTTP en **`src/app/lib/api/`**, tokens importados, estilos. |
| **`public/`** | Archivos estáticos servidos tal cual (p. ej. banderas SVG tras la ingesta). |
| **`scripts/`** | Scripts Node (p. ej. `ingest-figma-flags.mjs`). |
| **`index.html`** | Punto de entrada de Vite. |

En la **raíz del repositorio** siguen `package.json`, `vite.config.ts`, `node_modules/` (dependencias de `npm i`) y `dist/` (salida de `npm run build`), por convención de npm y despliegue. Tests unitarios: **`npm run test`** (Vitest; ver **`Spec/api.md`**).

Documentación de producto y proceso: carpetas **`Spec/`** y **`Agents/`** en la raíz.
