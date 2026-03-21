import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { CodeModal } from "./code-modal";

// ─── Types ──────────────────────────────────────────────────────────────────

type RadioState = "Enabled" | "Hover" | "Focus" | "Pressed" | "Disabled";

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

const RADIO_OUTER_SIZE = 20;
const RADIO_INNER_DOT = 10;
const RADIO_BORDER_WIDTH = 2;
const RADIO_TOUCH_TARGET = 48;
const STATE_LAYER_SIZE = 40;
const LABEL_FONT_SIZE = 16;
const LABEL_GAP = 6;

// ─── RadioButtonPreview ─────────────────────────────────────────────────────

function RadioButtonPreview({
  radioState,
  isSelected,
  labelText,
  tokens,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
}: {
  radioState: RadioState;
  isSelected: boolean;
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
  const isDisabled = radioState === "Disabled";

  const circleColor = isSelected ? brandColor : onSurface;

  let stateLayerBg = "transparent";
  if (!isDisabled) {
    const baseColor = isSelected ? brandColor : onSurface;
    if (radioState === "Hover") stateLayerBg = hexToRgba(baseColor, 0.08);
    if (radioState === "Focus") stateLayerBg = hexToRgba(baseColor, 0.12);
    if (radioState === "Pressed") stateLayerBg = hexToRgba(baseColor, 0.12);
  }

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: LABEL_GAP,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.38 : 1,
  };

  const touchTargetStyle: React.CSSProperties = {
    width: RADIO_TOUCH_TARGET,
    height: RADIO_TOUCH_TARGET,
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

  const outerCircleStyle: React.CSSProperties = {
    width: RADIO_OUTER_SIZE,
    height: RADIO_OUTER_SIZE,
    borderRadius: "50%",
    border: `${RADIO_BORDER_WIDTH}px solid ${circleColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.15s ease",
    boxSizing: "border-box",
  };

  const innerDotStyle: React.CSSProperties = {
    width: RADIO_INNER_DOT,
    height: RADIO_INNER_DOT,
    borderRadius: "50%",
    backgroundColor: circleColor,
    transform: isSelected ? "scale(1)" : "scale(0)",
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
          <div style={outerCircleStyle}>
            <div style={innerDotStyle} />
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

export function RadioButtonView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const accentBlue = resolveColor(
    tokens,
    "global.color.Button color.button-color"
  );

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

  const stateColors = useMemo(() => {
    const t = tokens as any;
    const brand = resolveColor(t, "global.color.Button color.button-color");
    const brandHover = resolveColor(
      t,
      "global.color.Button color.button-hover"
    );
    const onSurface = resolveColor(
      t,
      "global.color.Text colors.text-primary"
    );
    const disabled = resolveColor(
      t,
      "global.color.Button color.button-disabled"
    );
    return [
      { label: "Selected", hex: brand, tokenName: "button-color" },
      { label: "Unselected", hex: onSurface, tokenName: "text-primary" },
      {
        label: "Hover (selected)",
        hex: brandHover,
        tokenName: "button-hover",
      },
      { label: "Focus ring", hex: brand, tokenName: "button-color" },
      { label: "Disabled", hex: disabled, tokenName: "button-disabled" },
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
    const isDisabled = radioState === "Disabled";

    const circleColor = isSelected ? brand : onSurface;
    let stateLayerBg = "transparent";
    if (!isDisabled) {
      if (radioState === "Hover")
        stateLayerBg = hexToRgba(circleColor, 0.08);
      if (radioState === "Focus" || radioState === "Pressed")
        stateLayerBg = hexToRgba(circleColor, 0.12);
    }

    if (showGroup) {
      const items = groupLabels
        .map((label, i) => {
          const sel = i === selectedIndex;
          const cc = sel ? brand : onSurface;
          const labelHtml = showLabel
            ? `\n    <span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${LABEL_FONT_SIZE}px; color: ${onSurface};">${label}</span>`
            : "";
          return `  <label style="display: inline-flex; align-items: center; gap: ${LABEL_GAP}px; cursor: ${isDisabled ? "not-allowed" : "pointer"}; opacity: ${isDisabled ? 0.38 : 1};">
    <span style="width: ${RADIO_TOUCH_TARGET}px; height: ${RADIO_TOUCH_TARGET}px; display: flex; align-items: center; justify-content: center;">
      <span style="width: ${STATE_LAYER_SIZE}px; height: ${STATE_LAYER_SIZE}px; border-radius: 50%; background: ${stateLayerBg}; display: flex; align-items: center; justify-content: center;">
        <span style="width: ${RADIO_OUTER_SIZE}px; height: ${RADIO_OUTER_SIZE}px; border-radius: 50%; border: ${RADIO_BORDER_WIDTH}px solid ${cc}; display: flex; align-items: center; justify-content: center;">
          ${sel ? `<span style="width: ${RADIO_INNER_DOT}px; height: ${RADIO_INNER_DOT}px; border-radius: 50%; background: ${cc};"></span>` : ""}
        </span>
      </span>
    </span>
    ${labelHtml}
    <input type="radio" name="group"${sel ? " checked" : ""} style="display: none;" />
  </label>`;
        })
        .join("\n");
      return `<div role="radiogroup" style="display: flex; flex-direction: column; gap: 4px;">\n${items}\n</div>`;
    }

    const dotHtml = isSelected
      ? `\n          <span style="width: ${RADIO_INNER_DOT}px; height: ${RADIO_INNER_DOT}px; border-radius: 50%; background: ${circleColor};"></span>`
      : "";

    const singleLabelHtml = showLabel
      ? `\n  <span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${LABEL_FONT_SIZE}px; color: ${isDisabled ? "#98A2B3" : onSurface};">${labelText}</span>`
      : "";

    return `<label style="display: inline-flex; align-items: center; gap: ${LABEL_GAP}px; cursor: ${isDisabled ? "not-allowed" : "pointer"}; opacity: ${isDisabled ? 0.38 : 1};">
  <span style="width: ${RADIO_TOUCH_TARGET}px; height: ${RADIO_TOUCH_TARGET}px; display: flex; align-items: center; justify-content: center;">
    <span style="width: ${STATE_LAYER_SIZE}px; height: ${STATE_LAYER_SIZE}px; border-radius: 50%; background: ${stateLayerBg}; display: flex; align-items: center; justify-content: center;">
      <span style="width: ${RADIO_OUTER_SIZE}px; height: ${RADIO_OUTER_SIZE}px; border-radius: 50%; border: ${RADIO_BORDER_WIDTH}px solid ${circleColor}; display: flex; align-items: center; justify-content: center;">${dotHtml}
      </span>
    </span>
  </span>
  ${singleLabelHtml}
  <input type="radio"${isSelected ? " checked" : ""} style="display: none;" />
</label>`;
  }, [
    radioState,
    isSelected,
    labelText,
    showLabel,
    showGroup,
    groupLabels,
    selectedIndex,
    tokens,
  ]);

  return (
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Radio Button
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente radio button del sistema
            de diseño.
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
                  {groupLabels.map((label, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (radioState !== "Disabled") setSelectedIndex(i);
                      }}
                    >
                      <RadioButtonPreview
                        radioState={effectiveState}
                        isSelected={i === selectedIndex}
                        labelText={showLabel ? label : ""}
                        tokens={tokens}
                        onMouseEnter={() => {
                          if (radioState === "Enabled") setPreviewHover(true);
                        }}
                        onMouseLeave={() => {
                          if (radioState === "Enabled") {
                            setPreviewHover(false);
                            setPreviewPressed(false);
                          }
                        }}
                        onMouseDown={() => {
                          if (radioState === "Enabled")
                            setPreviewPressed(true);
                        }}
                        onMouseUp={() => {
                          if (radioState === "Enabled")
                            setPreviewPressed(false);
                        }}
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
                    tokens={tokens}
                    onMouseEnter={() => {
                      if (radioState === "Enabled") setPreviewHover(true);
                    }}
                    onMouseLeave={() => {
                      if (radioState === "Enabled") {
                        setPreviewHover(false);
                        setPreviewPressed(false);
                      }
                    }}
                    onMouseDown={() => {
                      if (radioState === "Enabled") setPreviewPressed(true);
                    }}
                    onMouseUp={() => {
                      if (radioState === "Enabled") setPreviewPressed(false);
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

          {/* Radio Control */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Radio Control
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow
                label="Outer size"
                value={`${RADIO_OUTER_SIZE}px`}
              />
              <SpecRow
                label="Inner dot"
                value={`${RADIO_INNER_DOT}px`}
              />
              <SpecRow label="Border radius" value="50% (Circle)" />
              <SpecRow
                label="Border width"
                value={`${RADIO_BORDER_WIDTH}px`}
              />
              <SpecRow
                label="Touch target"
                value={`${RADIO_TOUCH_TARGET}px`}
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
                ] as RadioState[]
              ).map((state) => (
                <div key={state} className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    {state}
                  </p>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center gap-1">
                      <RadioButtonPreview
                        radioState={state}
                        isSelected={true}
                        labelText=""
                        tokens={tokens}
                      />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        Selected
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <RadioButtonPreview
                        radioState={state}
                        isSelected={false}
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
              Configure the radio button properties
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* State */}
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

          {/* Selection toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Selected
              </span>
              <Switch
                checked={showGroup ? selectedIndex >= 0 : isSelected}
                onCheckedChange={(v) => {
                  if (showGroup) {
                    setSelectedIndex(v ? 0 : -1);
                  } else {
                    setIsSelected(v);
                  }
                }}
                aria-label="Toggle selection"
                style={
                  (showGroup ? selectedIndex >= 0 : isSelected)
                    ? { backgroundColor: accentBlue }
                    : undefined
                }
              />
            </label>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Group toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Radio Group
              </span>
              <Switch
                checked={showGroup}
                onCheckedChange={(v) => setShowGroup(v)}
                aria-label="Toggle radio group"
                style={showGroup ? { backgroundColor: accentBlue } : undefined}
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
                style={showLabel ? { backgroundColor: accentBlue } : undefined}
              />
            </label>
          </div>

          {/* Label text */}
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
                  {radioState}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Selected
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {showGroup
                    ? selectedIndex >= 0
                      ? `Option ${selectedIndex + 1}`
                      : "None"
                    : isSelected
                      ? "Yes"
                      : "No"}
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
                  Radio size
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {RADIO_OUTER_SIZE}px
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Touch target
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {RADIO_TOUCH_TARGET}px
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
          title={`Radio Button — ${radioState} / ${isSelected ? "Selected" : "Unselected"}${showGroup ? " (Group)" : ""}`}
          code={codeSnippet}
        />
      )}
    </div>
  );
}
