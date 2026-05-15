import { useState, useMemo } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./circle-progress.module.css";

type CircleSize = "sm" | "md" | "lg" | "xl";

const SIZE_LABELS: Record<CircleSize, string> = {
  sm: "Small (32px)",
  md: "Medium (48px)",
  lg: "Large (56px)",
  xl: "Extra large (64px)",
};

const ALL_SIZES: CircleSize[] = ["sm", "md", "lg", "xl"];

const SIZE_PX: Record<CircleSize, number> = {
  sm: 32,
  md: 48,
  lg: 56,
  xl: 64,
};

const STROKE_PX: Record<CircleSize, number> = {
  sm: 3,
  md: 4,
  lg: 4,
  xl: 4,
};

const COLOR_DEFS = [
  {
    label: "Track",
    cssVar: "--ds-circle-track",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
  {
    label: "Arc",
    cssVar: "--ds-circle-fill",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Label",
    cssVar: "--ds-circle-label",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
] as const;

function circleThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-circle-track" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-circle-fill" as string]: resolveJsonButtonColor("button-color", mode),
    ["--ds-circle-label" as string]: resolveJsonTextColor("text-tertiary", mode),
  };
}

function CircleProgressRing({
  size,
  animate,
}: {
  size: CircleSize;
  animate: boolean;
}) {
  const px = SIZE_PX[size];
  const stroke = STROKE_PX[size];
  const half = px / 2;
  const r = half - stroke / 2;
  const c = 2 * Math.PI * r;
  const arcLen = c * 0.28;
  const gapLen = c - arcLen;

  return (
    <div className={styles.ringWrap}>
      <svg
        className={styles.ring}
        data-animate={animate ? "true" : "false"}
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        aria-hidden
      >
        <circle className={styles.track} cx={half} cy={half} r={r} />
        <circle
          className={styles.arc}
          cx={half}
          cy={half}
          r={r}
          strokeDasharray={`${arcLen} ${gapLen}`}
          transform={`rotate(-90 ${half} ${half})`}
        />
      </svg>
    </div>
  );
}

function CircleProgressPreview({
  size,
  showText,
  labelText,
  animate,
}: {
  size: CircleSize;
  showText: boolean;
  labelText: string;
  animate: boolean;
}) {
  return (
    <div
      className={styles.host}
      data-size={size}
      data-show-text={showText ? "true" : "false"}
      role="status"
      aria-live="polite"
      aria-label={showText ? labelText : "Loading"}
    >
      <CircleProgressRing size={size} animate={animate} />
      {showText ? <p className={styles.label}>{labelText}</p> : null}
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

function buildCircleSnippet(opts: {
  size: CircleSize;
  showText: boolean;
  labelText: string;
  trackHex: string;
  fillHex: string;
  labelHex: string;
}): { html: string; css: string } {
  const { size, showText, labelText, trackHex, fillHex, labelHex } = opts;
  const px = SIZE_PX[size];

  const css = `/* Circle progress — Figma 978:298965 */
.ds-circle-progress {
  --ds-circle-track: ${trackHex};
  --ds-circle-fill: ${fillHex};
  --ds-circle-label: ${labelHex};
  --ds-circle-size: ${px}px;
  --ds-circle-gap: 16px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${showText ? "var(--ds-circle-gap)" : "0"};
  font-family: var(--ds-typography-font-family);
}

.ds-circle-progress__ring {
  width: var(--ds-circle-size);
  height: var(--ds-circle-size);
  animation: ds-circle-spin 1.1s linear infinite;
}

@keyframes ds-circle-spin {
  to { transform: rotate(360deg); }
}`;

  const labelHtml = showText
    ? `\n  <p class="ds-circle-progress__label">${labelText}</p>`
    : "";

  return {
    html: `<div class="ds-circle-progress" data-size="${size}" role="status" aria-live="polite">\n  <svg class="ds-circle-progress__ring" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" aria-hidden="true"></svg>${labelHtml}\n</div>`,
    css,
  };
}

export function CircleProgressView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [size, setSize] = useState<CircleSize>("md");
  const [showText, setShowText] = useState(true);
  const [labelText, setLabelText] = useState("Loading...");
  const [animate, setAnimate] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;
  const themeVars = useMemo(() => circleThemeVars(mode), [mode]);

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

  const codeSnippet = useMemo(
    () =>
      buildCircleSnippet({
        size,
        showText,
        labelText,
        trackHex: stateColors[0].hex,
        fillHex: stateColors[1].hex,
        labelHex: stateColors[2].hex,
      }),
    [size, showText, labelText, stateColors],
  );

  const previewCardClass = showGallery
    ? styles.previewCardGallery
    : "overflow-visible";

  const previewStageClass = showGallery
    ? `${shell.previewStage} ${styles.previewStageGallery}`
    : shell.previewStage;

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Indicador circular de carga (Figma 978:298965). Track{" "}
          <code className="font-mono text-[length:inherit]">bg-brand-ships</code>
          , arco{" "}
          <code className="font-mono text-[length:inherit]">button-color</code>
          . Tamaños sm–xl; etiqueta opcional con{" "}
          <code className="font-mono text-[length:inherit]">text-tertiary</code>
          .
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
                  {(
                    [
                      { showText: false, title: "Without label" },
                      { showText: true, title: "With label" },
                    ] as const
                  ).map((section) => (
                    <div key={section.title} className={styles.gallerySection}>
                      <p className={styles.gallerySectionTitle}>
                        {section.title}
                      </p>
                      <div className={styles.galleryRow}>
                        {ALL_SIZES.map((s) => (
                          <div key={s} className={styles.galleryItem}>
                            <span className={styles.galleryLabel}>
                              {SIZE_LABELS[s]}
                            </span>
                            <CircleProgressPreview
                              size={s}
                              showText={section.showText}
                              labelText={labelText}
                              animate={animate}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.previewWrap}>
                  <CircleProgressPreview
                    size={size}
                    showText={showText}
                    labelText={labelText}
                    animate={animate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Sizes (sm → xl)" value="32 / 48 / 56 / 64 px" />
              <SpecRow
                label="Stroke"
                value="3px (sm) · 4px (md–xl)"
              />
              <SpecRow
                label="Gap (with label)"
                value="var(--ds-circle-gap)"
              />
              <SpecRow label="Size" value={SIZE_LABELS[size]} />
              <SpecRow
                label="Label"
                value={showText ? "visible" : "hidden"}
              />
              <SpecRow
                label="Animation"
                value={animate ? "spin" : "static"}
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Label sm / md"
                value="var(--ds-typography-body-sm-font-size) / 400"
              />
              <SpecRow
                label="Label lg / xl"
                value="var(--ds-typography-h6-font-size) / 400"
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
            <h3 className={shell.specHeading}>All sizes</h3>
            <div className={styles.specGallery}>
              {ALL_SIZES.map((s) => (
                <CircleProgressPreview
                  key={s}
                  size={s}
                  showText={showText}
                  labelText={labelText}
                  animate={animate}
                />
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
              Tamaño, etiqueta y tokens del indicador
            </p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Size"
            value={size}
            options={ALL_SIZES.map((s) => ({
              value: s,
              label: SIZE_LABELS[s],
            }))}
            onChange={setSize}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Label</span>
              <Switch
                checked={showText}
                onCheckedChange={setShowText}
                aria-label="Mostrar texto debajo"
                style={showText ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showText && (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Label text
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Animate</span>
              <Switch
                checked={animate}
                onCheckedChange={setAnimate}
                aria-label="Animación de giro"
                style={animate ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <SegmentedControl
            label="Preview mode"
            value={showGallery ? "gallery" : "single"}
            options={[
              { value: "single", label: "Single" },
              { value: "gallery", label: "All variants" },
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
                <span className={shell.configKey}>Size</span>
                <span className={shell.configVal}>{SIZE_LABELS[size]}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Label</span>
                <span className={shell.configVal}>
                  {showText ? labelText : "—"}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Animate</span>
                <span className={shell.configVal}>{animate ? "on" : "off"}</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Circle progress — ${SIZE_LABELS[size]}${showText ? ` / ${labelText}` : ""}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
