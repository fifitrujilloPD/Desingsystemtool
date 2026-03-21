/**
 * Banderas país / especiales alineadas al frame Figma "Country" (node 75-2860).
 * Assets locales en /flags/*.svg (export Figma); fallback a flagcdn PNG si no hay mapeo.
 */
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import flagAssetLookup from "./flag-asset-lookup.generated.json";

countries.registerLocale(en);

export type FlagIconEntry = {
  id: string;
  name: string;
  iso2: string;
};

const LOOKUP = flagAssetLookup as Record<string, string>;

function normalizeKey(s: string): string {
  return s.normalize("NFC").toLowerCase().trim();
}

/** Entradas adicionales no cubiertas por el set ISO estándar en i18n (especiales Figma). */
const EXTRA_FLAGS: FlagIconEntry[] = [
  { id: "special-eu", name: "European Union", iso2: "eu" },
  { id: "special-un", name: "United Nations", iso2: "un" },
  { id: "special-xk", name: "Kosovo", iso2: "xk" },
  { id: "special-nc", name: "Northern Cyprus", iso2: "xc" },
  { id: "special-sm", name: "Somaliland", iso2: "xl" },
  { id: "special-ei", name: "Easter Island", iso2: "cl" },
  { id: "special-bq", name: "Bonaire", iso2: "bq" },
  { id: "special-tr", name: "Transnistria", iso2: "md" },
  { id: "special-nato", name: "Nato", iso2: "xx" },
  { id: "special-unk", name: "Unknown", iso2: "zz" },
];

/** Lista ordenada: todos los países ISO + extras Figma (deduplicado por id). */
export function getFlagIconEntries(): FlagIconEntry[] {
  const codes = Object.keys(countries.getAlpha2Codes());
  const fromIso: FlagIconEntry[] = codes.map((code) => ({
    id: `iso-${code}`,
    name: countries.getName(code, "en") || code,
    iso2: code.toLowerCase(),
  }));

  const seenIds = new Set(fromIso.map((e) => e.id));
  const merged = [...fromIso];

  for (const ex of EXTRA_FLAGS) {
    if (!seenIds.has(ex.id)) {
      merged.push(ex);
      seenIds.add(ex.id);
    }
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

/** URL del SVG local si existe en el lookup; si no, PNG flagcdn. */
export function getFlagIconUrl(entry: FlagIconEntry, widthPxForCdnFallback = 64): string {
  const slug = LOOKUP[normalizeKey(entry.name)];
  if (slug) return `/flags/${slug}.svg`;
  return getFlagCdnUrl(entry.iso2, widthPxForCdnFallback);
}

/** URL PNG flagcdn (ancho en px, ratio ~4:3). Fallback cuando no hay asset Figma mapeado. */
export function getFlagCdnUrl(iso2: string, widthPx: number): string {
  const w = Math.max(16, Math.min(640, Math.round(widthPx)));
  return `https://flagcdn.com/w${w}/${iso2}.png`;
}
