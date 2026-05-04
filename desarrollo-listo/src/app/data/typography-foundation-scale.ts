/**
 * Foundations typography — metadatos del catálogo (Feature 03 / task_01).
 * Los valores numéricos de tamaño y altura de línea deben coincidir con
 * `desarrollo-listo/src/styles/ds-tokens.css` (--ds-typography-*).
 */

export type TypographyFoundationCategory = "HEADING" | "BODY";

export interface TypographyFoundationStyle {
  id: string;
  label: string;
  category: TypographyFoundationCategory;
  /** Token CSS (ds-tokens.css) */
  fontSizeVar: string;
  lineHeightVar: string;
  sampleText: string;
  /** Solo para tabla de specs (px); espejo de la variable CSS homónima */
  sizePx: number;
  lineHeightPx: number;
}

export const TYPOGRAPHY_FOUNDATION_STYLES: TypographyFoundationStyle[] = [
  { id: "h1", label: "H1", category: "HEADING", fontSizeVar: "--ds-typography-h1-font-size", lineHeightVar: "--ds-typography-h1-line-height", sizePx: 64, lineHeightPx: 72, sampleText: "Heading 1" },
  { id: "h2", label: "H2", category: "HEADING", fontSizeVar: "--ds-typography-h2-font-size", lineHeightVar: "--ds-typography-h2-line-height", sizePx: 48, lineHeightPx: 56, sampleText: "Heading 2" },
  { id: "h3", label: "H3", category: "HEADING", fontSizeVar: "--ds-typography-h3-font-size", lineHeightVar: "--ds-typography-h3-line-height", sizePx: 36, lineHeightPx: 44, sampleText: "Heading 3" },
  { id: "h4", label: "H4", category: "HEADING", fontSizeVar: "--ds-typography-h4-font-size", lineHeightVar: "--ds-typography-h4-line-height", sizePx: 30, lineHeightPx: 38, sampleText: "Heading 4" },
  { id: "h5", label: "H5", category: "HEADING", fontSizeVar: "--ds-typography-h5-font-size", lineHeightVar: "--ds-typography-h5-line-height", sizePx: 24, lineHeightPx: 32, sampleText: "Heading 5" },
  { id: "h6", label: "H6", category: "HEADING", fontSizeVar: "--ds-typography-h6-font-size", lineHeightVar: "--ds-typography-h6-line-height", sizePx: 20, lineHeightPx: 28, sampleText: "Heading 6" },
  { id: "body-xl", label: "Body XL", category: "BODY", fontSizeVar: "--ds-typography-body-xl-font-size", lineHeightVar: "--ds-typography-body-xl-line-height", sizePx: 20, lineHeightPx: 30, sampleText: "Body extra large text for emphasis and introductions." },
  { id: "body-lg", label: "Body LG", category: "BODY", fontSizeVar: "--ds-typography-body-lg-font-size", lineHeightVar: "--ds-typography-body-lg-line-height", sizePx: 18, lineHeightPx: 28, sampleText: "Body large text used for lead paragraphs." },
  { id: "body-md", label: "Body MD", category: "BODY", fontSizeVar: "--ds-typography-body-md-font-size", lineHeightVar: "--ds-typography-body-md-line-height", sizePx: 16, lineHeightPx: 24, sampleText: "Body medium is the default paragraph style." },
  { id: "body-sm", label: "Body SM", category: "BODY", fontSizeVar: "--ds-typography-body-sm-font-size", lineHeightVar: "--ds-typography-body-sm-line-height", sizePx: 14, lineHeightPx: 20, sampleText: "Body small for secondary content and descriptions." },
  { id: "body-xs", label: "Body XS", category: "BODY", fontSizeVar: "--ds-typography-body-xs-font-size", lineHeightVar: "--ds-typography-body-xs-line-height", sizePx: 12, lineHeightPx: 18, sampleText: "Caption and helper text at the smallest readable size." },
];
