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
import styles from "./steppers.module.css";

type StepperLayout = "desktop" | "default" | "vertical" | "minimal";
type StepState = "done" | "active" | "pending";
type StepPosition = "step-1" | "next" | "last";
type FigmaStepState = "defaul" | "focus" | "done";
type PreviewMode = "segment" | "flow";

const LAYOUT_LABELS: Record<StepperLayout, string> = {
  desktop: "Desktop",
  default: "Default",
  vertical: "Desktop vertical",
  minimal: "None (minimal)",
};

const ALL_LAYOUTS: StepperLayout[] = ["desktop", "default", "vertical", "minimal"];

const POSITION_LABELS: Record<StepPosition, string> = {
  "step-1": "Step 1",
  next: "Next step",
  last: "Last step",
};

const ALL_POSITIONS: StepPosition[] = ["step-1", "next", "last"];

const FIGMA_STATE_LABELS: Record<FigmaStepState, string> = {
  defaul: "Defaul",
  focus: "Focus",
  done: "Done",
};

const ALL_FIGMA_STATES: FigmaStepState[] = ["defaul", "focus", "done"];

const DEFAULT_LABELS = ["Step", "Step", "Step", "Step", "Step"];

const COLOR_DEFS = [
  {
    label: "Circle done / active",
    cssVar: "--ds-step-circle-done",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Circle pending",
    cssVar: "--ds-step-circle-pending",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
  {
    label: "Number on circle",
    cssVar: "--ds-step-circle-on",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
  {
    label: "Label / connector active",
    cssVar: "--ds-step-label-active",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Label / connector pending",
    cssVar: "--ds-step-label-pending",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
  {
    label: "Focus ring",
    cssVar: "--ds-step-focus-shadow",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
] as const;

function stepThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-step-circle-done" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-step-circle-pending" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-step-circle-on" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-step-label-active" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-step-label-pending" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-step-connector-active" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-step-connector-pending" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-step-focus-shadow" as string]: `0 0 0 4px ${resolveJsonBackgroundColor("bg-brand-ships", mode)}`,
  };
}

function resolveStepState(index: number, activeIndex: number): StepState {
  if (index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

function connectorState(
  index: number,
  activeIndex: number,
): "done" | "active" | "pending" {
  if (index < activeIndex) return "done";
  return "pending";
}

function figmaToStepState(figmaState: FigmaStepState): StepState {
  if (figmaState === "focus") return "active";
  if (figmaState === "done") return "done";
  return "pending";
}

function positionToIndex(position: StepPosition): number {
  return position === "step-1" ? 0 : position === "next" ? 1 : 2;
}

function ConnectorH({
  state,
  fixed,
  className,
}: {
  state: StepState;
  fixed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${styles.connectorH} ${fixed ? styles.connectorFixed : ""} ${className ?? ""}`.trim()}
      data-state={state}
      aria-hidden
    />
  );
}

function StepCircle({
  index,
  state,
  layout,
}: {
  index: number;
  state: StepState;
  layout: StepperLayout;
}) {
  return (
    <span
      className={styles.circle}
      data-state={state}
      data-layout={layout}
      aria-hidden
    >
      {index + 1}
    </span>
  );
}

function StepperPreview({
  layout,
  stepCount,
  activeIndex,
  labels,
  showLabels,
}: {
  layout: StepperLayout;
  stepCount: number;
  activeIndex: number;
  labels: string[];
  showLabels: boolean;
}) {
  const visibleLabels = labels.slice(0, stepCount);
  const effectiveShowLabels = showLabels && layout !== "minimal";

  return (
    <nav
      className={styles.host}
      data-layout={layout}
      aria-label="Progress steps"
    >
      {Array.from({ length: stepCount }, (_, i) => {
        const state = resolveStepState(i, activeIndex);
        const connState = connectorState(i, activeIndex);
        const isLast = i === stepCount - 1;
        const label = visibleLabels[i] ?? "Step";

        return (
          <div key={`step-${i}`} className={styles.step}>
            {layout === "default" ? (
              <>
                {i > 0 ? (
                  <div
                    className={`${styles.connectorH} ${styles.connectorLeft}`}
                    data-state={connectorState(i - 1, activeIndex)}
                    aria-hidden
                  />
                ) : null}
                <StepCircle index={i} state={state} layout={layout} />
                {!isLast ? (
                  <div
                    className={`${styles.connectorH} ${styles.connectorRight}`}
                    data-state={connState}
                    aria-hidden
                  />
                ) : null}
                {effectiveShowLabels ? (
                  <p className={styles.label} data-state={state}>
                    {label}
                  </p>
                ) : null}
              </>
            ) : layout === "vertical" ? (
              <>
                <div className={styles.stepMain}>
                  <StepCircle index={i} state={state} layout={layout} />
                  {effectiveShowLabels ? (
                    <p className={styles.label} data-state={state}>
                      {label}
                    </p>
                  ) : null}
                </div>
                {!isLast ? (
                  <div
                    className={styles.connectorV}
                    data-state={connState}
                    aria-hidden
                  />
                ) : null}
              </>
            ) : (
              <>
                <div className={styles.stepMain}>
                  <StepCircle index={i} state={state} layout={layout} />
                  {effectiveShowLabels ? (
                    <p className={styles.label} data-state={state}>
                      {label}
                    </p>
                  ) : null}
                </div>
                {!isLast ? (
                  <div
                    className={styles.connectorH}
                    data-state={connState}
                    aria-hidden
                  />
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/** Color de línea alineado a Figma: mismo semántica que círculo/label en el segmento. */
function segmentConnectorState(
  side: "left" | "right",
  position: StepPosition,
  state: StepState,
): StepState {
  if (side === "left") {
    if (position === "step-1") return "pending";
    return state === "pending" ? "pending" : "done";
  }
  if (position === "last") return "pending";
  if (position === "step-1") return state;
  return state === "done" ? "done" : state === "active" ? "active" : "pending";
}

function segmentLabel(position: StepPosition, labels: string[]): string {
  const i = positionToIndex(position);
  return labels[i] ?? "Step";
}

/** Un símbolo Figma: Step 1 | Next step | Last step × Defaul | Focus | Done */
function StepSegmentPreview({
  layout,
  position,
  figmaState,
  label,
  showLabel,
}: {
  layout: StepperLayout;
  position: StepPosition;
  figmaState: FigmaStepState;
  label: string;
  showLabel: boolean;
}) {
  const state = figmaToStepState(figmaState);
  const index = positionToIndex(position);
  const showLabelEffective = showLabel && layout !== "minimal";
  const showLeft = position === "next" || position === "last";
  const showRight = position === "step-1" || position === "next";
  const showTop =
    layout === "vertical" && (position === "next" || position === "last");
  const showBottom =
    layout === "vertical" && (position === "step-1" || position === "next");
  const leftConn = segmentConnectorState("left", position, state);
  const rightConn = segmentConnectorState("right", position, state);
  const aria = `${POSITION_LABELS[position]} — ${FIGMA_STATE_LABELS[figmaState]}`;

  if (layout === "default") {
    return (
      <div
        className={styles.segment}
        data-layout="default"
        data-position={position}
        role="img"
        aria-label={aria}
      >
        {showLeft ? (
          <ConnectorH state={leftConn} className={styles.connectorLeft} />
        ) : null}
        <StepCircle index={index} state={state} layout={layout} />
        {showRight ? (
          <ConnectorH
            state={rightConn}
            fixed
            className={styles.connectorRight}
          />
        ) : null}
        {showLabelEffective ? (
          <p className={styles.label} data-state={state}>
            {label}
          </p>
        ) : null}
      </div>
    );
  }

  if (layout === "vertical") {
    return (
      <div
        className={styles.segment}
        data-layout="vertical"
        data-position={position}
        role="img"
        aria-label={aria}
      >
        {showTop ? (
          <div className={styles.connectorV} data-state={leftConn} aria-hidden />
        ) : null}
        <div className={styles.segmentRow}>
          <StepCircle index={index} state={state} layout={layout} />
          {showLabelEffective ? (
            <p className={styles.label} data-state={state}>
              {label}
            </p>
          ) : null}
        </div>
        {showBottom ? (
          <div
            className={styles.connectorV}
            data-state={rightConn}
            aria-hidden
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={styles.segment}
      data-layout={layout}
      data-position={position}
      role="img"
      aria-label={aria}
    >
      <div className={styles.segmentRow}>
        {showLeft ? (
          <ConnectorH
            state={leftConn}
            fixed
            className={styles.connectorLeading}
          />
        ) : null}
        <div className={styles.segmentStepCore}>
          <StepCircle index={index} state={state} layout={layout} />
          {showLabelEffective ? (
            <p className={styles.label} data-state={state}>
              {label}
            </p>
          ) : null}
        </div>
        {showRight ? (
          <ConnectorH
            state={rightConn}
            fixed
            className={styles.connectorTrailing}
          />
        ) : null}
      </div>
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

function buildStepperSnippet(opts: {
  layout: StepperLayout;
  stepCount: number;
  activeIndex: number;
  doneHex: string;
  pendingHex: string;
}): { html: string; css: string } {
  const { layout, stepCount, activeIndex, doneHex, pendingHex } = opts;

  const css = `/* Steppers — Figma 167:66289 */
.ds-stepper {
  --ds-step-circle-done: ${doneHex};
  --ds-step-circle-pending: ${pendingHex};
  display: flex;
  gap: 4px;
  font-family: var(--ds-typography-font-family);
}

.ds-stepper__circle {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--ds-color-on-primary);
}

.ds-stepper__circle[data-state="done"],
.ds-stepper__circle[data-state="active"] {
  background: var(--ds-step-circle-done);
}

.ds-stepper__circle[data-state="pending"] {
  background: var(--ds-step-circle-pending);
}

.ds-stepper__circle[data-state="active"] {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--ds-step-circle-done) 15%, transparent);
}`;

  const steps = Array.from({ length: stepCount }, (_, i) => {
    const state =
      i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
    return `  <span class="ds-stepper__circle" data-state="${state}">${i + 1}</span>`;
  }).join("\n");

  return {
    html: `<nav class="ds-stepper" data-layout="${layout}" aria-label="Steps">\n${steps}\n</nav>`,
    css,
  };
}

export function SteppersView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [layout, setLayout] = useState<StepperLayout>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("segment");
  const [position, setPosition] = useState<StepPosition>("step-1");
  const [figmaState, setFigmaState] = useState<FigmaStepState>("focus");
  const [stepCount, setStepCount] = useState(4);
  const [activeStep, setActiveStep] = useState(1);
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [showLabels, setShowLabels] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;
  const themeVars = useMemo(() => stepThemeVars(mode), [mode]);

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

  const previewCardClass = styles.previewCardFit;
  const previewStageClass = `${shell.previewStage} ${styles.previewStageFit}`;

  const segmentLabelText = segmentLabel(position, labels);

  const codeSnippet = useMemo(
    () =>
      buildStepperSnippet({
        layout,
        stepCount,
        activeIndex: activeStep,
        doneHex: stateColors[0].hex,
        pendingHex: stateColors[1].hex,
      }),
    [layout, stepCount, activeStep, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Símbolos Figma 167:66289 por{" "}
          <strong className="font-medium text-[var(--ds-color-text-primary)]">
            Step
          </strong>{" "}
          (Step 1, Next step, Last step) y{" "}
          <strong className="font-medium text-[var(--ds-color-text-primary)]">
            State
          </strong>{" "}
          (Defaul, Focus, Done). Vista segmento alineada al componente; flujo
          completo opcional.
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
              {previewMode === "flow" ? (
                <div className={styles.previewWrap}>
                  <StepperPreview
                    layout={layout}
                    stepCount={stepCount}
                    activeIndex={activeStep}
                    labels={labels}
                    showLabels={showLabels}
                  />
                </div>
              ) : (
                <div className={styles.previewWrap}>
                  <StepSegmentPreview
                    layout={layout}
                    position={position}
                    figmaState={figmaState}
                    label={segmentLabelText}
                    showLabel={showLabels}
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
              <SpecRow
                label="Circle size"
                value="var(--ds-step-circle-size) (minimal: 32px)"
              />
              <SpecRow
                label="Connector"
                value="var(--ds-step-connector-thickness)"
              />
              <SpecRow
                label="Focus ring"
                value="var(--ds-step-focus-ring)"
              />
              <SpecRow label="Layout" value={LAYOUT_LABELS[layout]} />
              <SpecRow label="Step" value={POSITION_LABELS[position]} />
              <SpecRow label="State" value={FIGMA_STATE_LABELS[figmaState]} />
              {previewMode === "flow" ? (
                <>
                  <SpecRow label="Steps" value={String(stepCount)} />
                  <SpecRow label="Active" value={`#${activeStep + 1}`} />
                </>
              ) : null}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Desktop / vertical label"
                value="var(--ds-typography-body-sm) / 500"
              />
              <SpecRow
                label="Default label"
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
            <h3 className={shell.specHeading}>Step states</h3>
            <div className={styles.stateRow}>
              {(
                [
                  { figmaState: "done" as const, label: "Done" },
                  { figmaState: "focus" as const, label: "Focus" },
                  { figmaState: "defaul" as const, label: "Defaul" },
                ] as const
              ).map((row) => (
                <div key={row.figmaState} className={styles.stateItem}>
                  <span className={styles.stateLabel}>{row.label}</span>
                  <StepSegmentPreview
                    layout={layout}
                    position="step-1"
                    figmaState={row.figmaState}
                    label={labels[0]}
                    showLabel={showLabels}
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
              Segmento Figma (Step + State) o flujo completo
            </p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Layout"
            value={layout}
            options={ALL_LAYOUTS.map((l) => ({
              value: l,
              label: LAYOUT_LABELS[l],
            }))}
            onChange={setLayout}
          />

          <SegmentedControl
            label="Preview mode"
            value={previewMode}
            options={[
              { value: "segment", label: "Segment" },
              { value: "flow", label: "Flow" },
            ]}
            onChange={(v) => setPreviewMode(v as PreviewMode)}
          />

          {previewMode === "segment" ? (
            <>
              <SegmentedControl
                label="Step"
                value={position}
                options={ALL_POSITIONS.map((pos) => ({
                  value: pos,
                  label: POSITION_LABELS[pos],
                }))}
                onChange={(v) => setPosition(v as StepPosition)}
              />

              <SegmentedControl
                label="State"
                value={figmaState}
                options={ALL_FIGMA_STATES.map((s) => ({
                  value: s,
                  label: FIGMA_STATE_LABELS[s],
                }))}
                onChange={(v) => setFigmaState(v as FigmaStepState)}
              />
            </>
          ) : null}

          {previewMode === "flow" ? (
            <>
              <SegmentedControl
                label="Step count"
                value={String(stepCount)}
                options={[2, 3, 4, 5].map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                onChange={(v) => {
                  const n = Number(v);
                  setStepCount(n);
                  if (activeStep >= n) setActiveStep(n - 1);
                }}
              />

              <SegmentedControl
                label="Active step"
                value={String(activeStep)}
                options={Array.from({ length: stepCount }, (_, i) => ({
                  value: String(i),
                  label: `#${i + 1}`,
                }))}
                onChange={(v) => setActiveStep(Number(v))}
              />
            </>
          ) : null}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Labels</span>
              <Switch
                checked={showLabels}
                onCheckedChange={setShowLabels}
                disabled={layout === "minimal"}
                aria-label="Mostrar etiquetas"
                style={showLabels ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div className={shell.panelDivider} />

          {(previewMode === "flow"
            ? labels.slice(0, stepCount).map((label, i) => ({
                key: `flow-${i}`,
                fieldLabel: `Step ${i + 1} label`,
                index: i,
                label,
              }))
            : ALL_POSITIONS.map((pos, i) => ({
                key: pos,
                fieldLabel: `${POSITION_LABELS[pos]} label`,
                index: i,
                label: labels[i] ?? "",
              }))
          ).map(({ key, fieldLabel, index, label }) => (
            <div key={`step-label-${key}`}>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                {fieldLabel}
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  setLabels((prev) => {
                    const next = [...prev];
                    next[index] = e.target.value;
                    return next;
                  });
                }}
                className={shell.panelInput}
                disabled={!showLabels || layout === "minimal"}
              />
            </div>
          ))}

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
                <span className={shell.configKey}>Preview</span>
                <span className={shell.configVal}>
                  {previewMode === "segment" ? "Segment" : "Flow"}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Layout</span>
                <span className={shell.configVal}>{LAYOUT_LABELS[layout]}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Step</span>
                <span className={shell.configVal}>
                  {POSITION_LABELS[position]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>
                  {FIGMA_STATE_LABELS[figmaState]}
                </span>
              </div>
              {previewMode === "flow" ? (
                <>
                  <div className={shell.configRow}>
                    <span className={shell.configKey}>Steps</span>
                    <span className={shell.configVal}>{stepCount}</span>
                  </div>
                  <div className={shell.configRow}>
                    <span className={shell.configKey}>Active</span>
                    <span className={shell.configVal}>#{activeStep + 1}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={
            previewMode === "flow"
              ? `Steppers — ${LAYOUT_LABELS[layout]} / ${stepCount} steps`
              : `Steppers — ${LAYOUT_LABELS[layout]} / ${POSITION_LABELS[position]} / ${FIGMA_STATE_LABELS[figmaState]}`
          }
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
