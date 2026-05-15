import { useState, useMemo, useRef, useEffect, useCallback } from "react";
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
import styles from "./slider.module.css";

type SliderLabelStyle = "false" | "bottom" | "top-floating";
type SliderPercent = 0 | 25 | 50 | 75 | 100;
type PreviewWidth = "320" | "428" | "100%";

const LABEL_STYLE_LABELS: Record<SliderLabelStyle, string> = {
  false: "False",
  bottom: "Bottom",
  "top-floating": "Top floating",
};

const ALL_LABEL_STYLES: SliderLabelStyle[] = ["false", "bottom", "top-floating"];

const LEFT_OPTIONS: SliderPercent[] = [0, 25, 50, 75];
const RIGHT_OPTIONS: SliderPercent[] = [25, 50, 75, 100];
const ALL_STEPS: SliderPercent[] = [0, 25, 50, 75, 100];
const MIN_RANGE_GAP = 25;

const PREVIEW_WIDTH_OPTIONS: { value: PreviewWidth; label: string }[] = [
  { value: "320", label: "320px (Figma)" },
  { value: "428", label: "428px" },
  { value: "100%", label: "100%" },
];

const COLOR_DEFS = [
  {
    label: "Track",
    cssVar: "--ds-slider-track-bg",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
  {
    label: "Fill",
    cssVar: "--ds-slider-fill-bg",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Thumb surface",
    cssVar: "--ds-slider-thumb-bg",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
  {
    label: "Thumb border / focus",
    cssVar: "--ds-slider-thumb-border-color",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Label",
    cssVar: "--ds-slider-label-color",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Tooltip surface",
    cssVar: "--ds-slider-tooltip-bg",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
  {
    label: "Tooltip border",
    cssVar: "--ds-slider-tooltip-border",
    jsonPath: "Border color.border-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", mode),
  },
  {
    label: "Tooltip text",
    cssVar: "--ds-slider-tooltip-text",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
] as const;

function sliderThemeVars(opts: {
  mode: "light" | "dark";
  previewWidth: PreviewWidth;
}): React.CSSProperties {
  const { mode, previewWidth } = opts;
  return {
    ["--ds-slider-track-bg" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-slider-fill-bg" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-slider-thumb-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-slider-thumb-border-color" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-slider-focus-ring-color" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-slider-label-color" as string]: resolveJsonTextColor(
      "text-primary",
      mode,
    ),
    ["--ds-slider-tooltip-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-slider-tooltip-border" as string]: resolveJsonBorderColor(
      "border-secondary",
      mode,
    ),
    ["--ds-slider-tooltip-text" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-slider-preview-width" as string]:
      previewWidth === "100%" ? "100%" : `${previewWidth}px`,
  };
}

function formatPercent(value: SliderPercent): string {
  return `${value}%`;
}

function clampRange(
  left: SliderPercent,
  right: SliderPercent,
): { left: SliderPercent; right: SliderPercent } {
  if (left >= right) {
    const nextRight = RIGHT_OPTIONS.find((v) => v > left) ?? 100;
    return { left, right: nextRight };
  }
  return { left, right };
}

function snapToPercent(value: number): SliderPercent {
  const clamped = Math.min(100, Math.max(0, value));
  return ALL_STEPS.reduce((best, step) =>
    Math.abs(step - clamped) < Math.abs(best - clamped) ? step : best,
  );
}

function pointerToPercent(clientX: number, rect: DOMRect): number {
  const ratio = (clientX - rect.left) / rect.width;
  return Math.min(100, Math.max(0, ratio * 100));
}

function labelPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function SliderRangePreview({
  labelStyle,
  left,
  right,
  interactive = false,
  onLeftChange,
  onRightChange,
}: {
  labelStyle: SliderLabelStyle;
  left: SliderPercent;
  right: SliderPercent;
  interactive?: boolean;
  onLeftChange?: (value: SliderPercent) => void;
  onRightChange?: (value: SliderPercent) => void;
}) {
  const { left: leftVal, right: rightVal } = clampRange(left, right);
  const hostRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<"left" | "right" | null>(
    null,
  );
  const [dragValue, setDragValue] = useState<number | null>(null);

  const showBottom = labelStyle === "bottom";
  const showTooltip = labelStyle === "top-floating";
  const isDragging = activeThumb !== null;

  const displayLeft =
    activeThumb === "left" && dragValue !== null ? dragValue : leftVal;
  const displayRight =
    activeThumb === "right" && dragValue !== null ? dragValue : rightVal;
  const rangeWidth = displayRight - displayLeft;

  const getHostRect = useCallback(
    () => hostRef.current?.getBoundingClientRect(),
    [],
  );

  const applyPointer = useCallback(
    (which: "left" | "right", clientX: number) => {
      const rect = getHostRect();
      if (!rect) return;
      let pct = pointerToPercent(clientX, rect);
      if (which === "left") {
        pct = Math.min(pct, rightVal - MIN_RANGE_GAP);
      } else {
        pct = Math.max(pct, leftVal + MIN_RANGE_GAP);
      }
      setDragValue(pct);
    },
    [getHostRect, leftVal, rightVal],
  );

  const commitDrag = useCallback(() => {
    if (activeThumb === null || dragValue === null) {
      setActiveThumb(null);
      setDragValue(null);
      return;
    }
    const snapped = snapToPercent(dragValue);
    if (activeThumb === "left") {
      onLeftChange?.(snapped);
    } else {
      onRightChange?.(snapped);
    }
    setActiveThumb(null);
    setDragValue(null);
  }, [activeThumb, dragValue, onLeftChange, onRightChange]);

  useEffect(() => {
    if (!interactive || !isDragging) return;

    const onPointerMove = (e: PointerEvent) => {
      if (activeThumb) applyPointer(activeThumb, e.clientX);
    };
    const onPointerUp = () => commitDrag();
    const onPointerCancel = () => commitDrag();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [interactive, isDragging, activeThumb, applyPointer, commitDrag]);

  const startThumbDrag = (
    which: "left" | "right",
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveThumb(which);
    setDragValue(which === "left" ? leftVal : rightVal);
    applyPointer(which, e.clientX);
  };

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.button !== 0) return;
    const rect = getHostRect();
    if (!rect) return;
    const pct = pointerToPercent(e.clientX, rect);
    const target =
      Math.abs(pct - leftVal) <= Math.abs(pct - rightVal) ? "left" : "right";
    setActiveThumb(target);
    applyPointer(target, e.clientX);
  };

  return (
    <div
      ref={hostRef}
      className={styles.host}
      data-label={labelStyle}
      data-interactive={interactive ? "true" : "false"}
      data-dragging={isDragging ? "true" : "false"}
      role="group"
      aria-label={`Range slider ${formatPercent(leftVal)} to ${formatPercent(rightVal)}`}
    >
      <div
        className={styles.trackArea}
        aria-hidden={!interactive}
        onPointerDown={interactive ? onTrackPointerDown : undefined}
      >
        <div className={styles.track} />
        <div
          className={styles.range}
          style={{ left: `${displayLeft}%`, width: `${rangeWidth}%` }}
        />
      </div>

      <button
        type="button"
        className={styles.thumb}
        style={{ left: `${displayLeft}%` }}
        data-dragging={activeThumb === "left" ? "true" : "false"}
        aria-label={`Minimum ${labelPercent(displayLeft)}`}
        aria-valuemin={0}
        aria-valuemax={rightVal - MIN_RANGE_GAP}
        aria-valuenow={Math.round(displayLeft)}
        tabIndex={interactive ? 0 : -1}
        onPointerDown={(e) => startThumbDrag("left", e)}
      >
        <div className={styles.thumbInner} />
        {showBottom ? (
          <span className={styles.thumbLabel} data-align="start">
            {labelPercent(displayLeft)}
          </span>
        ) : null}
        {showTooltip ? (
          <div className={styles.tooltip}>
            <div className={styles.tooltipContent}>
              {labelPercent(displayLeft)}
            </div>
          </div>
        ) : null}
      </button>

      <button
        type="button"
        className={styles.thumb}
        style={{ left: `${displayRight}%` }}
        data-dragging={activeThumb === "right" ? "true" : "false"}
        aria-label={`Maximum ${labelPercent(displayRight)}`}
        aria-valuemin={leftVal + MIN_RANGE_GAP}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayRight)}
        tabIndex={interactive ? 0 : -1}
        onPointerDown={(e) => startThumbDrag("right", e)}
      >
        <div className={styles.thumbInner} />
        {showBottom ? (
          <span
            className={styles.thumbLabel}
            data-align={displayRight >= 99 ? "end" : "start"}
          >
            {labelPercent(displayRight)}
          </span>
        ) : null}
        {showTooltip ? (
          <div className={styles.tooltip}>
            <div className={styles.tooltipContent}>
              {labelPercent(displayRight)}
            </div>
          </div>
        ) : null}
      </button>
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

function buildSliderSnippet(opts: {
  labelStyle: SliderLabelStyle;
  left: SliderPercent;
  right: SliderPercent;
  trackHex: string;
  fillHex: string;
  thumbHex: string;
  borderHex: string;
}): { html: string; css: string } {
  const { labelStyle, left, right, trackHex, fillHex, thumbHex, borderHex } =
    opts;
  const { left: l, right: r } = clampRange(left, right);

  const css = `/* Slider — Figma 981:288514 */
.ds-slider {
  --ds-slider-track-bg: ${trackHex};
  --ds-slider-fill-bg: ${fillHex};
  --ds-slider-thumb-bg: ${thumbHex};
  --ds-slider-thumb-border-color: ${borderHex};
  position: relative;
  width: 320px;
  height: ${labelStyle === "false" ? "24px" : "56px"};
}

.ds-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--ds-slider-track-bg);
}

.ds-slider__range {
  position: absolute;
  top: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--ds-slider-fill-bg);
}

.ds-slider__thumb {
  position: absolute;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: var(--ds-slider-thumb-bg);
  border: 2px solid var(--ds-slider-thumb-border-color);
  transform: translateX(-50%);
}`;

  return {
    html: `<div class="ds-slider" data-label="${labelStyle}" role="group" aria-label="Range ${l}% to ${r}%">
  <div class="ds-slider__track" aria-hidden></div>
  <div class="ds-slider__range" style="left:${l}%;width:${r - l}%" aria-hidden></div>
  <span class="ds-slider__thumb" style="left:${l}%" aria-hidden></span>
  <span class="ds-slider__thumb" style="left:${r}%" aria-hidden></span>
</div>`,
    css,
  };
}

export function SliderView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [labelStyle, setLabelStyle] = useState<SliderLabelStyle>("false");
  const [leftControl, setLeftControl] = useState<SliderPercent>(0);
  const [rightControl, setRightControl] = useState<SliderPercent>(25);
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("320");
  const [showGallery, setShowGallery] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const { left, right } = clampRange(leftControl, rightControl);

  const themeVars = useMemo(
    () => sliderThemeVars({ mode, previewWidth }),
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

  const hasLabeledLayout =
    labelStyle === "bottom" || labelStyle === "top-floating";

  const previewCardClass = showGallery
    ? styles.previewCardGallery
    : hasLabeledLayout
      ? styles.previewCardLabeled
      : "overflow-visible";

  const previewStageClass = showGallery
    ? `${shell.previewStage} ${styles.previewStageGallery}`
    : hasLabeledLayout
      ? `${shell.previewStage} ${styles.previewStageLabeled}`
      : shell.previewStage;

  const codeSnippet = useMemo(
    () =>
      buildSliderSnippet({
        labelStyle,
        left,
        right,
        trackHex: stateColors[0].hex,
        fillHex: stateColors[1].hex,
        thumbHex: stateColors[2].hex,
        borderHex: stateColors[3].hex,
      }),
    [labelStyle, left, right, stateColors],
  );

  const handleLeftChange = (value: SliderPercent) => {
    setLeftControl(value);
    if (value >= rightControl) {
      const next = RIGHT_OPTIONS.find((v) => v > value) ?? 100;
      setRightControl(next);
    }
  };

  const handleRightChange = (value: SliderPercent) => {
    setRightControl(value);
    if (value <= leftControl) {
      const prev = [...LEFT_OPTIONS].reverse().find((v) => v < value) ?? 0;
      setLeftControl(prev);
    }
  };

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Control de rango dual (Figma 981:288514). Track{" "}
          <code className="font-mono text-[length:inherit]">bg-brand-ships</code>
          , fill{" "}
          <code className="font-mono text-[length:inherit]">button-color</code>
          , handles 24px con borde{" "}
          <code className="font-mono text-[length:inherit]">button-hover</code>.
          Variables Label, Left control y Right control del componente Figma.
          Arrastra los handles o la barra en el preview (snap a 25%).
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
                  {ALL_LABEL_STYLES.map((s) => (
                    <div key={s} className={styles.galleryItem}>
                      <span className={styles.galleryLabel}>
                        {LABEL_STYLE_LABELS[s]}
                      </span>
                      <SliderRangePreview
                        labelStyle={s}
                        left={left}
                        right={right}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.previewWrap}>
                  <SliderRangePreview
                    labelStyle={labelStyle}
                    left={left}
                    right={right}
                    interactive
                    onLeftChange={handleLeftChange}
                    onRightChange={handleRightChange}
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
              <SpecRow label="Width (Figma)" value="var(--ds-slider-width)" />
              <SpecRow
                label="Track height"
                value="var(--ds-slider-track-height)"
              />
              <SpecRow
                label="Thumb size"
                value="var(--ds-slider-thumb-size)"
              />
              <SpecRow
                label="Host height (no label)"
                value="var(--ds-slider-host-height-compact)"
              />
              <SpecRow
                label="Host height (labeled)"
                value="var(--ds-slider-host-height-labeled)"
              />
              <SpecRow label="Label" value={LABEL_STYLE_LABELS[labelStyle]} />
              <SpecRow label="Left control" value={formatPercent(left)} />
              <SpecRow label="Right control" value={formatPercent(right)} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Bottom label"
                value="var(--ds-typography-body-md) / 500"
              />
              <SpecRow
                label="Tooltip"
                value="var(--ds-typography-body-xs) / 500"
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
            <h3 className={shell.specHeading}>Label styles</h3>
            <div className={styles.gallery}>
              {ALL_LABEL_STYLES.map((s) => (
                <div key={s} className={styles.galleryItem}>
                  <span className={styles.galleryLabel}>
                    {LABEL_STYLE_LABELS[s]}
                  </span>
                  <SliderRangePreview
                    labelStyle={s}
                    left={left}
                    right={right}
                  />
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
              Label, Left control, Right control y tokens Figma
            </p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Label"
            value={labelStyle}
            options={ALL_LABEL_STYLES.map((s) => ({
              value: s,
              label: LABEL_STYLE_LABELS[s],
            }))}
            onChange={(v) => setLabelStyle(v as SliderLabelStyle)}
          />

          <ControlSelect
            label="Left control"
            value={String(leftControl)}
            options={LEFT_OPTIONS.map((v) => ({
              value: String(v),
              label: formatPercent(v),
            }))}
            onChange={(v) => handleLeftChange(Number(v) as SliderPercent)}
          />

          <ControlSelect
            label="Right control"
            value={String(rightControl)}
            options={RIGHT_OPTIONS.map((v) => ({
              value: String(v),
              label: formatPercent(v),
            }))}
            onChange={(v) => handleRightChange(Number(v) as SliderPercent)}
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
              { value: "gallery", label: "All labels" },
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
                <span className={shell.configKey}>Label</span>
                <span className={shell.configVal}>
                  {LABEL_STYLE_LABELS[labelStyle]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Left control</span>
                <span className={shell.configVal}>{formatPercent(left)}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Right control</span>
                <span className={shell.configVal}>{formatPercent(right)}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Range</span>
                <span className={shell.configVal}>
                  {formatPercent(left)} – {formatPercent(right)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Slider — ${LABEL_STYLE_LABELS[labelStyle]} / ${formatPercent(left)}–${formatPercent(right)}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
