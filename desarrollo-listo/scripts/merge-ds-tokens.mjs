/**
 * Genera CSS desde insumos JSON (Feature 02). Hoy: stub si no hay JSON.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const INSUMOS = path.join(
  REPO_ROOT,
  "Features/feature-02-variables-core-utp/insumos",
);
const OUT_FILE = path.join(
  REPO_ROOT,
  "desarrollo-listo/src/styles/generated/ds-tokens-generated.css",
);

const HEADER = `/**
 * Generado por npm run tokens:ds
 * Fuente: Features/feature-02-variables-core-utp/insumos/
 * No editar a mano.
 */

`;

function listJson() {
  if (!fs.existsSync(INSUMOS)) return [];
  return fs
    .readdirSync(INSUMOS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(INSUMOS, f));
}

const jsonFiles = listJson();
let body = "";

if (jsonFiles.length === 0) {
  body =
    "/* Sin archivos *.json en insumos/ todavía. Colocar colors/spacing/borders/typography y ampliar este script. */\n";
} else {
  body = `/* JSON detectados: ${jsonFiles.map((p) => path.basename(p)).join(", ")} — parser de tokens pendiente de acordar formato Figma export. */\n`;
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, HEADER + body, "utf8");
console.log(
  jsonFiles.length
    ? `[tokens:ds] Escrito ${OUT_FILE} (${jsonFiles.length} JSON en insumos/).`
    : `[tokens:ds] Sin JSON en insumos/. Escrito stub en ${OUT_FILE}.`,
);
