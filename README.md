# Desing system tool

Code bundle for the design system tool. Figma: https://www.figma.com/design/FePCG3isiropCJiBqHK5aq/Desing-system-tool.

## Documentation (SDD)

Product and engineering conventions live in **`Spec/`**; Cursor agent prompts in **`Agents/`**. Start with **`Spec/proyect.md`** (includes repository folder map §5).

## Código de la app

- **Design tool (React + Vite):** **`desarrollo-listo/`** — ver `desarrollo-listo/README.md` y **`Spec/proyect.md`** §5.

## Running the code

Run `npm i` to install dependencies.

Run `npm run dev` to start the Vite dev server (lee `vite.config.ts` en la raíz).

Otros scripts útiles: `npm run test` (Vitest), `npm run flags:ingest` (requiere datos en `desarrollo-listo/public/flags-temp/` — ver `Spec/proyect.md` §5.3). Variables opcionales: **`.env.example`**.
  