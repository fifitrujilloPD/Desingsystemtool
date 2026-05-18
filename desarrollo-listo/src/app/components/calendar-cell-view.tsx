import { Fragment, useState, useMemo } from "react";
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
import styles from "./calendar-cell.module.css";

/** Figma Type= */
type CalendarCellType = "inactive" | "today" | "active" | "selected";
type CalendarCellState = "default" | "hover" | "disabled";
type CalendarRangePosition = "none" | "start" | "middle" | "end" | "single";

const TYPE_LABELS: Record<CalendarCellType, string> = {
  inactive: "Inactive",
  today: "Today's date",
  active: "Active (range)",
  selected: "Selected",
};

const STATE_LABELS: Record<CalendarCellState, string> = {
  default: "Default",
  hover: "Hover",
  disabled: "Disabled",
};

const RANGE_LABELS: Record<CalendarRangePosition, string> = {
  none: "None",
  start: "Range start",
  middle: "Range middle",
  end: "Range end",
  single: "Range single",
};

const MATRIX_COLUMNS: CalendarCellType[] = [
  "inactive",
  "active",
  "selected",
  "today",
];

const MATRIX_ROWS: CalendarCellState[] = ["default", "hover", "disabled"];

const COLOR_DEFS = [
  {
    label: "Day (default)",
    cssVar: "--ds-cal-cell-day",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Day (active / dot)",
    cssVar: "--ds-cal-cell-day-active",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Selected bg",
    cssVar: "--ds-cal-cell-selected-bg",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Selected fg",
    cssVar: "--ds-cal-cell-selected-fg",
    jsonPath: "Text colors.text-primary-white",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-white", mode),
  },
  {
    label: "Hover bg",
    cssVar: "--ds-cal-cell-hover-bg",
    jsonPath: "Background.bg-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-primary", mode),
  },
  {
    label: "Range bg",
    cssVar: "--ds-cal-cell-range-bg",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
  {
    label: "Disabled",
    cssVar: "--ds-cal-cell-disabled-fg",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
] as const;

export function calendarCellThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-cal-cell-day" as string]: resolveJsonTextColor("text-primary", mode),
    ["--ds-cal-cell-day-active" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-cal-cell-selected-bg" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-cal-cell-selected-hover-bg" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-cal-cell-selected-fg" as string]: resolveJsonTextColor(
      "text-primary-white",
      mode,
    ),
    ["--ds-cal-cell-hover-bg" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-cal-cell-range-bg" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-cal-cell-range-bg-disabled" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-cal-cell-disabled-fg" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-cal-cell-dot" as string]: resolveJsonTextColor("text-secondary", mode),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

export function CalendarCellPreview({
  day,
  cellType,
  cellState,
  rangePosition = "none",
  showDot = true,
  cellRole = "day",
  interactive = false,
  onClick,
}: {
  day: number | string;
  cellType: CalendarCellType;
  cellState: CalendarCellState;
  rangePosition?: CalendarRangePosition;
  showDot?: boolean;
  /** Cabeceras de semana (Lu–Do): texto secundario, sin interacción de día. */
  cellRole?: "day" | "weekday";
  interactive?: boolean;
  onClick?: () => void;
}) {
  const range =
    cellType === "active" && rangePosition === "none"
      ? "middle"
      : rangePosition;

  return (
    <button
      type="button"
      className={styles.cell}
      data-type={cellType}
      data-state={cellState}
      data-range={range}
      data-role={cellRole}
      data-has-dot={showDot ? "true" : "false"}
      disabled={cellState === "disabled" && !interactive}
      aria-label={cellRole === "weekday" ? day : `Day ${day}`}
      aria-pressed={cellType === "selected" ? true : undefined}
      onClick={onClick}
    >
      <span className={styles.day}>{day}</span>
      <span className={styles.dot} aria-hidden />
    </button>
  );
}

function matrixRangeFor(type: CalendarCellType): CalendarRangePosition {
  if (type === "active") return "middle";
  return "none";
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

function buildCalendarCellSnippet(opts: {
  day: string;
  cellType: CalendarCellType;
  cellState: CalendarCellState;
  rangePosition: CalendarRangePosition;
  showDot: boolean;
  selectedBg: string;
  selectedFg: string;
}): { html: string; css: string } {
  const { day, cellType, cellState, rangePosition, showDot, selectedBg, selectedFg } =
    opts;
  const range =
    cellType === "active" && rangePosition === "none" ? "middle" : rangePosition;

  const css = `/* Calendar cell — Figma 981:282277 */
.ds-cal-cell {
  --ds-cal-cell-selected-bg: ${selectedBg};
  --ds-cal-cell-selected-fg: ${selectedFg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-family: var(--ds-typography-font-family);
  position: relative;
}

.ds-cal-cell__day {
  font-size: 14px;
  line-height: 20px;
  z-index: 1;
}

.ds-cal-cell[data-type="selected"]::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: var(--ds-cal-cell-selected-bg);
}`;

  return {
    html: `<button type="button" class="ds-cal-cell" data-type="${cellType}" data-state="${cellState}" data-range="${range}" data-has-dot="${showDot}">
  <span class="ds-cal-cell__day">${day}</span>
  ${showDot ? '<span class="ds-cal-cell__dot" aria-hidden></span>' : ""}
</button>`,
    css,
  };
}

export function CalendarCellView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [cellType, setCellType] = useState<CalendarCellType>("selected");
  const [cellState, setCellState] = useState<CalendarCellState>("default");
  const [rangePosition, setRangePosition] =
    useState<CalendarRangePosition>("none");
  const [day, setDay] = useState("1");
  const [showDot, setShowDot] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => calendarCellThemeVars(mode), [mode]);

  const effectiveRange: CalendarRangePosition =
    cellType === "active" ? rangePosition : "none";

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
      buildCalendarCellSnippet({
        day,
        cellType,
        cellState,
        rangePosition: effectiveRange,
        showDot,
        selectedBg: stateColors[2].hex,
        selectedFg: stateColors[3].hex,
      }),
    [day, cellType, cellState, effectiveRange, showDot, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Calendar cell (Figma 981:282277): celda 40×40 con día, punto de evento
          opcional y tipos <strong>Inactive</strong>, <strong>Active</strong>{" "}
          (rango), <strong>Selected</strong> y <strong>Today&apos;s date</strong>.
          Estados Default, Hover y Disabled.
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
            <div className={shell.previewStage}>
              {cellType === "active" ? (
                <div className={styles.previewRow}>
                  {(["start", "middle", "end"] as const).map((pos) => (
                    <CalendarCellPreview
                      key={pos}
                      day={day}
                      cellType="active"
                      cellState={cellState}
                      rangePosition={pos}
                      showDot={showDot}
                      interactive
                    />
                  ))}
                </div>
              ) : (
                <CalendarCellPreview
                  day={day}
                  cellType={cellType}
                  cellState={cellState}
                  rangePosition={effectiveRange}
                  showDot={showDot}
                  interactive
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Size" value="var(--ds-cal-cell-size)" />
              <SpecRow label="Day" value="14px / 20px lh" />
              <SpecRow label="Event dot" value="4px · gap 2px" />
              <SpecRow label="Type" value={TYPE_LABELS[cellType]} />
              <SpecRow label="State" value={STATE_LABELS[cellState]} />
              {cellType === "active" ? (
                <SpecRow
                  label="Range"
                  value={RANGE_LABELS[effectiveRange]}
                />
              ) : null}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.jsonPath} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Matrix (Figma)</h3>
            <p className="mb-4 text-sm text-[var(--ds-color-text-muted)]">
              Type × State — todas las variantes del frame 981:282277
            </p>
            <div className={styles.matrixWithHeaders}>
              <span />
              {MATRIX_COLUMNS.map((col) => (
                <span key={col} className={styles.matrixColHeader}>
                  {TYPE_LABELS[col]}
                </span>
              ))}
              {MATRIX_ROWS.map((row) => (
                <Fragment key={row}>
                  <span className={styles.matrixRowHeader}>
                    {STATE_LABELS[row]}
                  </span>
                  {MATRIX_COLUMNS.map((col) => (
                    <CalendarCellPreview
                      key={`${col}-${row}`}
                      day={1}
                      cellType={col}
                      cellState={row}
                      rangePosition={matrixRangeFor(col)}
                      showDot
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>Type, state, día y rango (Active)</p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="Type"
            value={cellType}
            options={(
              ["inactive", "today", "active", "selected"] as CalendarCellType[]
            ).map((t) => ({
              value: t,
              label: TYPE_LABELS[t],
            }))}
            onChange={(v) => setCellType(v as CalendarCellType)}
          />

          <ControlSelect
            label="State"
            value={cellState}
            options={(
              ["default", "hover", "disabled"] as CalendarCellState[]
            ).map((s) => ({
              value: s,
              label: STATE_LABELS[s],
            }))}
            onChange={(v) => setCellState(v as CalendarCellState)}
          />

          {cellType === "active" ? (
            <ControlSelect
              label="Range position"
              value={rangePosition}
              options={(
                ["start", "middle", "end", "single"] as CalendarRangePosition[]
              ).map((r) => ({
                value: r,
                label: RANGE_LABELS[r],
              }))}
              onChange={(v) => setRangePosition(v as CalendarRangePosition)}
            />
          ) : null}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Event dot</span>
              <Switch
                checked={showDot}
                onCheckedChange={setShowDot}
                aria-label="Mostrar punto de evento"
                style={showDot ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>Day</label>
            <input
              type="text"
              inputMode="numeric"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={shell.panelInput}
              maxLength={2}
            />
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div key={sc.jsonPath} className={shell.configRow}>
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
          title={`Calendar cell — ${TYPE_LABELS[cellType]} / ${STATE_LABELS[cellState]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
