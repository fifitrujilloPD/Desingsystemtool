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
import shell from "./radio-button.module.css";
import styles from "./checkbox.module.css";

type CheckboxState = "Enabled" | "Hover" | "Focus" | "Pressed" | "Disabled";
type CheckboxType = "Selected" | "Unselected" | "Indeterminate";

const CHECKBOX_STATE_ATTR: Record<CheckboxState, string> = {
  Enabled: "enabled",
  Hover: "hover",
  Focus: "focus",
  Pressed: "pressed",
  Disabled: "disabled",
};

const CHECKBOX_TYPE_ATTR: Record<CheckboxType, string> = {
  Selected: "selected",
  Unselected: "unselected",
  Indeterminate: "indeterminate",
};

const CHECKBOX_COLOR_DEFS = [
  {
    label: "Selected / Indeterminate",
    cssVar: "--ds-color-brand",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Unselected (border)",
    cssVar: "--ds-color-control-ink-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Hover (filled)",
    cssVar: "--ds-color-brand-hover",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Disabled (fill)",
    cssVar: "--ds-color-control-ink",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Check / dash icon",
    cssVar: "--ds-color-on-primary",
    jsonPath: "Text colors.text-primary-white",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-white", mode),
  },
] as const;

/** Material `check_small` — bounds Figma ~25% L/R, ~29% top / ~32% bottom en 24dp */
function CheckboxCheckIcon() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      />
    </svg>
  );
}

/** Material `check_indeterminate_small` — dash centrado ~45.83% vertical en 24dp */
function CheckboxIndeterminateIcon() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M19 13H5v-2h14v2z" />
    </svg>
  );
}

const CHECK_SVG =
  '<svg class="ds-checkbox__icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';
const INDETERMINATE_SVG =
  '<svg class="ds-checkbox__icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 13H5v-2h14v2z"/></svg>';

function CheckboxPreview({
  checkboxState,
  checkboxType,
  labelText,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  checkboxState: CheckboxState;
  checkboxType: CheckboxType;
  labelText: string;
  onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseDown?: React.MouseEventHandler<HTMLLabelElement>;
  onMouseUp?: React.MouseEventHandler<HTMLLabelElement>;
}) {
  const isDisabled = checkboxState === "Disabled";
  const stateAttr =
    checkboxState === "Enabled"
      ? "enabled"
      : CHECKBOX_STATE_ATTR[checkboxState];
  const typeAttr = CHECKBOX_TYPE_ATTR[checkboxType];

  return (
    <label
      className={styles.checkbox}
      data-type={typeAttr}
      data-state={stateAttr}
      data-disabled={isDisabled ? "true" : "false"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <span className={styles.touchTarget}>
        <span className={styles.stateLayer}>
          <span className={styles.box} aria-hidden />
          {checkboxType === "Selected" ? (
            <span className={styles.iconOverlay} aria-hidden>
              <CheckboxCheckIcon />
            </span>
          ) : null}
          {checkboxType === "Indeterminate" ? (
            <span className={styles.iconOverlay} aria-hidden>
              <CheckboxIndeterminateIcon />
            </span>
          ) : null}
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
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: `var(${cssVar})` }}
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

function buildCheckboxSnippet(opts: {
  checkboxState: CheckboxState;
  checkboxType: CheckboxType;
  showLabel: boolean;
  labelText: string;
  showGroup: boolean;
  groupItems: string[];
  groupChecked: boolean[];
}): { html: string; css: string } {
  const {
    checkboxState,
    checkboxType,
    showLabel,
    labelText,
    showGroup,
    groupItems,
    groupChecked,
  } = opts;
  const stateAttr = CHECKBOX_STATE_ATTR[checkboxState];
  const disabled = checkboxState === "Disabled";

  const baseCss = `/* Checkbox — Figma 6:6708 · tokens Feature 02 */
.ds-checkbox {
  --ds-checkbox-icon-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: var(--ds-checkbox-label-gap, 6px);
  cursor: ${disabled ? "not-allowed" : "pointer"};
}

.ds-checkbox[data-disabled="true"] {
  opacity: var(--ds-checkbox-disabled-opacity, 0.38);
  cursor: not-allowed;
}

.ds-checkbox[data-type="selected"],
.ds-checkbox[data-type="indeterminate"] {
  --ds-checkbox-state-color: var(--ds-color-brand);
}

.ds-checkbox[data-type="unselected"] {
  --ds-checkbox-state-color: var(--ds-color-control-ink);
}

.ds-checkbox__touch {
  width: var(--ds-checkbox-touch-target, 48px);
  height: var(--ds-checkbox-touch-target, 48px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-checkbox__state-layer {
  position: relative;
  width: var(--ds-checkbox-state-layer, 40px);
  height: var(--ds-checkbox-state-layer, 40px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-checkbox[data-state="hover"] .ds-checkbox__state-layer {
  background: color-mix(in srgb, var(--ds-checkbox-state-color) 8%, transparent);
}

.ds-checkbox[data-state="focus"] .ds-checkbox__state-layer,
.ds-checkbox[data-state="pressed"] .ds-checkbox__state-layer {
  background: color-mix(in srgb, var(--ds-checkbox-state-color) 12%, transparent);
}

.ds-checkbox__box {
  width: var(--ds-checkbox-size, 18px);
  height: var(--ds-checkbox-size, 18px);
  border-radius: var(--ds-checkbox-radius, 2px);
  box-sizing: border-box;
}

.ds-checkbox__icon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--ds-checkbox-icon-size, 14px);
  height: var(--ds-checkbox-icon-size, 14px);
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-on-primary);
  pointer-events: none;
}

.ds-checkbox__icon-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.ds-checkbox[data-type="selected"] .ds-checkbox__box,
.ds-checkbox[data-type="indeterminate"] .ds-checkbox__box {
  background: var(--ds-color-brand);
  border: none;
}

.ds-checkbox[data-disabled="true"][data-type="selected"] .ds-checkbox__box,
.ds-checkbox[data-disabled="true"][data-type="indeterminate"] .ds-checkbox__box {
  background: var(--ds-color-control-ink);
}

.ds-checkbox[data-type="unselected"] .ds-checkbox__box {
  background: transparent;
  border: var(--ds-checkbox-border-width, 2px) solid var(--ds-color-control-ink-muted);
}

.ds-checkbox[data-disabled="true"][data-type="unselected"] .ds-checkbox__box {
  border-color: var(--ds-color-control-ink);
}

.ds-checkbox__label {
  font-family: var(--ds-typography-font-family);
  font-size: var(--ds-typography-body-md-font-size);
  color: var(--ds-color-control-ink);
}

.ds-checkbox[data-disabled="true"] .ds-checkbox__label {
  color: var(--ds-color-control-ink-muted);
}`;

  const itemHtml = (type: CheckboxType, label: string, checked: boolean) => {
    const typeAttr = CHECKBOX_TYPE_ATTR[type];
    const labelBlock =
      showLabel && label
        ? `\n  <span class="ds-checkbox__label">${label}</span>`
        : "";
    const iconOverlay =
      type === "Selected"
        ? `\n      <span class="ds-checkbox__icon">${CHECK_SVG}</span>`
        : type === "Indeterminate"
          ? `\n      <span class="ds-checkbox__icon">${INDETERMINATE_SVG}</span>`
          : "";
    return `<label class="ds-checkbox" data-type="${typeAttr}" data-state="${stateAttr}" data-disabled="${disabled}">
  <span class="ds-checkbox__touch">
    <span class="ds-checkbox__state-layer">
      <span class="ds-checkbox__box"></span>${iconOverlay}
    </span>
  </span>${labelBlock}
  <input type="checkbox"${checked ? " checked" : ""} hidden />
</label>`;
  };

  if (showGroup) {
    const items = groupItems
      .map((label, i) => {
        const type: CheckboxType = groupChecked[i] ? "Selected" : "Unselected";
        return `  ${itemHtml(type, label, groupChecked[i])}`;
      })
      .join("\n");
    return {
      html: `<div role="group" class="ds-checkbox-group">\n${items}\n</div>`,
      css: `${baseCss}\n\n.ds-checkbox-group {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}`,
    };
  }

  return {
    html: itemHtml(
      checkboxType,
      showLabel ? labelText : "",
      checkboxType === "Selected",
    ),
    css: baseCss,
  };
}

export function CheckboxView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [checkboxState, setCheckboxState] =
    useState<CheckboxState>("Enabled");
  const [checkboxType, setCheckboxType] =
    useState<CheckboxType>("Selected");
  const [showLabel, setShowLabel] = useState(true);
  const [labelText, setLabelText] = useState("Option label");
  const [showGroup, setShowGroup] = useState(false);
  const [groupItems] = useState([
    "Option A",
    "Option B",
    "Option C",
    "Option D",
  ]);
  const [groupChecked, setGroupChecked] = useState<boolean[]>([
    true,
    false,
    true,
    false,
  ]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const [previewPressed, setPreviewPressed] = useState(false);

  const effectiveState: CheckboxState =
    checkboxState === "Enabled"
      ? previewPressed
        ? "Pressed"
        : previewHover
          ? "Hover"
          : "Enabled"
      : checkboxState;

  useEffect(() => {
    if (checkboxState !== "Enabled") {
      setPreviewHover(false);
      setPreviewPressed(false);
    }
  }, [checkboxState]);

  const stateColors = useMemo(
    () =>
      CHECKBOX_COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  const codeSnippet = useMemo(
    () =>
      buildCheckboxSnippet({
        checkboxState,
        checkboxType,
        showLabel,
        labelText,
        showGroup,
        groupItems,
        groupChecked,
      }),
    [
      checkboxState,
      checkboxType,
      showLabel,
      labelText,
      showGroup,
      groupItems,
      groupChecked,
    ],
  );

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const previewHandlers = {
    onMouseEnter: () => {
      if (checkboxState === "Enabled") setPreviewHover(true);
    },
    onMouseLeave: () => {
      if (checkboxState === "Enabled") {
        setPreviewHover(false);
        setPreviewPressed(false);
      }
    },
    onMouseDown: () => {
      if (checkboxState === "Enabled") setPreviewPressed(true);
    },
    onMouseUp: () => {
      if (checkboxState === "Enabled") setPreviewPressed(false);
    },
  };

  function toggleGroupItem(index: number) {
    if (checkboxState === "Disabled") return;
    setGroupChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  function cycleSingleType() {
    if (checkboxState === "Disabled") return;
    setCheckboxType((prev) => {
      if (prev === "Unselected") return "Selected";
      if (prev === "Selected") return "Indeterminate";
      return "Unselected";
    });
  }

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Explora, entiende y configura el componente checkbox del sistema de
          diseño. Colores vía{" "}
          <code className="font-mono text-[length:inherit]">var(--ds-*)</code>{" "}
          alineados a Feature 02 (Figma 6:6708).
        </p>

        <div className="mb-4">
          <div className={shell.previewCard}>
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
              {showGroup ? (
                <div className={styles.checkboxGroup}>
                  {groupItems.map((label, i) => (
                    <div key={label} onClick={() => toggleGroupItem(i)}>
                      <CheckboxPreview
                        checkboxState={effectiveState}
                        checkboxType={
                          groupChecked[i] ? "Selected" : "Unselected"
                        }
                        labelText={showLabel ? label : ""}
                        {...previewHandlers}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div onClick={cycleSingleType}>
                  <CheckboxPreview
                    checkboxState={effectiveState}
                    checkboxType={checkboxType}
                    labelText={showLabel ? labelText : ""}
                    {...previewHandlers}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography (Label)</h3>
            <div className={shell.specDivider}>
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

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Checkbox Control</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Box size" value="var(--ds-checkbox-size)" />
              <SpecRow
                label="Border radius"
                value="var(--ds-checkbox-radius)"
              />
              <SpecRow
                label="Border width"
                value="var(--ds-checkbox-border-width)"
              />
              <SpecRow
                label="Touch target"
                value="var(--ds-checkbox-touch-target)"
              />
              <SpecRow
                label="State layer"
                value="var(--ds-checkbox-state-layer)"
              />
              <SpecRow label="Label gap" value="var(--ds-checkbox-label-gap)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors (States)</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>All States</h3>
            <div className="grid grid-cols-2 gap-6">
              {(
                [
                  "Enabled",
                  "Hover",
                  "Focus",
                  "Pressed",
                  "Disabled",
                ] as CheckboxState[]
              ).map((state) => (
                <div key={state} className="space-y-3">
                  <p className={shell.stateGallerySection}>{state}</p>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Selected"
                        labelText=""
                      />
                      <span className={shell.stateGalleryLabel}>
                        Selected
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Indeterminate"
                        labelText=""
                      />
                      <span className={shell.stateGalleryLabel}>
                        Indeterminate
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Unselected"
                        labelText=""
                      />
                      <span className={shell.stateGalleryLabel}>
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
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>
              Configure the checkbox properties
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="State"
            value={checkboxState}
            options={[
              { value: "Enabled", label: "Default" },
              { value: "Hover", label: "Hover" },
              { value: "Focus", label: "Focus" },
              { value: "Pressed", label: "Press" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setCheckboxState}
          />

          <SegmentedControl
            label="Type"
            value={checkboxType}
            options={[
              { value: "Selected", label: "Selected" },
              { value: "Indeterminate", label: "Indeterm." },
              { value: "Unselected", label: "Unselected" },
            ]}
            onChange={setCheckboxType}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Checkbox Group</span>
              <Switch
                checked={showGroup}
                onCheckedChange={setShowGroup}
                aria-label="Toggle checkbox group"
                style={showGroup ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Label Text</span>
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
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Label Text
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          )}

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current Config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>{checkboxState}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Type</span>
                <span className={shell.configVal}>{checkboxType}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Mode</span>
                <span className={shell.configVal}>
                  {showGroup ? "Group" : "Single"}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Label</span>
                <span className={shell.configVal}>
                  {showLabel ? "On" : "Off"}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Fill (selected)</span>
                <span className={shell.configValMono}>--ds-color-brand</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Checkbox — ${checkboxState} / ${checkboxType}${showGroup ? " (Group)" : ""}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
