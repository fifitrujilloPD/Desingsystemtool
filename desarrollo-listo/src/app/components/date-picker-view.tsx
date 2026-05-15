import { useState, useMemo, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
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
import styles from "./date-picker.module.css";

/** Figma `type` */
type DatePickerFieldType = "label" | "input";

/** Figma `state` */
type DatePickerState =
  | "Default"
  | "Focused"
  | "Filed"
  | "Error"
  | "Disabled";

const TYPE_LABELS: Record<DatePickerFieldType, string> = {
  label: "Label text",
  input: "Input text",
};

const STATE_LABELS: Record<DatePickerState, string> = {
  Default: "Default",
  Focused: "Focused",
  Filed: "Filed",
  Error: "Error",
  Disabled: "Disabled",
};

const ALL_STATES: DatePickerState[] = [
  "Default",
  "Focused",
  "Filed",
  "Error",
  "Disabled",
];

const COLOR_DEFS = [
  {
    label: "Border default",
    cssVar: "--ds-date-border",
    jsonPath: "Border color.border-primary",
    resolve: (m: "light" | "dark") => resolveJsonBorderColor("border-primary", m),
  },
  {
    label: "Border focus / brand",
    cssVar: "--ds-date-border-focus",
    jsonPath: "Button color.button-color",
    resolve: (m: "light" | "dark") => resolveJsonButtonColor("button-color", m),
  },
  {
    label: "Border disabled",
    cssVar: "--ds-date-border-disabled",
    jsonPath: "Border color.border-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", m),
  },
  {
    label: "Border error",
    cssVar: "--ds-date-border-error",
    jsonPath: "Border color.border-error",
    resolve: (m: "light" | "dark") => resolveJsonBorderColor("border-error", m),
  },
  {
    label: "Text tertiary",
    cssVar: "--ds-date-placeholder",
    jsonPath: "Text colors.text-tertiary",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-tertiary", m),
  },
  {
    label: "Text secondary",
    cssVar: "--ds-date-secondary",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-secondary", m),
  },
  {
    label: "Text primary",
    cssVar: "--ds-date-primary",
    jsonPath: "Text colors.text-primary",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-primary", m),
  },
  {
    label: "Text disabled",
    cssVar: "--ds-date-disabled-text",
    jsonPath: "Text colors.text-disabled",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-disabled", m),
  },
  {
    label: "Error text",
    cssVar: "--ds-date-error-text",
    jsonPath: "Text colors.text-error",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-error", m),
  },
  {
    label: "Required asterisk",
    cssVar: "--ds-date-required",
    jsonPath: "Text colors.text-error",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-error", m),
  },
  {
    label: "Subtitle",
    cssVar: "--ds-date-subtitle",
    jsonPath: "Text colors.text-tertiary",
    resolve: (m: "light" | "dark") => resolveJsonTextColor("text-tertiary", m),
  },
  {
    label: "Background field",
    cssVar: "--ds-date-bg",
    jsonPath: "Background.bg-container",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", m),
  },
  {
    label: "Calendar icon",
    cssVar: "--ds-date-calendar-icon",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", m),
  },
] as const;

function datePickerThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-date-bg" as string]: resolveJsonBackgroundColor("bg-container", mode),
    ["--ds-date-placeholder" as string]: resolveJsonTextColor(
      "text-tertiary",
      mode,
    ),
    ["--ds-date-secondary" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-date-primary" as string]: resolveJsonTextColor("text-primary", mode),
    ["--ds-date-disabled-text" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-date-error-text" as string]: resolveJsonTextColor("text-error", mode),
    ["--ds-date-required" as string]: resolveJsonTextColor("text-error", mode),
    ["--ds-date-subtitle" as string]: resolveJsonTextColor("text-tertiary", mode),
    ["--ds-date-float-label" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-date-calendar-icon" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function borderForState(
  state: DatePickerState,
  mode: "light" | "dark",
): { w: string; color: string } {
  if (state === "Disabled") {
    return {
      w: "1px",
      color: resolveJsonBorderColor("border-secondary", mode),
    };
  }
  if (state === "Error") {
    return { w: "2px", color: resolveJsonBorderColor("border-error", mode) };
  }
  if (state === "Focused") {
    return {
      w: "2px",
      color: resolveJsonButtonColor("button-color", mode),
    };
  }
  return {
    w: "1px",
    color: resolveJsonBorderColor("border-primary", mode),
  };
}

function valueColor(
  state: DatePickerState,
  type: DatePickerFieldType,
  isMuted: boolean,
  mode: "light" | "dark",
): string {
  if (state === "Disabled") {
    return resolveJsonTextColor("text-disabled", mode);
  }
  if (isMuted) {
    if (type === "input" && state === "Default") {
      return resolveJsonTextColor("text-secondary", mode);
    }
    return resolveJsonTextColor("text-tertiary", mode);
  }
  return resolveJsonTextColor("text-primary", mode);
}

export function DatePickerField({
  type,
  state,
  valueText,
  floatLabel,
  required,
  showIcon,
  showDescription,
  descriptionText,
  interactive,
  onMouseDown,
}: {
  type: DatePickerFieldType;
  state: DatePickerState;
  valueText: string;
  floatLabel: string;
  required: boolean;
  showIcon: boolean;
  showDescription: boolean;
  descriptionText: string;
  interactive?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";
  const border = borderForState(state, mode);
  const disabled = state === "Disabled";
  const isMuted =
    (type === "label" && state === "Default") ||
    (type === "input" && state === "Default");

  const valueCol = valueColor(state, type, isMuted, mode);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.field}
        data-type={type}
        data-state={state}
        data-interactive={interactive && !disabled ? "true" : "false"}
        disabled={disabled && !interactive}
        style={{
          ["--ds-date-border-w" as string]: border.w,
          ["--ds-date-border-color" as string]: border.color,
          ["--ds-date-value" as string]: valueCol,
        }}
        onMouseDown={onMouseDown}
        aria-label={type === "input" ? floatLabel : valueText}
      >
        {type === "input" ? (
          <span className={styles.floatWrap} aria-hidden>
            <span className={styles.floatText}>{floatLabel}</span>
            {required ? (
              <span className={styles.required} aria-hidden>
                *
              </span>
            ) : null}
          </span>
        ) : null}

        <div className={styles.row}>
          {showIcon && !disabled ? (
            <span
              className={`material-symbols-rounded ${styles.leadingIcon}`}
              aria-hidden
            >
              calendar_today
            </span>
          ) : null}
          {showIcon && disabled ? (
            <span
              className={`material-symbols-rounded ${styles.leadingIcon}`}
              style={{ color: "var(--ds-date-disabled-text)" }}
              aria-hidden
            >
              calendar_today
            </span>
          ) : null}

          <span
            className={styles.value}
            data-tone={isMuted ? "placeholder" : "value"}
          >
            {valueText}
          </span>
        </div>
      </button>

      {showDescription ? (
        <p
          className={styles.subtitle}
          data-tone={state === "Error" ? "error" : "default"}
        >
          {state === "Error" ? descriptionText || "Subtitle" : descriptionText}
        </p>
      ) : null}
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

function buildDatePickerSnippet(opts: {
  type: DatePickerFieldType;
  borderHex: string;
  valueHex: string;
}): { html: string; css: string } {
  const { type, borderHex, valueHex } = opts;
  const css = `/* Date picker field — Figma 977:294082 */
.ds-date-field {
  --ds-date-border-color: ${borderHex};
  --ds-date-value-color: ${valueHex};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 320px;
  max-width: 320px;
  padding: 14px 14px 14px 12px;
  border: 1px solid var(--ds-date-border-color);
  border-radius: 8px;
  font-family: var(--ds-typography-font-family);
  font-size: 16px;
  line-height: 24px;
  background: var(--ds-date-bg, transparent);
}

.ds-date-field__value {
  flex: 1;
  min-width: 0;
  color: var(--ds-date-value-color);
}`;

  const inner =
    type === "input"
      ? `  <span class="ds-date-field__float">Tipo de documento *</span>\n  <span class="material-symbols-rounded">calendar_today</span>\n  <span class="ds-date-field__value">dd/mm/aa</span>`
      : `  <span class="material-symbols-rounded">calendar_today</span>\n  <span class="ds-date-field__value">dd/mm/aa</span>`;

  return {
    html: `<button type="button" class="ds-date-field">\n${inner}\n</button>`,
    css,
  };
}

const MATRIX_TYPES: DatePickerFieldType[] = ["label", "input"];

export function DatePickerView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [fieldType, setFieldType] = useState<DatePickerFieldType>("label");
  const [figmaState, setFigmaState] = useState<DatePickerState>("Default");
  const [valueText, setValueText] = useState("dd/mm/aa");
  const [floatLabel, setFloatLabel] = useState("Tipo de documento");
  const [required, setRequired] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("Subtitle");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewFocus, setPreviewFocus] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => datePickerThemeVars(mode), [mode]);

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

  const previewState: DatePickerState =
    previewFocus && figmaState !== "Disabled" && figmaState !== "Error"
      ? "Focused"
      : figmaState;

  useEffect(() => {
    if (!previewFocus) return;
    let clearListener: (() => void) | undefined;
    const t = window.setTimeout(() => {
      const onDocPointerDown = () => setPreviewFocus(false);
      document.addEventListener("pointerdown", onDocPointerDown);
      clearListener = () =>
        document.removeEventListener("pointerdown", onDocPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(t);
      clearListener?.();
    };
  }, [previewFocus]);

  const codeSnippet = useMemo(
    () =>
      buildDatePickerSnippet({
        type: fieldType,
        borderHex: stateColors[0].hex,
        valueHex: stateColors[6].hex,
      }),
    [fieldType, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Date picker (Figma 977:294082): solo el{" "}
          <strong>campo de entrada</strong> con icono{" "}
          <strong>calendar_today</strong>, variantes <strong>Label text</strong>{" "}
          e <strong>Input text</strong> (label flotante y requerido opcional),
          estados Default, Focused, Filed, Error y Disabled; helper opcional.
          Sin panel ni drop de calendario en esta vista del catálogo.
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
              <DatePickerField
                type={fieldType}
                state={previewState}
                valueText={valueText}
                floatLabel={floatLabel}
                required={required}
                showIcon={showIcon}
                showDescription={showDescription}
                descriptionText={descriptionText}
                interactive={figmaState !== "Disabled"}
                onMouseDown={(e) => {
                  if (figmaState === "Disabled") return;
                  e.preventDefault();
                  e.stopPropagation();
                  setPreviewFocus(true);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Width" value="320px" />
              <SpecRow label="Radius" value="8px" />
              <SpecRow label="Padding" value="14px 14px 14px 12px" />
              <SpecRow label="Icon" value="24px (Material calendar_today)" />
              <SpecRow label="Type" value={TYPE_LABELS[fieldType]} />
              <SpecRow label="State (panel)" value={STATE_LABELS[figmaState]} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Value" value="16px / 400 / 24px lh" />
              <SpecRow label="Floating label" value="12px (Input text)" />
              <SpecRow label="Helper" value="14px / 20px lh" />
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
              Tipo × todos los estados (icono y subtítulo off en galería).
            </p>
            <div className={styles.matrix}>
              {MATRIX_TYPES.map((t) => (
                <div key={t} className={styles.matrixCell}>
                  <span className={styles.matrixLabel}>{TYPE_LABELS[t]}</span>
                  <div className={styles.matrixStack}>
                    {ALL_STATES.map((s) => (
                      <DatePickerField
                        key={s}
                        type={t}
                        state={s}
                        valueText="dd/mm/aa"
                        floatLabel="Tipo de documento"
                        required
                        showIcon
                        showDescription={s === "Error"}
                        descriptionText="Subtitle"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--ds-color-text-muted)]">
              Estados (Label text) — strip
            </p>
            <div className={styles.stateStrip}>
              {ALL_STATES.map((s) => (
                <DatePickerField
                  key={s}
                  type="label"
                  state={s}
                  valueText="dd/mm/aa"
                  floatLabel="Tipo de documento"
                  required
                  showIcon
                  showDescription={s === "Error"}
                  descriptionText="Subtitle"
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
            <p className={shell.panelHint}>Tipo, estado y opciones Figma</p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Type"
            value={fieldType}
            options={MATRIX_TYPES.map((t) => ({
              value: t,
              label: TYPE_LABELS[t],
            }))}
            onChange={(v) => setFieldType(v as DatePickerFieldType)}
          />

          <ControlSelect
            label="State"
            value={figmaState}
            options={ALL_STATES.map((s) => ({
              value: s,
              label: STATE_LABELS[s],
            }))}
            onChange={(v) => {
              setFigmaState(v as DatePickerState);
              setPreviewFocus(false);
            }}
          />

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>Value</label>
            <input
              type="text"
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              className={shell.panelInput}
              disabled={figmaState === "Disabled"}
            />
          </div>

          {fieldType === "input" ? (
            <>
              <div>
                <label className={`${shell.panelLabel} block mb-1.5`}>
                  Floating label
                </label>
                <input
                  type="text"
                  value={floatLabel}
                  onChange={(e) => setFloatLabel(e.target.value)}
                  className={shell.panelInput}
                />
              </div>
              <div>
                <label className="flex items-center justify-between gap-4">
                  <span className={shell.panelLabel}>Required *</span>
                  <Switch
                    checked={required}
                    onCheckedChange={setRequired}
                    style={required ? switchOnStyle : undefined}
                  />
                </label>
              </div>
            </>
          ) : null}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Calendar icon</span>
              <Switch
                checked={showIcon}
                onCheckedChange={setShowIcon}
                style={showIcon ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Helper text</span>
              <Switch
                checked={showDescription}
                onCheckedChange={setShowDescription}
                style={showDescription ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showDescription ? (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Helper copy
              </label>
              <input
                type="text"
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          ) : null}

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
          title={`Date picker — ${TYPE_LABELS[fieldType]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
