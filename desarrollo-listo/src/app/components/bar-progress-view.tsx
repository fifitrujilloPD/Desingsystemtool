import { useState, useMemo } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./bar-progress.module.css";

type BarProgressStyle =
  | "none"
  | "right"
  | "bottom"
  | "floating-over"
  | "floating-bottom";

type PreviewWidth = "320" | "428" | "480" | "100%";

const STYLE_LABELS: Record<BarProgressStyle, string> = {
  none: "None",
  right: "Right",
  bottom: "Bottom",
  "floating-over": "Floating over",
  "floating-bottom": "Floating bottom",
};

const ALL_STYLES: BarProgressStyle[] = [
  "none",
  "right",
  "bottom",
  "floating-over",
  "floating-bottom",
];

const PROGRESS_PRESETS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

const PREVIEW_WIDTH_OPTIONS: { value: PreviewWidth; label: string }[] = [
  { value: "320", label: "320px" },
  { value: "428", label: "428px (Figma)" },
  { value: "480", label: "480px" },
  { value: "100%", label: "100%" },
];

const COLOR_DEFS = [
  {
    label: "Track",
    cssVar: "--ds-bar-track-bg",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
  {
    label: "Fill",
    cssVar: "--ds-bar-fill-bg",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Label",
    cssVar: "--ds-bar-label-color",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Tooltip surface",
    cssVar: "--ds-bar-tooltip-bg",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
  {
    label: "Tooltip border",
    cssVar: "--ds-bar-tooltip-border",
    jsonPath: "Border color.border-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", mode),
  },
  {
    label: "Tooltip text",
    cssVar: "--ds-bar-tooltip-text",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
] as const;

function barThemeVars(opts: {
  mode: "light" | "dark";
  previewWidth: PreviewWidth;
}): React.CSSProperties {
  const { mode, previewWidth } = opts;
  return {
    ["--ds-bar-track-bg" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-bar-fill-bg" as string]: resolveJsonButtonColor("button-color", mode),
    ["--ds-bar-label-color" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-bar-tooltip-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-bar-tooltip-border" as string]: resolveJsonBorderColor(
      "border-secondary",
      mode,
    ),
    ["--ds-bar-tooltip-text" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-bar-preview-width" as string]:
      previewWidth === "100%" ? "100%" : `${previewWidth}px`,
  };
}

function BarProgressPreview({
  style,
  value,
}: {
  style: BarProgressStyle;
  value: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const label = `${clamped}%`;
  const showLabel = style === "right" || style === "bottom";
  const showTooltip =
    style === "floating-over" || style === "floating-bottom";

  return (
    <div
      className={styles.host}
      data-style={style}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress"
    >
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${clamped}%` }}
          aria-hidden={!showTooltip}
        >
          {showTooltip && clamped > 0 ? (
            <div className={styles.tooltip}>
              <div className={styles.tooltipContent}>{label}</div>
            </div>
          ) : null}
        </div>
      </div>
      {showLabel ? <span className={styles.label}>{label}</span> : null}
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

function buildBarProgressSnippet(opts: {
  style: BarProgressStyle;
  value: number;
  trackHex: string;
  fillHex: string;
}): { html: string; css: string } {
  const { style, value, trackHex, fillHex } = opts;
  const clamped = Math.min(100, Math.max(0, value));
  const label = `${clamped}%`;

  const css = `/* Bar progress — Figma 977:298525 */
.ds-bar-progress {
  --ds-bar-height: 8px;
  --ds-bar-radius: 9999px;
  --ds-bar-track-bg: ${trackHex};
  --ds-bar-fill-bg: ${fillHex};
  --ds-bar-gap-right: 12px;
  --ds-bar-gap-bottom: 8px;
  font-family: var(--ds-typography-font-family);
}

.ds-bar-progress__track {
  position: relative;
  height: var(--ds-bar-height);
  border-radius: var(--ds-bar-radius);
  background: var(--ds-bar-track-bg);
}

.ds-bar-progress__fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${clamped}%;
  border-radius: var(--ds-bar-radius);
  background: var(--ds-bar-fill-bg);
}

.ds-bar-progress[data-style="right"] {
  display: flex;
  align-items: center;
  gap: var(--ds-bar-gap-right);
}

.ds-bar-progress[data-style="bottom"] {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ds-bar-gap-bottom);
}`;

  const track = `<div class="ds-bar-progress__track"><div class="ds-bar-progress__fill" style="width:${clamped}%"></div></div>`;
  const labelHtml =
    style === "right" || style === "bottom"
      ? `\n  <span class="ds-bar-progress__label">${label}</span>`
      : "";

  return {
    html: `<div class="ds-bar-progress" data-style="${style}" role="progressbar" aria-valuenow="${clamped}" aria-valuemin="0" aria-valuemax="100">\n  ${track}${labelHtml}\n</div>`,
    css,
  };
}

export function BarProgressView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [barStyle, setBarStyle] = useState<BarProgressStyle>("right");
  const [progress, setProgress] = useState(40);
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("428");
  const [showGallery, setShowGallery] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const themeVars = useMemo(
    () => barThemeVars({ mode, previewWidth }),
    [mode, previewWidth],
  );

  const stateColors = useMemo(
    () =>
      COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  const trackHex = stateColors[0].hex;
  const fillHex = stateColors[1].hex;

  const isFloatingStyle =
    barStyle === "floating-over" || barStyle === "floating-bottom";

  const previewCardClass = showGallery
    ? styles.previewCardGallery
    : isFloatingStyle
      ? styles.previewCardFloating
      : "overflow-visible";

  const previewStageClass = showGallery
    ? `${shell.previewStage} ${styles.previewStageGallery}`
    : isFloatingStyle
      ? `${shell.previewStage} ${styles.previewStageFloating}`
      : shell.previewStage;

  const codeSnippet = useMemo(
    () =>
      buildBarProgressSnippet({
        style: barStyle,
        value: progress,
        trackHex,
        fillHex,
      }),
    [barStyle, progress, trackHex, fillHex],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Barra de progreso determinada del sistema (Figma 977:298525). Track{" "}
          <code className="font-mono text-[length:inherit]">bg-brand-ships</code>
          , fill{" "}
          <code className="font-mono text-[length:inherit]">button-color</code>
          . Cinco estilos de etiqueta: none, right, bottom, floating over/bottom.
        </p>

        <div className="mb-4">
          <div className={`${shell.previewCard} ${previewCardClass}`}>
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
            <div className={previewStageClass}>
              {showGallery ? (
                <div className={styles.gallery}>
                  {ALL_STYLES.map((s) => (
                    <div key={s} className={styles.galleryItem}>
                      <span className={styles.galleryLabel}>
                        {STYLE_LABELS[s]}
                      </span>
                      <BarProgressPreview style={s} value={progress} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.previewWrap}>
                  <BarProgressPreview style={barStyle} value={progress} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Bar height" value="var(--ds-bar-height)" />
              <SpecRow label="Bar radius" value="var(--ds-bar-radius)" />
              <SpecRow
                label="Fill radius (floating)"
                value="var(--ds-bar-fill-radius-floating)"
              />
              <SpecRow
                label="Gap (right style)"
                value="var(--ds-bar-gap-right)"
              />
              <SpecRow
                label="Gap (bottom style)"
                value="var(--ds-bar-gap-bottom)"
              />
              <SpecRow
                label="Tooltip padding"
                value="var(--ds-bar-tooltip-py) var(--ds-bar-tooltip-px)"
              />
              <SpecRow
                label="Tooltip radius"
                value="var(--ds-bar-tooltip-radius)"
              />
              <SpecRow label="Style" value={STYLE_LABELS[barStyle]} />
              <SpecRow label="Progress" value={`${progress}%`} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Label"
                value="var(--ds-typography-body-md-font-size) / 400"
              />
              <SpecRow
                label="Tooltip"
                value="var(--ds-typography-body-xs-font-size) / 500 / 16px lh"
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>All styles</h3>
            <div className={styles.gallery}>
              {ALL_STYLES.map((s) => (
                <div key={s} className={styles.galleryItem}>
                  <span className={styles.galleryLabel}>
                    {STYLE_LABELS[s]}
                  </span>
                  <BarProgressPreview style={s} value={progress} />
                </div>
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Progress samples</h3>
            <div className={styles.stateGallery}>
              {PROGRESS_PRESETS.filter((p) => p > 0).map((p) => (
                <div key={p} className={styles.stateGalleryItem}>
                  <span className={styles.galleryLabel}>{p}%</span>
                  <BarProgressPreview style={barStyle} value={p} />
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
              Style, progress y variables del componente
            </p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Style"
            value={barStyle}
            options={ALL_STYLES.map((s) => ({
              value: s,
              label: STYLE_LABELS[s],
            }))}
            onChange={setBarStyle}
          />

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Progress ({progress}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-[var(--ds-color-brand)]"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {PROGRESS_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProgress(p)}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                    progress === p
                      ? "bg-[var(--ds-color-brand)] text-white"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

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
              { value: "gallery", label: "All styles" },
            ]}
            onChange={(v) => setShowGallery(v === "gallery")}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div key={sc.label} className={shell.configRow}>
                  <span className={shell.configKey}>{sc.label}</span>
                  <span className={shell.configValMono}>{sc.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Style</span>
                <span className={shell.configVal}>
                  {STYLE_LABELS[barStyle]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Progress</span>
                <span className={shell.configValMono}>{progress}%</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Width</span>
                <span className={shell.configValMono}>
                  {previewWidth === "100%" ? "100%" : `${previewWidth}px`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Bar progress — ${STYLE_LABELS[barStyle]} / ${progress}%`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
