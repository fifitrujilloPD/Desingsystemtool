import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { CodeModal } from "./code-modal";

// ─── Types ──────────────────────────────────────────────────────────────────

type CheckboxState = "Enabled" | "Hover" | "Focus" | "Pressed" | "Disabled";
type CheckboxType = "Selected" | "Unselected" | "Indeterminate";

// ─── Token helpers ──────────────────────────────────────────────────────────

function resolveRef(ref: string, root: any): string | null {
  const path = ref.replace(/[{}]/g, "").split(".");
  let current = root;
  for (const p of path) {
    current = current?.[p];
    if (!current) return null;
  }
  return current?.$value?.hex || null;
}

function resolveColor(tokens: any, path: string): string {
  const parts = path.split(".");
  let current = tokens;
  for (const p of parts) current = current?.[p];
  const val = current?.$value;
  if (!val) return "#000";
  if (typeof val === "string" && val.startsWith("{"))
    return resolveRef(val, tokens) || "#000";
  return val?.hex || "#000";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Constants from Figma tokens ────────────────────────────────────────────

const FONT_FAMILY =
  (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value ||
  "Roboto";

const CHECKBOX_SIZE = 18;
const CHECKBOX_BORDER_RADIUS = 2;
const CHECKBOX_BORDER_WIDTH = 2;
const CHECKBOX_TOUCH_TARGET = 48;
const STATE_LAYER_SIZE = 40;
const LABEL_FONT_SIZE = 16;
const LABEL_GAP = 6;

// ─── CheckboxPreview ────────────────────────────────────────────────────────

function CheckboxPreview({
  checkboxState,
  checkboxType,
  labelText,
  tokens,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  checkboxState: CheckboxState;
  checkboxType: CheckboxType;
  labelText: string;
  tokens: any;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const brandColor = resolveColor(
    tokens,
    "global.color.Button color.button-color"
  );
  const onSurface = resolveColor(
    tokens,
    "global.color.Text colors.text-primary"
  );
  const textSecondary = resolveColor(
    tokens,
    "global.color.Text colors.text-secondary"
  );
  const isDisabled = checkboxState === "Disabled";
  const isFilled =
    checkboxType === "Selected" || checkboxType === "Indeterminate";

  let stateLayerBg = "transparent";
  if (!isDisabled) {
    const baseColor = isFilled ? brandColor : onSurface;
    if (checkboxState === "Hover") stateLayerBg = hexToRgba(baseColor, 0.08);
    if (checkboxState === "Focus") stateLayerBg = hexToRgba(baseColor, 0.12);
    if (checkboxState === "Pressed") stateLayerBg = hexToRgba(baseColor, 0.12);
  }

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: LABEL_GAP,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.38 : 1,
  };

  const touchTargetStyle: React.CSSProperties = {
    width: CHECKBOX_TOUCH_TARGET,
    height: CHECKBOX_TOUCH_TARGET,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };

  const stateLayerStyle: React.CSSProperties = {
    width: STATE_LAYER_SIZE,
    height: STATE_LAYER_SIZE,
    borderRadius: "50%",
    backgroundColor: stateLayerBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s ease",
  };

  const boxBg = isFilled
    ? isDisabled
      ? onSurface
      : brandColor
    : "transparent";
  const boxBorder = isFilled
    ? "none"
    : `${CHECKBOX_BORDER_WIDTH}px solid ${isDisabled ? onSurface : textSecondary}`;

  const boxStyle: React.CSSProperties = {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: CHECKBOX_BORDER_RADIUS,
    backgroundColor: boxBg,
    border: boxBorder,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    boxSizing: "border-box",
    position: "relative",
  };

  const checkmarkStyle: React.CSSProperties = {
    width: 10,
    height: 5,
    borderLeft: "2px solid #fff",
    borderBottom: "2px solid #fff",
    transform: checkboxType === "Selected" ? "rotate(-45deg) scale(1)" : "rotate(-45deg) scale(0)",
    transformOrigin: "center",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    marginTop: -1,
  };

  const dashStyle: React.CSSProperties = {
    width: 10,
    height: 0,
    borderBottom: "2px solid #fff",
    transform: checkboxType === "Indeterminate" ? "scaleX(1)" : "scaleX(0)",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: LABEL_FONT_SIZE,
    fontWeight: 400,
    lineHeight: "1.5",
    color: isDisabled ? textSecondary : onSurface,
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div style={touchTargetStyle}>
        <div style={stateLayerStyle}>
          <div style={boxStyle}>
            {checkboxType === "Selected" && <div style={checkmarkStyle} />}
            {checkboxType === "Indeterminate" && <div style={dashStyle} />}
          </div>
        </div>
      </div>
      {labelText && <span style={labelStyle}>{labelText}</span>}
    </div>
  );
}

// ─── State color card ───────────────────────────────────────────────────────

function StateColorCard({
  label,
  hex,
  tokenName,
}: {
  label: string;
  hex: string;
  tokenName: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
          {tokenName}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
          {hex}
        </p>
      </div>
    </div>
  );
}

// ─── Spec row ───────────────────────────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-mono text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────

export function CheckboxView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const accentBlue = resolveColor(
    tokens,
    "global.color.Button color.button-color"
  );

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

  const stateColors = useMemo(() => {
    const t = tokens as any;
    const brand = resolveColor(t, "global.color.Button color.button-color");
    const brandHover = resolveColor(
      t,
      "global.color.Button color.button-hover"
    );
    const border = resolveColor(t, "global.color.Text colors.text-secondary");
    const onSurface = resolveColor(
      t,
      "global.color.Text colors.text-primary"
    );
    const disabled = resolveColor(
      t,
      "global.color.Button color.button-disabled"
    );
    return [
      {
        label: "Selected / Indeterminate",
        hex: brand,
        tokenName: "button-color",
      },
      { label: "Unselected (border)", hex: border, tokenName: "text-secondary" },
      {
        label: "Hover (selected)",
        hex: brandHover,
        tokenName: "button-hover",
      },
      { label: "Disabled (fill)", hex: onSurface, tokenName: "text-primary" },
      { label: "Disabled (border)", hex: disabled, tokenName: "button-disabled" },
      { label: "Check icon", hex: "#FFFFFF", tokenName: "text-primary-white" },
    ];
  }, [theme, tokens]);

  const codeSnippet = useMemo(() => {
    const brand = resolveColor(
      tokens,
      "global.color.Button color.button-color"
    );
    const onSurface = resolveColor(
      tokens,
      "global.color.Text colors.text-primary"
    );
    const secondary = resolveColor(
      tokens,
      "global.color.Text colors.text-secondary"
    );
    const isDisabled = checkboxState === "Disabled";
    const isFilled =
      checkboxType === "Selected" || checkboxType === "Indeterminate";

    const bgColor = isFilled
      ? isDisabled
        ? onSurface
        : brand
      : "transparent";
    const borderCss = isFilled
      ? "none"
      : `${CHECKBOX_BORDER_WIDTH}px solid ${isDisabled ? onSurface : secondary}`;

    let stateLayerBg = "transparent";
    if (!isDisabled) {
      const base = isFilled ? brand : onSurface;
      if (checkboxState === "Hover") stateLayerBg = hexToRgba(base, 0.08);
      if (checkboxState === "Focus" || checkboxState === "Pressed")
        stateLayerBg = hexToRgba(base, 0.12);
    }

    let iconHtml = "";
    if (checkboxType === "Selected") {
      iconHtml = `\n        <span style="width: 10px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg); margin-top: -1px;"></span>`;
    } else if (checkboxType === "Indeterminate") {
      iconHtml = `\n        <span style="width: 10px; height: 0; border-bottom: 2px solid #fff;"></span>`;
    }

    const labelHtml = showLabel
      ? `\n  <span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${LABEL_FONT_SIZE}px; color: ${isDisabled ? "#98A2B3" : onSurface};">${labelText}</span>`
      : "";

    if (showGroup) {
      const items = groupItems
        .map((label, i) => {
          const checked = groupChecked[i];
          const itemBg = checked ? (isDisabled ? onSurface : brand) : "transparent";
          const itemBorder = checked
            ? "none"
            : `${CHECKBOX_BORDER_WIDTH}px solid ${isDisabled ? onSurface : secondary}`;
          const itemIcon = checked
            ? `\n          <span style="width: 10px; height: 5px; border-left: 2px solid #fff; border-bottom: 2px solid #fff; transform: rotate(-45deg); margin-top: -1px;"></span>`
            : "";
          const itemLabel = showLabel
            ? `\n    <span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${LABEL_FONT_SIZE}px; color: ${onSurface};">${label}</span>`
            : "";
          return `  <label style="display: inline-flex; align-items: center; gap: ${LABEL_GAP}px; cursor: ${isDisabled ? "not-allowed" : "pointer"}; opacity: ${isDisabled ? 0.38 : 1};">
    <span style="width: ${CHECKBOX_TOUCH_TARGET}px; height: ${CHECKBOX_TOUCH_TARGET}px; display: flex; align-items: center; justify-content: center;">
      <span style="width: ${STATE_LAYER_SIZE}px; height: ${STATE_LAYER_SIZE}px; border-radius: 50%; background: ${stateLayerBg}; display: flex; align-items: center; justify-content: center;">
        <span style="width: ${CHECKBOX_SIZE}px; height: ${CHECKBOX_SIZE}px; border-radius: ${CHECKBOX_BORDER_RADIUS}px; background: ${itemBg}; border: ${itemBorder}; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${itemIcon}
        </span>
      </span>
    </span>${itemLabel}
    <input type="checkbox"${checked ? " checked" : ""} style="display: none;" />
  </label>`;
        })
        .join("\n");
      return `<div role="group" style="display: flex; flex-direction: column; gap: 4px;">\n${items}\n</div>`;
    }

    return `<label style="display: inline-flex; align-items: center; gap: ${LABEL_GAP}px; cursor: ${isDisabled ? "not-allowed" : "pointer"}; opacity: ${isDisabled ? 0.38 : 1};">
  <span style="width: ${CHECKBOX_TOUCH_TARGET}px; height: ${CHECKBOX_TOUCH_TARGET}px; display: flex; align-items: center; justify-content: center;">
    <span style="width: ${STATE_LAYER_SIZE}px; height: ${STATE_LAYER_SIZE}px; border-radius: 50%; background: ${stateLayerBg}; display: flex; align-items: center; justify-content: center;">
      <span style="width: ${CHECKBOX_SIZE}px; height: ${CHECKBOX_SIZE}px; border-radius: ${CHECKBOX_BORDER_RADIUS}px; background: ${bgColor}; border: ${borderCss}; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">${iconHtml}
      </span>
    </span>
  </span>${labelHtml}
  <input type="checkbox"${checkboxType === "Selected" ? " checked" : ""} style="display: none;" />
</label>`;
  }, [
    checkboxState,
    checkboxType,
    labelText,
    showLabel,
    showGroup,
    groupItems,
    groupChecked,
    tokens,
  ]);

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
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Checkbox
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente checkbox del sistema de
            diseño.
          </p>
        </div>

        {/* ── Preview ─────────────────────────────────────────────────── */}
        <div className="mb-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl relative overflow-hidden min-h-[280px]">
            <div className="absolute left-0 right-0 top-14 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="absolute top-3 left-0 right-0 flex items-center justify-between pl-5 pr-3 z-10">
              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preview
              </h2>
              <button
                onClick={() => setShowCodeModal(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all overflow-clip shadow-[inset_0px_0px_0px_1px_rgba(1,17,31,0.1),inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)]"
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute left-0 right-0 top-16 bottom-0 flex items-center justify-center">
              {showGroup ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {groupItems.map((label, i) => (
                    <div key={i} onClick={() => toggleGroupItem(i)}>
                      <CheckboxPreview
                        checkboxState={effectiveState}
                        checkboxType={
                          groupChecked[i] ? "Selected" : "Unselected"
                        }
                        labelText={showLabel ? label : ""}
                        tokens={tokens}
                        onMouseEnter={() => {
                          if (checkboxState === "Enabled")
                            setPreviewHover(true);
                        }}
                        onMouseLeave={() => {
                          if (checkboxState === "Enabled") {
                            setPreviewHover(false);
                            setPreviewPressed(false);
                          }
                        }}
                        onMouseDown={() => {
                          if (checkboxState === "Enabled")
                            setPreviewPressed(true);
                        }}
                        onMouseUp={() => {
                          if (checkboxState === "Enabled")
                            setPreviewPressed(false);
                        }}
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
                    tokens={tokens}
                    onMouseEnter={() => {
                      if (checkboxState === "Enabled") setPreviewHover(true);
                    }}
                    onMouseLeave={() => {
                      if (checkboxState === "Enabled") {
                        setPreviewHover(false);
                        setPreviewPressed(false);
                      }
                    }}
                    onMouseDown={() => {
                      if (checkboxState === "Enabled") setPreviewPressed(true);
                    }}
                    onMouseUp={() => {
                      if (checkboxState === "Enabled")
                        setPreviewPressed(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Component Spec ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Typography (Label) */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Typography (Label)
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Font family" value={FONT_FAMILY} />
              <SpecRow label="Font size" value={`${LABEL_FONT_SIZE}px`} />
              <SpecRow label="Font weight" value="400 (Regular)" />
              <SpecRow label="Line height" value="1.5" />
            </div>
          </div>

          {/* Checkbox Control */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Checkbox Control
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Box size" value={`${CHECKBOX_SIZE}px`} />
              <SpecRow
                label="Border radius"
                value={`${CHECKBOX_BORDER_RADIUS}px`}
              />
              <SpecRow
                label="Border width"
                value={`${CHECKBOX_BORDER_WIDTH}px`}
              />
              <SpecRow
                label="Touch target"
                value={`${CHECKBOX_TOUCH_TARGET}px`}
              />
              <SpecRow
                label="State layer"
                value={`${STATE_LAYER_SIZE}px`}
              />
              <SpecRow label="Label gap" value={`${LABEL_GAP}px`} />
            </div>
          </div>

          {/* Colors (States) */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Colors (States)
            </h3>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          {/* All States Gallery */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              All States
            </h3>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    {state}
                  </p>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Selected"
                        labelText=""
                        tokens={tokens}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        Selected
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Indeterminate"
                        labelText=""
                        tokens={tokens}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        Indeterminate
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CheckboxPreview
                        checkboxState={state}
                        checkboxType="Unselected"
                        labelText=""
                        tokens={tokens}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
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

      {/* ── Right Panel (Control Panel) ───────────────────────────────── */}
      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Controls
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure the checkbox properties
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* State */}
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

          {/* Type */}
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

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Group toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Checkbox Group
              </span>
              <Switch
                checked={showGroup}
                onCheckedChange={(v) => setShowGroup(v)}
                aria-label="Toggle checkbox group"
                style={
                  showGroup ? { backgroundColor: accentBlue } : undefined
                }
              />
            </label>
          </div>

          {/* Label toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Label Text
              </span>
              <Switch
                checked={showLabel}
                onCheckedChange={(v) => setShowLabel(v)}
                aria-label="Toggle label text"
                style={
                  showLabel ? { backgroundColor: accentBlue } : undefined
                }
              />
            </label>
          </div>

          {/* Label text input */}
          {!showGroup && showLabel && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Label Text
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Quick reference */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Current Config
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">State</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {checkboxState}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {checkboxType}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Mode</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {showGroup ? "Group" : "Single"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Label</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {showLabel ? "On" : "Off"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Box size
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {CHECKBOX_SIZE}px
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Touch target
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {CHECKBOX_TOUCH_TARGET}px
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Font size
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {LABEL_FONT_SIZE}px
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Checkbox — ${checkboxState} / ${checkboxType}${showGroup ? " (Group)" : ""}`}
          code={codeSnippet}
        />
      )}
    </div>
  );
}
