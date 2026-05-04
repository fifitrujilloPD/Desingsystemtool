/**
 * Foundations / Icons → File (Feature 03 / task_07).
 * Catálogo derivado del frame Figma `node-id=974:291724` consultado vía MCP
 * `user-Figma Desktop` el 2026-05-04 (Design system / Icons File).
 *
 * Tres variantes:
 * - "solid"        → bandera con color brand horneado y extensión en blanco.
 * - "outlineColor" → papel outline gris + tag inferior con color brand y extensión blanca.
 * - "iconOutline"  → papel outline gris + glifo monocromo (Material Symbols Rounded).
 *
 * **Sobre los hex en este archivo**
 * El frame Figma `974:291724` no expone los colores por extensión como
 * variables semánticas: el MCP `get_variable_defs` solo devolvió `Layout/*`
 * y `Neutral/300`. Por eso los hex aquí abajo se tratan como
 * **asset brand del set de file icons**, no como tokens semánticos del DS:
 * viven aislados en este archivo y NO se referencian crudos en JSX/CSS.
 * Si más adelante el sistema define tokens `--ds-color-file-{ext}`,
 * sustituir las constantes y eliminar el hex.
 */

export const FILE_ICON_SIZES = [16, 20, 24, 32, 40] as const;
export type FileIconSize = (typeof FILE_ICON_SIZES)[number];

export type FileIconVariant = "solid" | "outlineColor" | "iconOutline";

export type ExtensionFileType =
  | "PDF"
  | "DOC"
  | "DOCX"
  | "TXT"
  | "CSV"
  | "XLS"
  | "XLSX"
  | "PPT"
  | "PPTX"
  | "FIG"
  | "AI"
  | "PSD"
  | "INDD"
  | "AEP"
  | "MP3"
  | "WAV"
  | "MP4"
  | "MPEG"
  | "AVI"
  | "MKV"
  | "ZIP"
  | "RAR"
  | "IMG"
  | "JPG"
  | "PNG"
  | "SVG";

export type GenericFileType =
  | "Folder"
  | "Image"
  | "Code"
  | "Video"
  | "Video 2"
  | "Audio"
  | "PDF"
  | "Documents"
  | "Excel";

export type FileType = ExtensionFileType | GenericFileType;

/**
 * Brand colors por extensión, leídos del frame Figma `974:291724`
 * (variant `Outline + Color`, atributo `bg-[#…]` de cada tag).
 *
 * Las extensiones que usan el mismo color comparten constante para mantener
 * una única fuente.
 */
const BRAND_RED = "#d92d20";
const BRAND_BLUE = "#155eef";
const BRAND_GREY = "#343a3e";
const BRAND_GREEN = "#079455";
const BRAND_ORANGE_RED = "#e62e05";
const BRAND_PURPLE = "#7f56d9";
const BRAND_ORANGE = "#e04f16";
const BRAND_FUCHSIA = "#ba24d5";
const BRAND_VIOLET = "#6938ef";
const BRAND_PINK = "#dd2590";
const BRAND_DARK = "#414651";

export const EXTENSION_BRAND_HEX: Record<ExtensionFileType, string> = {
  PDF: BRAND_RED,
  DOC: BRAND_BLUE,
  DOCX: BRAND_BLUE,
  TXT: BRAND_GREY,
  CSV: BRAND_GREEN,
  XLS: BRAND_GREEN,
  XLSX: BRAND_GREEN,
  PPT: BRAND_ORANGE_RED,
  PPTX: BRAND_ORANGE_RED,
  FIG: BRAND_PURPLE,
  AI: BRAND_ORANGE,
  PSD: BRAND_BLUE,
  INDD: BRAND_FUCHSIA,
  AEP: BRAND_VIOLET,
  MP3: BRAND_PINK,
  WAV: BRAND_PINK,
  MP4: BRAND_BLUE,
  MPEG: BRAND_BLUE,
  AVI: BRAND_BLUE,
  MKV: BRAND_BLUE,
  ZIP: BRAND_DARK,
  RAR: BRAND_DARK,
  IMG: BRAND_PURPLE,
  JPG: BRAND_PURPLE,
  PNG: BRAND_PURPLE,
  SVG: BRAND_PURPLE,
};

/** Glifos Material Symbols Rounded asociados a cada genérico (Icon + Outline). */
export const GENERIC_FILE_ICON: Record<GenericFileType, string> = {
  Folder: "folder",
  Image: "image",
  Code: "code",
  Video: "videocam",
  "Video 2": "movie",
  Audio: "music_note",
  PDF: "picture_as_pdf",
  Documents: "description",
  Excel: "table_chart",
};

export const EXTENSION_FILE_TYPES: ExtensionFileType[] = [
  "PDF",
  "DOC",
  "DOCX",
  "TXT",
  "CSV",
  "XLS",
  "XLSX",
  "PPT",
  "PPTX",
  "FIG",
  "AI",
  "PSD",
  "INDD",
  "AEP",
  "MP3",
  "WAV",
  "MP4",
  "MPEG",
  "AVI",
  "MKV",
  "ZIP",
  "RAR",
  "IMG",
  "JPG",
  "PNG",
  "SVG",
];

export const GENERIC_FILE_TYPES: GenericFileType[] = [
  "Folder",
  "Image",
  "Code",
  "Video",
  "Video 2",
  "Audio",
  "PDF",
  "Documents",
  "Excel",
];

export interface FileIconEntry {
  /** Identificador estable: `${variant}:${fileType}` (sirve como React key). */
  id: string;
  variant: FileIconVariant;
  fileType: FileType;
  /** Etiqueta visible debajo del preview. */
  label: string;
  /** Hex del brand del DS (asset brand) sólo para Solid / Outline + Color. */
  brandHex?: string;
  /** Glifo Material Symbols Rounded (sólo para Icon + Outline). */
  glyph?: string;
}

export function getFileIconEntries(): FileIconEntry[] {
  const entries: FileIconEntry[] = [];

  for (const ext of EXTENSION_FILE_TYPES) {
    entries.push({
      id: `solid:${ext}`,
      variant: "solid",
      fileType: ext,
      label: ext,
      brandHex: EXTENSION_BRAND_HEX[ext],
    });
  }

  for (const ext of EXTENSION_FILE_TYPES) {
    entries.push({
      id: `outlineColor:${ext}`,
      variant: "outlineColor",
      fileType: ext,
      label: ext,
      brandHex: EXTENSION_BRAND_HEX[ext],
    });
  }

  for (const generic of GENERIC_FILE_TYPES) {
    entries.push({
      id: `iconOutline:${generic}`,
      variant: "iconOutline",
      fileType: generic,
      label: generic,
      glyph: GENERIC_FILE_ICON[generic],
    });
  }

  return entries;
}

export const FILE_VARIANT_LABEL: Record<FileIconVariant, string> = {
  solid: "Solid",
  outlineColor: "Outline + Color",
  iconOutline: "Icon + Outline",
};
