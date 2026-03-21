/**
 * Ingesta SVG exportados desde Figma (Name=Country, Special_=Yes|No.svg)
 * → public/flags/{slug}.svg + src/app/data/flag-assets.generated.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import countries from "i18n-iso-countries";

const require = createRequire(import.meta.url);
const en = require("i18n-iso-countries/langs/en.json");
countries.registerLocale(en);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const NAME_TO_ISO = {
  "Korea (North)": "kp",
  "Korea (South)": "kr",
  "Congo (Democratic Repulic)": "cd",
  "Congo (Democratic Republic)": "cd",
  Palestin: "ps",
  "Russian Federation": "ru",
  "United States of America": "us",
  "United Kingdom of Great Britain and Northern Ireland": "gb",
  "Viet Nam": "vn",
  Czechia: "cz",
  "Micronesia (Federated States of)": "fm",
  "Bolivia (Plurinational State of)": "bo",
  "Venezuela (Bolivarian Republic of)": "ve",
  "Iran (Islamic Republic of)": "ir",
  "Lao People's Democratic Republic": "la",
  "Syrian Arab Republic": "sy",
  Taiwan: "tw",
  "Holy See": "va",
  "Timor-Leste": "tl",
  "Brunei Darussalam": "bn",
  "Côte d'Ivoire": "ci",
  "Northern Cyprus": "xc",
  "European Union": "eu",
  "United Nations": "un",
  "Somaliland": "xl",
  "Unknown": "zz",
  "Easter Island": "cl",
  "Kosovo": "xk",
  Moldova: "md",
  Bonaire: "bq",
  "Cabo Verde": "cv",
  Réunion: "re",
  Transnistria: "md",
  "Virgin Islands (British)": "vg",
  "Virgin Islands (U.S.)": "vi",
};

function normalizeKey(str) {
  return str.normalize("NFC").toLowerCase().trim();
}

/** Manual: i18n English name → slug (when Figma name differs or ISO is duplicated). */
const MANUAL_NAME_TO_SLUG = {
  "moldova, republic of": "moldova",
  "cape verde": "cabo-verde",
};

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveIso(figmaNameNfc) {
  const direct = NAME_TO_ISO[figmaNameNfc];
  if (direct) return direct.toLowerCase();
  const c = countries.getAlpha2Code(figmaNameNfc, "en");
  return c ? c.toLowerCase() : null;
}

const srcDir = path.join(ROOT, "public/flags-temp");
const outDir = path.join(ROOT, "public/flags");

if (!fs.existsSync(srcDir)) {
  console.error("Missing public/flags-temp — unzip SVGs first.");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const manifest = [];
const seenSlugs = new Set();

for (const file of fs.readdirSync(srcDir)) {
  if (!file.endsWith(".svg")) continue;
  const m = file.match(/^Name=(.+), Special_=(Yes|No)\.svg$/);
  if (!m) {
    console.warn("Skip (pattern):", file);
    continue;
  }
  const figmaName = m[1].normalize("NFC");
  const iso2 = resolveIso(figmaName);
  let slug = slugify(figmaName);
  if (seenSlugs.has(slug)) {
    slug = `${slug}-${iso2 || "dup"}`;
  }
  seenSlugs.add(slug);

  const src = path.join(srcDir, file);
  const dest = path.join(outDir, `${slug}.svg`);
  fs.copyFileSync(src, dest);

  manifest.push({
    slug,
    figmaName,
    iso2: iso2 || slug,
    special: m[2] === "Yes",
  });
}

manifest.sort((a, b) => a.figmaName.localeCompare(b.figmaName));

const outJson = path.join(ROOT, "src/app/data/flag-assets.generated.json");
fs.writeFileSync(outJson, JSON.stringify(manifest, null, 2), "utf8");

/** Map normalized display name → slug (Figma labels + i18n official names where ISO is unique). */
const isoDup = {};
for (const row of manifest) {
  const iso = String(row.iso2);
  if (iso.length === 2) isoDup[iso] = (isoDup[iso] || 0) + 1;
}

const lookup = {};
for (const row of manifest) {
  lookup[normalizeKey(row.figmaName)] = row.slug;
}
for (const row of manifest) {
  const iso = String(row.iso2);
  if (iso.length !== 2) continue;
  if (isoDup[iso] > 1) continue;
  const official = countries.getName(iso.toUpperCase(), "en");
  if (official) {
    const k = normalizeKey(official);
    if (!lookup[k]) lookup[k] = row.slug;
  }
}
Object.assign(lookup, MANUAL_NAME_TO_SLUG);

const outLookup = path.join(ROOT, "src/app/data/flag-asset-lookup.generated.json");
fs.writeFileSync(outLookup, JSON.stringify(lookup, null, 2), "utf8");

console.log(`Wrote ${manifest.length} files to public/flags/`);
console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outLookup} (${Object.keys(lookup).length} keys)`);
