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
import styles from "./drop-input.module.css";

/** Figma Type */
type DropInputType = "label" | "input" | "person";

/** Figma State */
type DropInputState =
  | "Default"
  | "Focused"
  | "Filed"
  | "Error"
  | "Disabled";

const TYPE_LABELS: Record<DropInputType, string> = {
  label: "Label text",
  input: "Input text",
  person: "Person",
};

const STATE_LABELS: Record<DropInputState, string> = {
  Default: "Default",
  Focused: "Focused",
  Filed: "Filed",
  Error: "Error",
  Disabled: "Disabled",
};

const ALL_STATES: DropInputState[] = [
  "Default",
  "Focused",
  "Filed",
  "Error",
  "Disabled",
];

const COLOR_DEFS = [
  {
    label: "Border default",
    cssVar: "--ds-drop-border",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
  {
    label: "Border focus / brand",
    cssVar: "--ds-drop-border-focus",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Border disabled",
    cssVar: "--ds-drop-border-disabled",
    jsonPath: "Border color.border-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", mode),
  },
  {
    label: "Border error",
    cssVar: "--ds-drop-border-error",
    jsonPath: "Border color.border-error",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-error", mode),
  },
  {
    label: "Text placeholder / tertiary",
    cssVar: "--ds-drop-placeholder",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Text secondary",
    cssVar: "--ds-drop-secondary",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Text primary",
    cssVar: "--ds-drop-primary",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Text disabled",
    cssVar: "--ds-drop-disabled-text",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
  {
    label: "Error text",
    cssVar: "--ds-drop-error-text",
    jsonPath: "Text colors.text-error",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-error", mode),
  },
  {
    label: "Required asterisk",
    cssVar: "--ds-drop-required",
    jsonPath: "Text colors.text-error",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-error", mode),
  },
  {
    label: "Subtitle / float label",
    cssVar: "--ds-drop-subtitle",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Background",
    cssVar: "--ds-drop-bg",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
  {
    label: "Avatar surface",
    cssVar: "--ds-drop-avatar-bg",
    jsonPath: "Background.bg-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-primary", mode),
  },
  {
    label: "Avatar icon",
    cssVar: "--ds-drop-avatar-ink",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Chevron",
    cssVar: "--ds-drop-chevron",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Leading icon",
    cssVar: "--ds-drop-leading-icon",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
] as const;

function dropInputThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-drop-bg" as string]: resolveJsonBackgroundColor("bg-container", mode),
    ["--ds-drop-avatar-bg" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-drop-placeholder" as string]: resolveJsonTextColor(
      "text-tertiary",
      mode,
    ),
    ["--ds-drop-secondary" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-drop-primary" as string]: resolveJsonTextColor("text-primary", mode),
    ["--ds-drop-disabled-text" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-drop-error-text" as string]: resolveJsonTextColor("text-error", mode),
    ["--ds-drop-required" as string]: resolveJsonTextColor("text-error", mode),
    ["--ds-drop-subtitle" as string]: resolveJsonTextColor("text-tertiary", mode),
    ["--ds-drop-float-label" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-drop-chevron" as string]: resolveJsonTextColor("text-secondary", mode),
    ["--ds-drop-leading-icon" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-drop-avatar-ink" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function borderForState(
  state: DropInputState,
  mode: "light" | "dark",
): { w: string; color: string } {
  if (state === "Disabled") {
    return {
      w: "1px",
      color: resolveJsonBorderColor("border-secondary", mode),
    };
  }
  if (state === "Error") {
    return {
      w: "2px",
      color: resolveJsonBorderColor("border-error", mode),
    };
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
  state: DropInputState,
  type: DropInputType,
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

export function DropInputField({
  type,
  state,
  valueText,
  floatLabel,
  required,
  showLeadingIcon,
  leadingIconName,
  showDescription,
  descriptionText,
  interactive,
  onMouseDown,
}: {
  type: DropInputType;
  state: DropInputState;
  valueText: string;
  floatLabel: string;
  required: boolean;
  showLeadingIcon: boolean;
  leadingIconName: string;
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
    (type === "person" && state === "Default") ||
    (type === "input" && state === "Default");

  const showAvatarLarge =
    type === "person" && state !== "Default" && state !== "Disabled";

  const showPersonIconSmall =
    type === "person" && (state === "Default" || state === "Disabled");

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
          ["--ds-drop-border-w" as string]: border.w,
          ["--ds-drop-border-color" as string]: border.color,
          ["--ds-drop-value" as string]: valueCol,
        }}
        onMouseDown={onMouseDown}
        aria-haspopup="listbox"
        aria-expanded="false"
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
          {type === "label" && showLeadingIcon && !disabled ? (
            <span
              className={`material-symbols-rounded ${styles.leadingIcon}`}
              aria-hidden
            >
              {leadingIconName}
            </span>
          ) : null}
          {type === "label" && showLeadingIcon && disabled ? (
            <span
              className={`material-symbols-rounded ${styles.leadingIcon}`}
              style={{ color: "var(--ds-drop-disabled-text)" }}
              aria-hidden
            >
              {leadingIconName}
            </span>
          ) : null}

          {showPersonIconSmall ? (
            <span className={styles.avatarSm}>
              <span className={`material-symbols-rounded ${styles.material}`}>
                person
              </span>
            </span>
          ) : null}

          {showAvatarLarge ? (
            <span className={styles.avatar} aria-hidden>
              <span className={`material-symbols-rounded ${styles.material}`}>
                person
              </span>
            </span>
          ) : null}

          <span
            className={styles.value}
            data-tone={isMuted ? "placeholder" : "value"}
          >
            {valueText}
          </span>
        </div>

        <span className={styles.chevron} aria-hidden>
          <span className={`material-symbols-rounded ${styles.material}`}>
            arrow_drop_down
          </span>
        </span>
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

function buildDropInputSnippet(opts: {
  type: DropInputType;
  borderHex: string;
  valueHex: string;
}): { html: string; css: string } {
  const { type, borderHex, valueHex } = opts;
  const css = `/* Drop input — Figma 2:8532 */
.ds-drop-input {
  --ds-drop-border: ${borderHex};
  --ds-drop-value-color: ${valueHex};
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 320px;
  max-width: 100%;
  padding: 14px 14px 14px 12px;
  border: 1px solid var(--ds-drop-border);
  border-radius: 8px;
  font-family: var(--ds-typography-font-family);
  font-size: 16px;
  line-height: 24px;
  background: var(--ds-drop-bg, transparent);
}

.ds-drop-input__value {
  flex: 1;
  min-width: 0;
  color: var(--ds-drop-value-color);
}`;

  const inner =
    type === "input"
      ? '  <span class="ds-drop-input__float">Tipo de documento *</span>\n  <span class="ds-drop-input__value">Label</span>\n  <span class="material-symbols-rounded">arrow_drop_down</span>'
      : type === "person"
        ? '  <span class="material-symbols-rounded">person</span>\n  <span class="ds-drop-input__value">Label</span>\n  <span class="material-symbols-rounded">arrow_drop_down</span>'
        : '  <span class="material-symbols-rounded">search</span>\n  <span class="ds-drop-input__value">Label</span>\n  <span class="material-symbols-rounded">arrow_drop_down</span>';

  return {
    html: `<button type="button" class="ds-drop-input" aria-haspopup="listbox">\n${inner}\n</button>`,
    css,
  };
}

const MATRIX_TYPES: DropInputType[] = ["label", "input", "person"];

export function DropInputView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [dropType, setDropType] = useState<DropInputType>("label");
  const [figmaState, setFigmaState] = useState<DropInputState>("Default");
  const [valueText, setValueText] = useState("Label");
  const [floatLabel, setFloatLabel] = useState("Tipo de documento");
  const [required, setRequired] = useState(true);
  const [showLeadingIcon, setShowLeadingIcon] = useState(true);
  const [leadingIcon, setLeadingIcon] = useState("search");
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("Subtitle");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewFocus, setPreviewFocus] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => dropInputThemeVars(mode), [mode]);

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

  const previewState: DropInputState =
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
      buildDropInputSnippet({
        type: dropType,
        borderHex: stateColors[0].hex,
        valueHex: stateColors[6].hex,
      }),
    [dropType, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Drop input (Figma 2:8532): trigger de select con variantes{" "}
          <strong>Label text</strong>, <strong>Input text</strong> (label flotante)
          y <strong>Person</strong>. Estados Default, Focused, Filed, Error y
          Disabled; helper opcional.
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
              <DropInputField
                type={dropType}
                state={previewState}
                valueText={valueText}
                floatLabel={floatLabel}
                required={required}
                showLeadingIcon={showLeadingIcon}
                leadingIconName={leadingIcon}
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
              <SpecRow label="Width" value="mín. 320px" />
              <SpecRow label="Radius" value="var(--ds-drop-radius)" />
              <SpecRow
                label="Padding"
                value="14px 14px 14px 12px"
              />
              <SpecRow label="Type" value={TYPE_LABELS[dropType]} />
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
              Type × Default — vista compacta; usa el panel para otros estados.
            </p>
            <div className={styles.matrix}>
              {MATRIX_TYPES.map((t) => (
                <div key={t} className={styles.matrixCell}>
                  <span className={styles.matrixLabel}>{TYPE_LABELS[t]}</span>
                  <DropInputField
                    type={t}
                    state="Default"
                    valueText="Label"
                    floatLabel="Tipo de documento"
                    required
                    showLeadingIcon
                    leadingIconName="search"
                    showDescription={false}
                    descriptionText=""
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--ds-color-text-muted)]">
              Todos los estados (Label text)
            </p>
            <div className={styles.stateStrip}>
              {ALL_STATES.map((s) => (
                <DropInputField
                  key={s}
                  type="label"
                  state={s}
                  valueText={s === "Default" ? "Label" : "Label"}
                  floatLabel="Tipo de documento"
                  required
                  showLeadingIcon
                  leadingIconName="search"
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
            <p className={shell.panelHint}>
              Tipo, estado, texto y opciones Figma
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Type"
            value={dropType}
            options={MATRIX_TYPES.map((t) => ({
              value: t,
              label: TYPE_LABELS[t],
            }))}
            onChange={(v) => setDropType(v as DropInputType)}
          />

          <ControlSelect
            label="State"
            value={figmaState}
            options={ALL_STATES.map((s) => ({
              value: s,
              label: STATE_LABELS[s],
            }))}
            onChange={(v) => {
              setFigmaState(v as DropInputState);
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

          {dropType === "input" ? (
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

          {dropType === "label" ? (
            <>
              <div>
                <label className="flex items-center justify-between gap-4">
                  <span className={shell.panelLabel}>Leading icon</span>
                  <Switch
                    checked={showLeadingIcon}
                    onCheckedChange={setShowLeadingIcon}
                    style={showLeadingIcon ? switchOnStyle : undefined}
                  />
                </label>
              </div>
              {showLeadingIcon ? (
                <div>
                  <label className={`${shell.panelLabel} block mb-1.5`}>
                    Icon name
                  </label>
                  <input
                    type="text"
                    value={leadingIcon}
                    onChange={(e) => setLeadingIcon(e.target.value)}
                    className={shell.panelInput}
                    placeholder="search"
                  />
                </div>
              ) : null}
            </>
          ) : null}

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
          title={`Drop input — ${TYPE_LABELS[dropType]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
