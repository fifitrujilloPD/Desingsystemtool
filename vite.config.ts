import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Código de la app, assets y scripts de automatización (ver `Spec/proyect.md` §5). */
const APP_ROOT = path.resolve(__dirname, "desarrollo-listo");

export default defineConfig({
  root: APP_ROOT,
  publicDir: "public",
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.join(APP_ROOT, "src"),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ["**/*.svg", "**/*.csv"],

  build: {
    // Salida en la raíz del repo (despliegues y CI suelen esperar `./dist` junto a `package.json`)
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      VITE_API_BASE_URL: "https://api.test.local",
    },
  },
});
