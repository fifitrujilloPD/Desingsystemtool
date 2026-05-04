import { useMemo } from "react";
import {
  EXTENSION_FILE_TYPES,
  GENERIC_FILE_TYPES,
  GENERIC_FILE_ICON,
  EXTENSION_BRAND_HEX,
  FILE_VARIANT_LABEL,
  getFileIconEntries,
  type FileIconEntry,
  type FileIconSize,
  type FileIconVariant,
} from "../data/file-icons-catalog";

/**
 * Render del set de file icons del frame Figma `node-id=974:291724`.
 *
 * Dibujamos cada icono como composición SVG nativa (viewBox 0 0 32 32)
 * para mantener nitidez en cualquier tamaño y permitir descarga directa.
 * - Papel base + esquina doblada: SVG inline.
 * - Variante "solid": fondo brand + extensión en blanco.
 * - Variante "outlineColor": papel blanco + tag inferior brand.
 * - Variante "iconOutline": papel blanco + glifo Material Symbols Rounded
 *   superpuesto en HTML (la captura SVG hace fallback a `<text>` con la fuente).
 *
 * Variables del DS (todas existentes en `ds-tokens.css`):
 * - papel y fondos      → `var(--ds-color-surface-elevated)`.
 * - bordes neutros      → `var(--ds-color-border-default)`.
 * - texto secundario    → `var(--ds-color-text-secondary)`.
 *
 * Los hex por extensión viven en `data/file-icons-catalog.ts` como
 * **asset brand** (no son tokens semánticos).
 */

interface FileIconBaseProps {
  variant: FileIconVariant;
  fileType: string;
  brandHex?: string;
  glyph?: string;
  /** Tamaño en px del recuadro renderizado (cuadrado). */
  size: number;
}

const VIEWBOX = 32;

export function FileIcon({
  variant,
  fileType,
  brandHex,
  glyph,
  size,
}: FileIconBaseProps) {
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    position: "relative",
  };

  return (
    <div style={containerStyle} aria-hidden>
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        width={size}
        height={size}
        style={{ display: "block" }}
      >
        {variant === "solid" && (
          <SolidPaper
            extension={fileType}
            brandHex={brandHex ?? "#000000"}
          />
        )}
        {variant === "outlineColor" && (
          <OutlineColorPaper
            extension={fileType}
            brandHex={brandHex ?? "#000000"}
          />
        )}
        {variant === "iconOutline" && <OutlinePaper />}
      </svg>

      {variant === "iconOutline" && glyph && (
        <span
          className="material-symbols-rounded"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, calc(-50% + 8%))",
            fontSize: `${Math.round(size * 0.4)}px`,
            lineHeight: 1,
            color: "var(--ds-color-text-secondary)",
            fontVariationSettings:
              "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
            pointerEvents: "none",
          }}
        >
          {glyph}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG primitives
// ---------------------------------------------------------------------------

/**
 * Geometría base del papel:
 * - margen lateral 10% (= 3.2px) → ancho del papel = 25.6.
 * - esquina doblada arriba-derecha (12.8 × 9.6).
 */
const PAPER_PATH = `M 3.2 0
  L 19.2 0
  L 28.8 9.6
  L 28.8 32
  L 3.2 32 Z`;
const FOLD_PATH = `M 19.2 0
  L 28.8 9.6
  L 19.2 9.6 Z`;

/**
 * Tag inferior de la variante "Outline + Color" — proporciones exactas del
 * frame Figma `974:291724`: `left-[0.8px] top-[15.2px] px-[3.2px] py-[1.6px]
 * rounded-[2.4px]` con `text-[7.2px] font-bold text-white`. El ancho es
 * `content-stretch` en Figma; aquí lo aproximamos a partir del texto.
 */
const TAG_X = 0.8;
const TAG_Y = 15.2;
const TAG_PADDING_X = 3.2;
const TAG_PADDING_Y = 1.6;
const TAG_FONT_SIZE = 7.2;
const TAG_HEIGHT = TAG_FONT_SIZE + TAG_PADDING_Y * 2;
const TAG_RADIUS = 2.4;
/** Ratio promedio de ancho de glifo Inter Bold respecto al font-size. */
const INTER_BOLD_GLYPH_RATIO = 0.62;

function tagDimensions(label: string) {
  const textWidth = label.length * TAG_FONT_SIZE * INTER_BOLD_GLYPH_RATIO;
  const width = textWidth + TAG_PADDING_X * 2;
  return {
    width,
    height: TAG_HEIGHT,
    centerX: TAG_X + width / 2,
    centerY: TAG_Y + TAG_HEIGHT / 2,
  };
}

function SolidPaper({
  extension,
  brandHex,
}: {
  extension: string;
  brandHex: string;
}) {
  return (
    <g>
      <path d={PAPER_PATH} fill={brandHex} />
      <path d={FOLD_PATH} fill="rgba(255,255,255,0.45)" />
      <text
        x={16}
        y={26}
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7.2}
        fontWeight={700}
        fill="#ffffff"
      >
        {extension}
      </text>
    </g>
  );
}

function OutlinePaper() {
  return (
    <g>
      <path
        d={PAPER_PATH}
        fill="var(--ds-color-surface-elevated)"
        stroke="var(--ds-color-border-default)"
        strokeWidth={1}
      />
      <path
        d={FOLD_PATH}
        fill="none"
        stroke="var(--ds-color-border-default)"
        strokeWidth={1}
      />
    </g>
  );
}

function OutlineColorPaper({
  extension,
  brandHex,
}: {
  extension: string;
  brandHex: string;
}) {
  const tag = tagDimensions(extension);
  return (
    <g>
      <OutlinePaper />
      <rect
        x={TAG_X}
        y={TAG_Y}
        width={tag.width}
        height={tag.height}
        rx={TAG_RADIUS}
        fill={brandHex}
      />
      <text
        x={tag.centerX}
        y={tag.centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={TAG_FONT_SIZE}
        fontWeight={700}
        fill="#ffffff"
      >
        {extension}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Grid + section helpers
// ---------------------------------------------------------------------------

interface FileIconsTabProps {
  size: FileIconSize;
  selected: FileIconEntry | null;
  onSelect: (entry: FileIconEntry | null) => void;
}

export function FileIconsTab({ size, selected, onSelect }: FileIconsTabProps) {
  const entries = useMemo(() => getFileIconEntries(), []);

  const groups: Array<{ variant: FileIconVariant; rows: FileIconEntry[] }> =
    useMemo(
      () => [
        {
          variant: "solid",
          rows: entries.filter((e) => e.variant === "solid"),
        },
        {
          variant: "outlineColor",
          rows: entries.filter((e) => e.variant === "outlineColor"),
        },
        {
          variant: "iconOutline",
          rows: entries.filter((e) => e.variant === "iconOutline"),
        },
      ],
      [entries],
    );

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.variant} className="space-y-3">
          <header className="flex items-baseline gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {FILE_VARIANT_LABEL[group.variant]}
            </h3>
            <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
              {group.rows.length} files · brand asset
            </span>
          </header>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
            {group.rows.map((entry) => {
              const isSelected = selected?.id === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect(isSelected ? null : entry)}
                  className={`group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  title={`${entry.label} · ${FILE_VARIANT_LABEL[entry.variant]} · ${size}px`}
                >
                  <div className="relative w-full flex items-center justify-center h-12">
                    <FileIcon
                      variant={entry.variant}
                      fileType={entry.fileType}
                      brandHex={entry.brandHex}
                      glyph={entry.glyph}
                      size={size + 8}
                    />
                  </div>
                  <span className="text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate max-w-full text-center leading-tight transition-colors text-[10px]">
                    {entry.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG export (used by IconsView "Download SVG" button)
// ---------------------------------------------------------------------------

/**
 * Genera un SVG **autocontenido** de un file icon — sin variables CSS,
 * para que el archivo descargado se vea idéntico fuera de la app.
 */
export function buildFileIconSvg(entry: FileIconEntry, size: number): string {
  const fold = FOLD_PATH.replace(/\s+/g, " ").trim();
  const paper = PAPER_PATH.replace(/\s+/g, " ").trim();

  if (entry.variant === "solid" && entry.brandHex) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <path d="${paper}" fill="${entry.brandHex}"/>
  <path d="${fold}" fill="rgba(255,255,255,0.45)"/>
  <text x="16" y="26" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="7.2" font-weight="700" fill="#ffffff">${entry.label}</text>
</svg>`;
  }

  if (entry.variant === "outlineColor" && entry.brandHex) {
    const tag = tagDimensions(entry.label);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <path d="${paper}" fill="#ffffff" stroke="#d0d5dd" stroke-width="1"/>
  <path d="${fold}" fill="none" stroke="#d0d5dd" stroke-width="1"/>
  <rect x="${TAG_X}" y="${TAG_Y}" width="${tag.width.toFixed(2)}" height="${TAG_HEIGHT}" rx="${TAG_RADIUS}" fill="${entry.brandHex}"/>
  <text x="${tag.centerX.toFixed(2)}" y="${tag.centerY.toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-size="${TAG_FONT_SIZE}" font-weight="700" fill="#ffffff">${entry.label}</text>
</svg>`;
  }

  // iconOutline: papel + texto Material Symbols Rounded como glifo
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <path d="${paper}" fill="#ffffff" stroke="#d0d5dd" stroke-width="1"/>
  <path d="${fold}" fill="none" stroke="#d0d5dd" stroke-width="1"/>
  <text x="16" y="22" text-anchor="middle" font-family="Material Symbols Rounded, system-ui, sans-serif" font-size="14" fill="#525252">${entry.glyph ?? ""}</text>
  <!-- Glyph "${entry.glyph ?? ""}" requires 'Material Symbols Rounded' font installed locally to render correctly. -->
</svg>`;
}

/**
 * Snippet HTML/CSS para el `CodeModal` cuando se pulsa “Ver código / variable”.
 */
export function buildFileIconSnippet(entry: FileIconEntry) {
  const variantClass = `file-icon--${entry.variant}`;
  const html = `<span class="file-icon ${variantClass}" data-extension="${entry.label}">
  ${entry.glyph ? `<span class="material-symbols-rounded">${entry.glyph}</span>` : ""}
</span>`;

  if (entry.variant === "iconOutline") {
    return {
      html,
      css: `/* Generic file (Icon + Outline): papel del DS + glifo Material Symbols Rounded */
.file-icon--iconOutline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--ds-color-surface-elevated);
  border: 1px solid var(--ds-color-border-default);
  border-radius: 2px;
  color: var(--ds-color-text-secondary);
}
.file-icon--iconOutline .material-symbols-rounded {
  font-size: 14px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}`,
    };
  }

  // solid / outlineColor — el color brand vive en el catálogo TS, no aquí
  return {
    html,
    css: `/* File icon "${entry.label}" — variant: ${FILE_VARIANT_LABEL[entry.variant]}.
   Color brand referenciado desde EXTENSION_BRAND_HEX["${entry.label}"]
   en \`desarrollo-listo/src/app/data/file-icons-catalog.ts\`
   (asset brand del DS, no token semántico). */
.file-icon--${entry.variant} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
.file-icon--${entry.variant}[data-extension="${entry.label}"] {
  /* Brand asset: ${entry.brandHex} */
}`,
  };
}

// re-export for IconsView
export { EXTENSION_FILE_TYPES, GENERIC_FILE_TYPES, GENERIC_FILE_ICON, EXTENSION_BRAND_HEX };
