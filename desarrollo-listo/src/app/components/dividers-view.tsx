import { useState, useMemo } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import { resolveJsonBorderColor } from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./dividers.module.css";

type DividerVariant = "full-width" | "inset" | "middle-inset";
type PreviewWidth = "320" | "480" | "100%";

const VARIANT_LABELS: Record<DividerVariant, string> = {
  "full-width": "Full-width",
  inset: "Inset",
  "middle-inset": "Middle inset",
};

const VARIANT_DESCRIPTIONS: Record<DividerVariant, string> = {
  "full-width":
    "Separa secciones amplias de contenido no relacionado (ancho completo del contenedor).",
  inset:
    "Separa contenido relacionado dentro de una sección (margen izquierdo 16px).",
  "middle-inset":
    "Separa contenido relacionado con márgenes laterales (16px izq. y der.).",
};

const PREVIEW_WIDTH_OPTIONS: { value: PreviewWidth; label: string }[] = [
  { value: "320", label: "320px (Figma)" },
  { value: "480", label: "480px" },
  { value: "100%", label: "100%" },
];

const ALL_VARIANTS: DividerVariant[] = [
  "full-width",
  "inset",
  "middle-inset",
];

function dividerCssVars(opts: {
  color: string;
  previewWidth: PreviewWidth;
}): React.CSSProperties {
  return {
    ["--ds-divider-color" as string]: opts.color,
    ["--ds-divider-preview-width" as string]:
      opts.previewWidth === "100%" ? "100%" : `${opts.previewWidth}px`,
  };
}

function DividerPreview({ variant }: { variant: DividerVariant }) {
  return (
    <div className={styles.host} data-variant={variant}>
      <hr className={styles.line} aria-orientation="horizontal" />
    </div>
  );
}

function StateColorCard({
  label,
  hex,
  jsonPath,
  cssVar,
}: {
  label: string;
  hex: string;
  jsonPath: string;
  cssVar: string;
}) {
  return (
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: hex }}
        title={hex}
      />
      <div className="min-w-0">
        <p className={shell.tokenTitle}>{label}</p>
        <p className={shell.tokenMeta}>
          var({cssVar}) · JSON {jsonPath}
        </p>
        <p className={shell.tokenHex}>{hex}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={shell.specRow}>
      <span className={shell.specLabel}>{label}</span>
      <span className={shell.specValue}>{value}</span>
    </div>
  );
}

function buildDividerSnippet(opts: {
  variant: DividerVariant;
  previewWidth: PreviewWidth;
  color: string;
}): { html: string; css: string } {
  const { variant, previewWidth, color } = opts;
  const widthDecl =
    previewWidth === "100%" ? "100%" : `${previewWidth}px`;

  const html = `<div class="ds-divider-host" data-variant="${variant}" style="--ds-divider-color: ${color}; max-width: ${widthDecl}">
  <hr class="ds-divider" aria-orientation="horizontal" />
</div>`;

  const css = `/* Divider — Figma 3031:40774 · Border color.border-primary */
.ds-divider-host {
  --ds-divider-color: var(--ds-input-border);
  --ds-divider-inset: 16px;
  --ds-divider-thickness: 1px;
  width: 100%;
  box-sizing: border-box;
}

.ds-divider-host[data-variant="inset"] {
  padding-left: var(--ds-divider-inset);
}

.ds-divider-host[data-variant="middle-inset"] {
  padding-left: var(--ds-divider-inset);
  padding-right: var(--ds-divider-inset);
}

.ds-divider {
  display: block;
  width: 100%;
  height: 0;
  margin: 0;
  border: none;
  border-top: var(--ds-divider-thickness) solid var(--ds-divider-color);
}`;

  return { html, css };
}

export function DividersView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [variant, setVariant] = useState<DividerVariant>("middle-inset");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("320");
  const [showGallery, setShowGallery] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const borderHex = useMemo(
    () => resolveJsonBorderColor("border-primary", mode),
    [mode],
  );

  const previewStyle = useMemo(
    () => dividerCssVars({ color: borderHex, previewWidth }),
    [borderHex, previewWidth],
  );

  const codeSnippet = useMemo(
    () =>
      buildDividerSnippet({
        variant,
        previewWidth,
        color: borderHex,
      }),
    [variant, previewWidth, borderHex],
  );

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Separadores horizontales del sistema de diseño (Figma 3031:40774).
          Color vía{" "}
          <code className="font-mono text-[length:inherit]">
            var(--ds-divider-color)
          </code>{" "}
          →{" "}
          <code className="font-mono text-[length:inherit]">
            var(--ds-input-border)
          </code>
          .
        </p>

        <div className="mb-4">
          <div
            className={`${shell.previewCard} ${showGallery ? styles.previewCardGallery : "overflow-visible"}`}
          >
            <div className={shell.previewDivider} />
            <div className={shell.previewToolbar}>
              <h2 className={shell.previewTitle}>Preview</h2>
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className={shell.codeButton}
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div
              className={
                showGallery
                  ? `${shell.previewStage} ${styles.previewStageGallery}`
                  : shell.previewStage
              }
            >
              {showGallery ? (
                <div className={styles.gallery} style={previewStyle}>
                  {ALL_VARIANTS.map((v) => (
                    <div key={v} className={styles.galleryItem}>
                      <span className={styles.galleryLabel}>
                        {VARIANT_LABELS[v]}
                      </span>
                      <DividerPreview variant={v} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.previewWrap} style={previewStyle}>
                  <DividerPreview variant={variant} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Layout</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Thickness"
                value="var(--ds-divider-thickness)"
              />
              <SpecRow
                label="Inset (inset / middle)"
                value="var(--ds-divider-inset)"
              />
              <SpecRow
                label="Preview width"
                value={
                  previewWidth === "100%"
                    ? "100%"
                    : `var(--ds-divider-preview-width)`
                }
              />
              <SpecRow label="Variant" value={VARIANT_LABELS[variant]} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Color</h3>
            <div className={shell.specDivider}>
              <StateColorCard
                label="Stroke"
                hex={borderHex}
                jsonPath="Border color.border-primary"
                cssVar="--ds-input-border"
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Usage</h3>
            <p className="text-sm text-[var(--ds-color-text-muted)] leading-relaxed">
              {VARIANT_DESCRIPTIONS[variant]}
            </p>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>All variants</h3>
            <div className={styles.gallery} style={previewStyle}>
              {ALL_VARIANTS.map((v) => (
                <div key={v} className={styles.galleryItem}>
                  <span className={styles.galleryLabel}>
                    {VARIANT_LABELS[v]}
                  </span>
                  <DividerPreview variant={v} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>
              Configure divider variant and preview
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Variant"
            value={variant}
            options={[
              { value: "full-width", label: "Full" },
              { value: "inset", label: "Inset" },
              { value: "middle-inset", label: "Middle" },
            ]}
            onChange={setVariant}
          />

          <ControlSelect
            label="Preview width"
            value={previewWidth}
            options={PREVIEW_WIDTH_OPTIONS}
            onChange={setPreviewWidth}
          />

          <SegmentedControl
            label="Preview mode"
            value={showGallery ? "gallery" : "single"}
            options={[
              { value: "single", label: "Single" },
              { value: "gallery", label: "All" },
            ]}
            onChange={(v) => setShowGallery(v === "gallery")}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Variant</span>
                <span className={shell.configVal}>
                  {VARIANT_LABELS[variant]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Width</span>
                <span className={shell.configValMono}>
                  {previewWidth === "100%" ? "100%" : `${previewWidth}px`}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Stroke</span>
                <span className={shell.configValMono}>1px</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Token</span>
                <span className={shell.configValMono}>border-primary</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Divider — ${VARIANT_LABELS[variant]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
