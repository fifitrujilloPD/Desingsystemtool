import { useState, useMemo, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import styles from "./radio-button.module.css";

type RadioState = "Enabled" | "Hover" | "Focus" | "Pressed" | "Disabled";

const RADIO_STATE_ATTR: Record<RadioState, string> = {
  Enabled: "enabled",
  Hover: "hover",
  Focus: "focus",
  Pressed: "pressed",
  Disabled: "disabled",
};

const RADIO_COLOR_DEFS = [
  {
    label: "Selected",
    cssVar: "--ds-color-brand",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Unselected",
    cssVar: "--ds-color-control-ink",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") => resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Hover (selected)",
    cssVar: "--ds-color-brand-hover",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Focus ring",
    cssVar: "--ds-color-brand",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") => resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Label disabled",
    cssVar: "--ds-color-control-ink-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
] as const;

function RadioButtonPreview({
  radioState,
  isSelected,
  labelText,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  radioState: RadioState;
  isSelected: boolean;
  labelText: string;
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseDown?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseUp?: React.MouseEventHandler<HTMLLabelElement>;
}) {
  const isDisabled = radioState === "Disabled";
  const stateAttr =
    radioState === "Enabled" ? "enabled" : RADIO_STATE_ATTR[radioState];

  return (
    <label
      className={styles.radio}
      data-selected={isSelected ? "true" : "false"}
      data-state={stateAttr}
      data-disabled={isDisabled ? "true" : "false"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <span className={styles.touchTarget}>
        <span className={styles.stateLayer}>
          <span className={styles.outer}>
            <span className={styles.inner} />
          </span>
        </span>
      </span>
      {labelText ? <span className={styles.label}>{labelText}</span> : null}
    </label>
  );
}

function StateColorCard({
  label,
  hex,
  cssVar,
  jsonPath,
}: {
  label: string;
  hex: string;
  cssVar: string;
  jsonPath: string;
}) {
  return (
    <div className={styles.tokenRow}>
      <div
        className={styles.tokenSwatch}
        style={{ backgroundColor: `var(${cssVar})` }}
        title={hex}
      />
      <div className="min-w-0">
        <p className={styles.tokenTitle}>{label}</p>
        <p className={styles.tokenMeta}>
          var({cssVar}) · JSON {jsonPath}
        </p>
        <p className={styles.tokenHex}>{hex}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.specRow}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}</span>
    </div>
  );
}

function buildRadioSnippet(opts: {
  radioState: RadioState;
  isSelected: boolean;
  showLabel: boolean;
  labelText: string;
  showGroup: boolean;
  groupLabels: string[];
  selectedIndex: number;
}): { html: string; css: string } {
  const {
    radioState,
    isSelected,
    showLabel,
    labelText,
    showGroup,
    groupLabels,
    selectedIndex,
  } = opts;
  const stateAttr = RADIO_STATE_ATTR[radioState];
  const disabled = radioState === "Disabled";

  const baseCss = `/* Radio button — Figma 7:16556 · tokens Feature 02 */
.ds-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-radio-label-gap, 6px);
  cursor: ${disabled ? "not-allowed" : "pointer"};
}

.ds-radio[data-disabled="true"] {
  opacity: var(--ds-radio-disabled-opacity, 0.38);
  cursor: not-allowed;
}

.ds-radio[data-selected="true"] {
  --ds-radio-ring-color: var(--ds-color-brand);
}

.ds-radio[data-selected="false"] {
  --ds-radio-ring-color: var(--ds-color-control-ink);
}

.ds-radio__touch {
  width: var(--ds-radio-touch-target, 48px);
  height: var(--ds-radio-touch-target, 48px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-radio__state-layer {
  width: var(--ds-radio-state-layer, 40px);
  height: var(--ds-radio-state-layer, 40px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-radio[data-state="hover"] .ds-radio__state-layer {
  background: color-mix(in srgb, var(--ds-radio-ring-color) 8%, transparent);
}

.ds-radio[data-state="focus"] .ds-radio__state-layer,
.ds-radio[data-state="pressed"] .ds-radio__state-layer {
  background: color-mix(in srgb, var(--ds-radio-ring-color) 12%, transparent);
}

.ds-radio__outer {
  width: var(--ds-radio-outer-size, 20px);
  height: var(--ds-radio-outer-size, 20px);
  border-radius: 50%;
  border: var(--ds-radio-border-width, 2px) solid var(--ds-radio-ring-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.ds-radio__inner {
  width: var(--ds-radio-inner-dot, 10px);
  height: var(--ds-radio-inner-dot, 10px);
  border-radius: 50%;
  background: var(--ds-radio-ring-color);
  transform: scale(0);
}

.ds-radio[data-selected="true"] .ds-radio__inner {
  transform: scale(1);
}

.ds-radio__label {
  font-family: var(--ds-typography-font-family);
  font-size: var(--ds-typography-body-md-font-size);
  color: var(--ds-color-control-ink);
}

.ds-radio[data-disabled="true"] .ds-radio__label {
  color: var(--ds-color-control-ink-muted);
}`;

  const itemHtml = (selected: boolean, label: string) => {
    const labelBlock =
      showLabel && label
        ? `\n  <span class="ds-radio__label">${label}</span>`
        : "";
    return `<label class="ds-radio" data-selected="${selected}" data-state="${stateAttr}" data-disabled="${disabled}">
  <span class="ds-radio__touch">
    <span class="ds-radio__state-layer">
      <span class="ds-radio__outer"><span class="ds-radio__inner"></span></span>
    </span>
  </span>${labelBlock}
  <input type="radio" name="group"${selected ? " checked" : ""} hidden />
</label>`;
  };

  if (showGroup) {
    const items = groupLabels
      .map((label, i) => `  ${itemHtml(i === selectedIndex, label)}`)
      .join("\n");
    return {
      html: `<div role="radiogroup" class="ds-radio-group">\n${items}\n</div>`,
      css: `${baseCss}\n\n.ds-radio-group {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}`,
    };
  }

  return {
    html: itemHtml(isSelected, showLabel ? labelText : ""),
    css: baseCss,
  };
}

export function RadioButtonView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [radioState, setRadioState] = useState<RadioState>("Enabled");
  const [isSelected, setIsSelected] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [labelText, setLabelText] = useState("Option label");
  const [showGroup, setShowGroup] = useState(false);
  const [groupLabels] = useState([
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const [previewPressed, setPreviewPressed] = useState(false);

  const effectiveState: RadioState =
    radioState === "Enabled"
      ? previewPressed
        ? "Pressed"
        : previewHover
          ? "Hover"
          : "Enabled"
      : radioState;

  useEffect(() => {
    if (radioState !== "Enabled") {
      setPreviewHover(false);
      setPreviewPressed(false);
    }
  }, [radioState]);

  const stateColors = useMemo(
    () =>
      RADIO_COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  const codeSnippet = useMemo(
    () =>
      buildRadioSnippet({
        radioState,
        isSelected,
        showLabel,
        labelText,
        showGroup,
        groupLabels,
        selectedIndex,
      }),
    [
      radioState,
      isSelected,
      showLabel,
      labelText,
      showGroup,
      groupLabels,
      selectedIndex,
    ],
  );

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;
  const isChecked = showGroup ? selectedIndex >= 0 : isSelected;

  const previewHandlers = {
    onMouseEnter: () => {
      if (radioState === "Enabled") setPreviewHover(true);
    },
    onMouseLeave: () => {
      if (radioState === "Enabled") {
        setPreviewHover(false);
        setPreviewPressed(false);
      }
    },
    onMouseDown: () => {
      if (radioState === "Enabled") setPreviewPressed(true);
    },
    onMouseUp: () => {
      if (radioState === "Enabled") setPreviewPressed(false);
    },
  };

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={styles.intro}>
          Explora, entiende y configura el componente radio button del sistema
          de diseño. Colores vía{" "}
          <code className="font-mono text-[length:inherit]">var(--ds-*)</code>{" "}
          alineados a Feature 02 (Figma 7:16556).
        </p>

        <div className="mb-4">
          <div className={styles.previewCard}>
            <div className={styles.previewDivider} />
            <div className={styles.previewToolbar}>
              <h2 className={styles.previewTitle}>Preview</h2>
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className={styles.codeButton}
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.previewStage}>
              {showGroup ? (
                <div className={styles.radioGroup}>
                  {groupLabels.map((label, i) => (
                    <div
                      key={label}
                      onClick={() => {
                        if (radioState !== "Disabled") setSelectedIndex(i);
                      }}
                    >
                      <RadioButtonPreview
                        radioState={effectiveState}
                        isSelected={i === selectedIndex}
                        labelText={showLabel ? label : ""}
                        {...previewHandlers}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (radioState !== "Disabled") setIsSelected(!isSelected);
                  }}
                >
                  <RadioButtonPreview
                    radioState={effectiveState}
                    isSelected={isSelected}
                    labelText={showLabel ? labelText : ""}
                    {...previewHandlers}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={styles.specCard}>
            <h3 className={styles.specHeading}>Typography (Label)</h3>
            <div className={styles.specDivider}>
              <SpecRow
                label="Font family"
                value="var(--ds-typography-font-family)"
              />
              <SpecRow
                label="Font size"
                value="var(--ds-typography-body-md-font-size)"
              />
              <SpecRow label="Font weight" value="400 (Regular)" />
              <SpecRow label="Line height" value="1.5" />
            </div>
          </div>

          <div className={styles.specCard}>
            <h3 className={styles.specHeading}>Radio Control</h3>
            <div className={styles.specDivider}>
              <SpecRow label="Outer size" value="var(--ds-radio-outer-size)" />
              <SpecRow label="Inner dot" value="var(--ds-radio-inner-dot)" />
              <SpecRow label="Border radius" value="50% (Circle)" />
              <SpecRow
                label="Border width"
                value="var(--ds-radio-border-width)"
              />
              <SpecRow
                label="Touch target"
                value="var(--ds-radio-touch-target)"
              />
              <SpecRow
                label="State layer"
                value="var(--ds-radio-state-layer)"
              />
              <SpecRow label="Label gap" value="var(--ds-radio-label-gap)" />
            </div>
          </div>

          <div className={styles.specCard}>
            <h3 className={styles.specHeading}>Colors (States)</h3>
            <div className={styles.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          <div className={styles.specCard}>
            <h3 className={styles.specHeading}>All States</h3>
            <div className="grid grid-cols-2 gap-6">
              {(
                [
                  "Enabled",
                  "Hover",
                  "Focus",
                  "Pressed",
                  "Disabled",
                ] as RadioState[]
              ).map((state) => (
                <div key={state} className="space-y-3">
                  <p className={styles.stateGallerySection}>{state}</p>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <RadioButtonPreview
                        radioState={state}
                        isSelected
                        labelText=""
                      />
                      <span className={styles.stateGalleryLabel}>
                        Selected
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <RadioButtonPreview
                        radioState={state}
                        isSelected={false}
                        labelText=""
                      />
                      <span className={styles.stateGalleryLabel}>
                        Unselected
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={styles.panelTitle}>Controls</h2>
            <p className={styles.panelHint}>
              Configure the radio button properties
            </p>
          </div>

          <div className={styles.panelDivider} />

          <SegmentedControl
            label="State"
            value={radioState}
            options={[
              { value: "Enabled", label: "Default" },
              { value: "Hover", label: "Hover" },
              { value: "Focus", label: "Focus" },
              { value: "Pressed", label: "Press" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setRadioState}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={styles.panelLabel}>Selected</span>
              <Switch
                checked={isChecked}
                onCheckedChange={(v) => {
                  if (showGroup) setSelectedIndex(v ? 0 : -1);
                  else setIsSelected(v);
                }}
                aria-label="Toggle selection"
                style={isChecked ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div className={styles.panelDivider} />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={styles.panelLabel}>Radio Group</span>
              <Switch
                checked={showGroup}
                onCheckedChange={setShowGroup}
                aria-label="Toggle radio group"
                style={showGroup ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showGroup && (
            <SegmentedControl
              label="Active Option"
              value={String(selectedIndex)}
              options={groupLabels.map((_, i) => ({
                value: String(i),
                label: `#${i + 1}`,
              }))}
              onChange={(v) => setSelectedIndex(Number(v))}
            />
          )}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={styles.panelLabel}>Label Text</span>
              <Switch
                checked={showLabel}
                onCheckedChange={setShowLabel}
                aria-label="Toggle label text"
                style={showLabel ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {!showGroup && showLabel && (
            <div>
              <label className={`${styles.panelLabel} block mb-1.5`}>
                Label Text
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className={styles.panelInput}
              />
            </div>
          )}

          <div className={styles.panelDivider} />

          <div>
            <label className={`${styles.panelLabel} block mb-2`}>
              Current Config
            </label>
            <div className={styles.configBox}>
              <div className={styles.configRow}>
                <span className={styles.configKey}>State</span>
                <span className={styles.configVal}>{radioState}</span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configKey}>Selected</span>
                <span className={styles.configVal}>
                  {showGroup
                    ? selectedIndex >= 0
                      ? `Option ${selectedIndex + 1}`
                      : "None"
                    : isSelected
                      ? "Yes"
                      : "No"}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configKey}>Mode</span>
                <span className={styles.configVal}>
                  {showGroup ? "Group" : "Single"}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configKey}>Label</span>
                <span className={styles.configVal}>
                  {showLabel ? "On" : "Off"}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configKey}>Ring (selected)</span>
                <span className={styles.configValMono}>--ds-color-brand</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Radio Button — ${radioState} / ${isSelected ? "Selected" : "Unselected"}${showGroup ? " (Group)" : ""}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
