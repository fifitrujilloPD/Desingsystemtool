import { useId, useMemo, useState, type CSSProperties } from "react";
import { CodeXml } from "lucide-react";
import { SegmentedControl, ControlSelect } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./chart-mini.module.css";

/** Figma `property1` normalizado */
type ChartMiniVariant = "single" | "type1" | "organic" | "line";

/** Figma `type` */
type ChartMiniTrend = "success" | "bad";

const VARIANT_LABELS: Record<ChartMiniVariant, string> = {
  single: "Single",
  type1: "Type 1",
  organic: "Organic",
  line: "Line",
};

const VARIANT_ORDER: ChartMiniVariant[] = [
  "type1",
  "organic",
  "line",
  "single",
];

const TREND_LABELS: Record<ChartMiniTrend, string> = {
  success: "Success",
  bad: "Bad",
};

const COLOR_DEFS = [
  {
    label: "Trend success",
    cssVar: "--ds-chart-mini-success",
    jsonPath: "Text colors.text-success",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-success", m),
  },
  {
    label: "Trend error / bad",
    cssVar: "--ds-chart-mini-bad",
    jsonPath: "Text colors.text-error",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-error", m),
  },
  {
    label: "Marker center",
    cssVar: "--ds-chart-mini-marker-bg",
    jsonPath: "Background.bg-container",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", m),
  },
] as const;

function chartMiniThemeVars(mode: "light" | "dark"): CSSProperties {
  return {
    ["--ds-chart-mini-success" as string]: resolveJsonTextColor(
      "text-success",
      mode,
    ),
    ["--ds-chart-mini-bad" as string]: resolveJsonTextColor(
      "text-error",
      mode,
    ),
    ["--ds-chart-mini-marker-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

/** Polilínea M + L… */
function polylineD(pts: ReadonlyArray<readonly [number, number]>): string {
  if (pts.length === 0) return "";
  return pts
    .map(([x, y], i) =>
      i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`,
    )
    .join(" ");
}

function areaUnderD(
  pts: ReadonlyArray<readonly [number, number]>,
  bottomY: number,
): string {
  if (pts.length === 0) return "";
  const line = polylineD(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L ${last[0]} ${bottomY} L ${first[0]} ${bottomY} Z`;
}

const CHART_H = 56;

/** Espejo vertical en el viewBox: misma composición que Success (línea arriba, área hasta y=56 abajo), sin `transform` que invierta el orden visual. */
function mirrorY(y: number): number {
  return CHART_H - y;
}

function mirrorPts(
  pts: ReadonlyArray<readonly [number, number]>,
): [number, number][] {
  return pts.map(([x, y]): [number, number] => [x, mirrorY(y)]);
}

function mirrorMarkerPts(
  pts: ReadonlyArray<readonly [number, number]>,
  bad: boolean,
): ReadonlyArray<readonly [number, number]> {
  if (!bad) return pts;
  return mirrorPts(pts);
}

const PT_TYPE1: ReadonlyArray<readonly [number, number]> = [
  [6, 40],
  [14, 36],
  [22, 40],
  [30, 32],
  [38, 38],
  [46, 28],
  [54, 34],
  [62, 26],
  [70, 32],
  [78, 24],
  [86, 30],
  [94, 20],
  [100, 24],
  [106, 14],
];

/** Cuatro vértices, tres tramos; marcadores sólo en puntos internos (Figma type bad + marck). */
const PT_LINE: ReadonlyArray<readonly [number, number]> = [
  [8, 42],
  [36, 24],
  [62, 32],
  [104, 14],
];

const PT_SINGLE_VB128: ReadonlyArray<readonly [number, number]> = [
  [8, 40],
  [120, 12],
];

const ORGANIC_LINE_D =
  "M 6 38 C 26 40, 46 18, 66 26 S 96 16, 106 14";

const ORGANIC_AREA_D = `${ORGANIC_LINE_D} L 106 56 L 6 56 Z`;

/** Cúbica Success con todas las Y invertidas (~tendencia mala manteniendo cierre del área a y=56). */
const ORGANIC_LINE_D_BAD =
  "M 6 18 C 26 16, 46 38, 66 30 S 96 40, 106 42";

const ORGANIC_AREA_D_BAD = `${ORGANIC_LINE_D_BAD} L 106 56 L 6 56 Z`;

const MARKER_TYPE1: ReadonlyArray<readonly [number, number]> = [[94, 20]];
const MARKER_ORGANIC: ReadonlyArray<readonly [number, number]> = [[98, 18]];
/** Vértices internos (no extremos del trazo). */
const MARKER_LINE_TWO: ReadonlyArray<readonly [number, number]> = [
  [36, 24],
  [62, 32],
];

function MarkerGroup({
  positions,
  inkVar,
}: {
  positions: ReadonlyArray<readonly [number, number]>;
  inkVar: string;
}) {
  const bg = "var(--ds-chart-mini-marker-bg)";
  return (
    <g aria-hidden>
      {positions.map(([cx, cy], i) => (
        <g key={`${cx}-${cy}-${i}`}>
          <circle
            cx={cx}
            cy={cy}
            r={9}
            fill={`var(${inkVar})`}
            fillOpacity={0.2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={5.5}
            fill={bg}
            stroke={`var(${inkVar})`}
            strokeWidth={2}
          />
        </g>
      ))}
    </g>
  );
}

export function ChartMiniGraphic({
  variant,
  trend,
  showMarker,
}: {
  variant: ChartMiniVariant;
  trend: ChartMiniTrend;
  showMarker: boolean;
}) {
  const uid = useId();
  const gradId = `chart-mini-grad-${uid.replace(/:/g, "")}`;
  const inkVar =
    trend === "success"
      ? "--ds-chart-mini-success"
      : "--ds-chart-mini-bad";

  const isBad = trend === "bad";

  const { lineD, areaD, vb, markers } = useMemo(() => {
    const bottom = CHART_H;
    let markersLocal: ReadonlyArray<readonly [number, number]> = [];

    if (variant === "single") {
      const pts = isBad ? mirrorPts(PT_SINGLE_VB128) : PT_SINGLE_VB128;
      return {
        lineD: polylineD(pts),
        areaD: areaUnderD(pts, bottom),
        vb: "0 0 128 56",
        markers: markersLocal,
      };
    }

    let lineInner: string;
    let areaInner: string;

    if (variant === "type1") {
      const pts = isBad ? mirrorPts(PT_TYPE1) : PT_TYPE1;
      lineInner = polylineD(pts);
      areaInner = areaUnderD(pts, bottom);
      if (showMarker)
        markersLocal = mirrorMarkerPts(MARKER_TYPE1, isBad);
    } else if (variant === "line") {
      const pts = isBad ? mirrorPts(PT_LINE) : PT_LINE;
      lineInner = polylineD(pts);
      areaInner = areaUnderD(pts, bottom);
      if (showMarker)
        markersLocal = mirrorMarkerPts(MARKER_LINE_TWO, isBad);
    } else {
      lineInner = isBad ? ORGANIC_LINE_D_BAD : ORGANIC_LINE_D;
      areaInner = isBad ? ORGANIC_AREA_D_BAD : ORGANIC_AREA_D;
      if (showMarker)
        markersLocal = mirrorMarkerPts(MARKER_ORGANIC, isBad);
    }

    return {
      lineD: lineInner,
      areaD: areaInner,
      vb: "0 0 112 56",
      markers: markersLocal,
    };
  }, [variant, showMarker, isBad]);

  const effectiveMarkers =
    variant === "single" ? [] : markers;

  return (
    <svg
      className={styles.miniSvg}
      viewBox={vb}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Mini chart · ${VARIANT_LABELS[variant]} · ${TREND_LABELS[trend]}`}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor={`var(${inkVar})`} stopOpacity="0.38" />
          <stop offset="100%" stopColor={`var(${inkVar})`} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g>
        {/* Área hasta y=56, luego trazo arriba, marcadores al frente — mismo orden Success / Bad */}
        <path d={areaD} fill={`url(#${gradId})`} />
        <path
          d={lineD}
          fill="none"
          stroke={`var(${inkVar})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {effectiveMarkers.length > 0 ? (
          <MarkerGroup inkVar={inkVar} positions={effectiveMarkers} />
        ) : null}
      </g>
    </svg>
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

function buildChartMiniSnippet(okHex: string, badHex: string): {
  html: string;
  css: string;
} {
  return {
    html: `<svg width="112" height="56" viewBox="0 0 112 56" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mini chart">\n  <defs>\n    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">\n      <stop offset="0%" stop-color="${okHex}" stop-opacity="0.38"/>\n      <stop offset="100%" stop-color="${okHex}" stop-opacity="0"/>\n    </linearGradient>\n  </defs>\n  <path d="..." fill="url(#g)"/>\n  <path d="..." stroke="${okHex}" stroke-width="2" fill="none"/>\n</svg>`,
    css: `/* Chart mini — Figma 982:291981 */\n.ds-chart-mini__stroke-success { stroke: ${okHex}; }\n.ds-chart-mini__stroke-bad { stroke: ${badHex}; }\n.ds-chart-mini__fill-muted { opacity: 0.38; }`,
  };
}

export function ChartMiniView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [variant, setVariant] = useState<ChartMiniVariant>("type1");
  const [trend, setTrend] = useState<ChartMiniTrend>("success");
  const [showMarker, setShowMarker] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => chartMiniThemeVars(mode), [mode]);

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

  const markerApplies = variant !== "single";
  const effectiveMarker = markerApplies && showMarker;

  const codeSnippet = useMemo(
    () =>
      buildChartMiniSnippet(stateColors[0].hex, stateColors[1].hex),
    [stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Chart mini (Figma 982:291981): sparkline compacta (~56px alto) sin ejes:
          variantes <strong>Type 1</strong> (diente),{" "}
          <strong>Organic</strong>, <strong>Line</strong> y{" "}
          <strong>Single</strong>; tono <strong>Success</strong> /{" "}
          <strong>Bad</strong> y marcador opcional (en{" "}
          <strong>Line</strong> marca los dos vértices internos del trazo con
          marcas activas). Colores sólo desde tokens JSON vía CSS variables.
        </p>

        <div className="mb-4">
          <div className={`${shell.previewCard} overflow-visible`}>
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
            <div className={`${shell.previewStage} flex flex-col gap-4`}>
              <div
                className={styles.chartSlot}
                data-variant={variant === "single" ? "single" : undefined}
              >
                <ChartMiniGraphic
                  variant={variant}
                  trend={trend}
                  showMarker={effectiveMarker}
                />
              </div>
              {!markerApplies ? (
                <p className="text-xs text-[var(--ds-color-text-muted)]">
                  Variant <strong>Single</strong>: sin marcador por convención
                  Figma.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Height" value="56px" />
              <SpecRow
                label="Width"
                value="112px (Single 128px en Figma)"
              />
              <SpecRow label="Stroke" value="2px" />
              <SpecRow label="Variant" value={VARIANT_LABELS[variant]} />
              <SpecRow label="Trend" value={TREND_LABELS[trend]} />
              <SpecRow
                label="Marker"
                value={effectiveMarker ? "Sí" : "No"}
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Semantics</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="role"
                value="img + aria-label (catálogo accesible)"
              />
              <SpecRow label="Tone" value="text-success vs text-error" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={`${sc.label}-${sc.jsonPath}`} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Matrix (Figma)</h3>
            <p className="mb-3 text-sm text-[var(--ds-color-text-muted)]">
              Todas las variantes × Success y Bad · marcadores según diseño (
              Single sin punto).
            </p>
            <div className="flex flex-col gap-6">
              {VARIANT_ORDER.map((v) => (
                <div key={v} className={styles.variantRow}>
                  <span className={styles.pairHint} style={{ minWidth: 72 }}>
                    {VARIANT_LABELS[v]}
                  </span>
                  {(["success", "bad"] as const).map((t) => (
                    <div key={t} className={styles.pair}>
                      <span className={styles.pairHint}>{TREND_LABELS[t]}</span>
                      <div
                        className={styles.chartSlot}
                        data-variant={
                          v === "single" ? "single" : undefined
                        }
                      >
                        <ChartMiniGraphic
                          variant={v}
                          trend={t}
                          showMarker={v !== "single"}
                        />
                      </div>
                    </div>
                  ))}
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
              Variante, tendencia y marca (radios Figma).
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Variant"
            value={variant}
            options={VARIANT_ORDER.map((v) => ({
              value: v,
              label: VARIANT_LABELS[v],
            }))}
            onChange={(val) => setVariant(val as ChartMiniVariant)}
          />

          <ControlSelect
            label="Trend"
            value={trend}
            options={[
              { value: "success", label: TREND_LABELS.success },
              { value: "bad", label: TREND_LABELS.bad },
            ]}
            onChange={(val) => setTrend(val as ChartMiniTrend)}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>
                Marker (marck · no aplica a Single)
              </span>
              <Switch
                checked={showMarker}
                onCheckedChange={setShowMarker}
                style={showMarker ? switchOnStyle : undefined}
                disabled={!markerApplies}
              />
            </label>
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div
                  key={`${sc.label}-${sc.jsonPath}`}
                  className={shell.configRow}
                >
                  <span className={shell.configKey}>{sc.label}</span>
                  <span className={shell.configValMono}>{sc.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Chart mini — ${VARIANT_LABELS[variant]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
