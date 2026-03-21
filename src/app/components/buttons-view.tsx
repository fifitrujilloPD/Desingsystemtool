import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import { CodeModal } from "./code-modal";

// ─── Types ──────────────────────────────────────────────────────────────────

type ButtonStyle = "Primary" | "Outlined" | "Link";
type ButtonState = "Enabled" | "Hover" | "Press" | "Disabled";
type ButtonSize = "sm" | "md" | "lg" | "xl";
type IconPosition = "none" | "left" | "right" | "both";

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
  if (typeof val === "string" && val.startsWith("{")) return resolveRef(val, tokens) || "#000";
  return val?.hex || "#000";
}

// ─── Token data ─────────────────────────────────────────────────────────────

const FONT_FAMILY = (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value || "Roboto";

const SIZE_CONFIG: Record<ButtonSize, { fontSize: number; paddingX: number; paddingY: number; label: string }> = {
  sm: { fontSize: 14, paddingX: 12, paddingY: 8, label: "Small" },
  md: { fontSize: 14, paddingX: 12, paddingY: 10, label: "Medium" },
  lg: { fontSize: 16, paddingX: 16, paddingY: 12, label: "Large" },
  xl: { fontSize: 16, paddingX: 24, paddingY: 14, label: "Extra Large" },
};

const BORDER_RADIUS = 8;

/** Matches Icons view: Material Symbols Rounded, outline (no fill). */
const MATERIAL_SYMBOL_STYLE: React.CSSProperties = {
  fontSize: 20,
  color: "inherit",
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
};

// ─── Button preview component ───────────────────────────────────────────────

function ButtonPreview({
    buttonStyle,
    buttonState,
    size,
    text,
    showText,
    iconPosition,
    leftIcon,
    rightIcon,
    tokens,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
}: {
  buttonStyle: ButtonStyle;
  buttonState: ButtonState;
  size: ButtonSize;
  text: string;
    showText: boolean;
  iconPosition: IconPosition;
  leftIcon: string;
  rightIcon: string;
  tokens: any;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const cfg = SIZE_CONFIG[size];
  const showLeft = iconPosition === "left" || iconPosition === "both";
  const showRight = iconPosition === "right" || iconPosition === "both";

  const colorDefault = resolveColor(tokens, "global.color.Button color.button-color");
  const colorHover = resolveColor(tokens, "global.color.Button color.button-hover");
  const colorPress = resolveColor(tokens, "global.color.Button color.button-press");
  const colorDisabled = resolveColor(tokens, "global.color.Button color.button-disabled");
  const bgContainer = resolveColor(tokens, "global.color.Background.bg-container");
  const bgPrimary = resolveColor(tokens, "global.color.Background.bg-primary");
  const borderBrand = resolveColor(tokens, "global.color.Border color.border-brand");

  const stateColorMap: Record<ButtonState, string> = {
    Enabled: colorDefault,
    Hover: colorHover,
    Press: colorPress,
    Disabled: colorDisabled,
  };
  const isDisabled = buttonState === "Disabled";

  let bg = "transparent";
  let color = stateColorMap[buttonState === "Disabled" ? "Enabled" : buttonState];
  let border = "none";
  let boxShadow = "inset 0px 0px 0px 1px rgba(1,17,31,0.1), inset 0px -2px 2px 0px rgba(1,17,31,0.1)";

  if (buttonStyle === "Primary") {
    bg = stateColorMap[buttonState];
    color = isDisabled ? "#98A2B3" : "#FFFFFF";
  } else if (buttonStyle === "Outlined") {
    bg = buttonState === "Hover" ? bgPrimary : bgContainer;
    border = `1px solid ${borderBrand}`;
    if (isDisabled) color = "#98A2B3";
  } else {
    boxShadow = "none";
    if (isDisabled) color = "#98A2B3";
  }

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    paddingLeft: cfg.paddingX,
    paddingRight: cfg.paddingX,
    paddingTop: cfg.paddingY,
    paddingBottom: cfg.paddingY,
    borderRadius: BORDER_RADIUS,
    backgroundColor: bg,
    color,
    border,
    boxShadow,
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: cfg.fontSize,
    fontWeight: 600,
    lineHeight: "normal",
    cursor: isDisabled ? "not-allowed" : "pointer",
    overflow: "clip",
    position: "relative",
    whiteSpace: "nowrap",
    opacity: isDisabled ? 0.6 : 1,
  };

  return (
    <div
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      {showLeft && (
        <span className="material-symbols-rounded" style={MATERIAL_SYMBOL_STYLE}>
          {leftIcon}
        </span>
      )}
      {showText && <span>{text}</span>}
      {showRight && (
        <span className="material-symbols-rounded" style={MATERIAL_SYMBOL_STYLE}>
          {rightIcon}
        </span>
      )}
    </div>
  );
}

// ─── State color cards ──────────────────────────────────────────────────────

function StateColorCard({ label, hex, tokenName }: { label: string; hex: string; tokenName: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">{tokenName}</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{hex}</p>
      </div>
    </div>
  );
}

// ─── Spec row ───────────────────────────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-mono text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────

export function ButtonsView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const buttonPrimaryBlue = resolveColor(tokens, "global.color.Button color.button-color");

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>("Primary");
  const [buttonState, setButtonState] = useState<ButtonState>("Enabled");
  const [size, setSize] = useState<ButtonSize>("md");
  const [iconPosition, setIconPosition] = useState<IconPosition>("both");
  const [leftIcon, setLeftIcon] = useState("arrow_back");
  const [rightIcon, setRightIcon] = useState("arrow_forward");
  const [buttonText, setButtonText] = useState("Button");
  const [showText, setShowText] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const [previewPressed, setPreviewPressed] = useState(false);

  const stateColors = useMemo(() => {
    const t = tokens as any;
    return [
      { label: "Default", hex: resolveColor(t, "global.color.Button color.button-color"), tokenName: "button-color" },
      { label: "Hover", hex: resolveColor(t, "global.color.Button color.button-hover"), tokenName: "button-hover" },
      { label: "Pressed", hex: resolveColor(t, "global.color.Button color.button-press"), tokenName: "button-press" },
      { label: "Disabled", hex: resolveColor(t, "global.color.Button color.button-disabled"), tokenName: "button-disabled" },
    ];
  }, [theme]);

  const cfg = SIZE_CONFIG[size];

  // Preview interaction should reflect hover/press in real-time.
  // We only override the "State" control when the base state is Enabled,
  // so selecting Hover/Press/Disabled in the UI still behaves as a spec preview.
  const effectiveButtonState: ButtonState =
    buttonState === "Enabled"
      ? previewPressed
        ? "Press"
        : previewHover
          ? "Hover"
          : "Enabled"
      : buttonState;

  // If the user switches the base state away from Enabled, reset interaction flags.
  useEffect(() => {
    if (buttonState !== "Enabled") {
      setPreviewHover(false);
      setPreviewPressed(false);
    }
  }, [buttonState]);

  const buttonCodeSnippet = useMemo(() => {
    const t = tokens as any;
    const colorDefault = resolveColor(t, "global.color.Button color.button-color");
    const colorHover = resolveColor(t, "global.color.Button color.button-hover");
    const colorPress = resolveColor(t, "global.color.Button color.button-press");
    const colorDisabled = resolveColor(t, "global.color.Button color.button-disabled");
    const bgContainer = resolveColor(t, "global.color.Background.bg-container");
    const bgPrimary = resolveColor(t, "global.color.Background.bg-primary");
    const borderBrand = resolveColor(t, "global.color.Border color.border-brand");

    const stateMap: Record<ButtonState, string> = {
      Enabled: colorDefault,
      Hover: colorHover,
      Press: colorPress,
      Disabled: colorDisabled,
    };

    const isDisabled = buttonState === "Disabled";
    let bg = "transparent";
    let color = stateMap[isDisabled ? "Enabled" : buttonState];
    let border = "none";
    let boxShadow = "inset 0 0 0 1px rgba(1,17,31,0.1), inset 0 -2px 2px rgba(1,17,31,0.1)";

    if (buttonStyle === "Primary") {
      bg = stateMap[buttonState];
      color = isDisabled ? "#98A2B3" : "#FFFFFF";
    } else if (buttonStyle === "Outlined") {
      bg = buttonState === "Hover" ? bgPrimary : bgContainer;
      border = `1px solid ${borderBrand}`;
      if (isDisabled) color = "#98A2B3";
    } else {
      boxShadow = "none";
      if (isDisabled) color = "#98A2B3";
    }

    const showLeft = iconPosition === "left" || iconPosition === "both";
    const showRight = iconPosition === "right" || iconPosition === "both";

    const indent = "  ";
    const iconTag = (name: string) =>
      `${indent}<span class="material-symbols-rounded" style="font-size: 20px">${name}</span>`;

    const children = [
      showLeft ? iconTag(leftIcon) : null,
      showText ? `${indent}<span>${buttonText}</span>` : null,
      showRight ? iconTag(rightIcon) : null,
    ]
      .filter(Boolean)
      .join("\n");

    const styleLines = [
      `display: inline-flex`,
      `align-items: center`,
      `gap: 4px`,
      `padding: ${cfg.paddingY}px ${cfg.paddingX}px`,
      `border-radius: ${BORDER_RADIUS}px`,
      `background: ${bg}`,
      `color: ${color}`,
      `border: ${border}`,
      boxShadow !== "none" ? `box-shadow: ${boxShadow}` : null,
      `font-family: '${FONT_FAMILY}', sans-serif`,
      `font-size: ${cfg.fontSize}px`,
      `font-weight: 600`,
      `cursor: ${isDisabled ? "not-allowed" : "pointer"}`,
      isDisabled ? `opacity: 0.6` : null,
    ]
      .filter(Boolean)
      .map((l) => `  ${l};`)
      .join("\n");

    return `<button style="\n${styleLines}\n"${isDisabled ? " disabled" : ""}>\n${children}\n</button>`;
  }, [buttonStyle, buttonState, size, iconPosition, leftIcon, rightIcon, buttonText, showText, tokens, cfg]);

  return (
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Buttons</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente botón del sistema de diseño.
          </p>
        </div>

        {/* ── Preview ─────────────────────────────────────────────────── */}
          <div className="mb-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl relative overflow-hidden min-h-[280px]">
            {/* Divider between header (title + code button) and the preview content */}
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
              <ButtonPreview
                buttonStyle={buttonStyle}
                buttonState={effectiveButtonState}
                size={size}
                text={buttonText}
                showText={showText}
                iconPosition={iconPosition}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                tokens={tokens}
                onMouseEnter={() => {
                  if (buttonState === "Enabled") setPreviewHover(true);
                }}
                onMouseLeave={() => {
                  if (buttonState === "Enabled") {
                    setPreviewHover(false);
                    setPreviewPressed(false);
                  }
                }}
                onMouseDown={() => {
                  if (buttonState === "Enabled") setPreviewPressed(true);
                }}
                onMouseUp={() => {
                  if (buttonState === "Enabled") setPreviewPressed(false);
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Component Spec ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Typography */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Typography
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Font family" value={FONT_FAMILY} />
              <SpecRow label="Font size" value={`${cfg.fontSize}px`} />
              <SpecRow label="Font weight" value="600 (Semibold)" />
              <SpecRow label="Line height" value="normal" />
            </div>
          </div>

          {/* Border */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Border & Spacing
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Border radius" value={`${BORDER_RADIUS}px`} />
              <SpecRow label="Border width" value={buttonStyle === "Outlined" ? "1px" : "0px"} />
              <SpecRow label="Padding X" value={`${cfg.paddingX}px`} />
              <SpecRow label="Padding Y" value={`${cfg.paddingY}px`} />
              <SpecRow label="Gap" value="4px" />
            </div>
          </div>

          {/* Colors */}
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
        </div>
      </div>

      {/* ── Right Panel (Control Panel) ───────────────────────────────── */}
      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Controls</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure the button properties</p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Button Style */}
          <SegmentedControl
            label="Style"
            value={buttonStyle}
            options={[
              { value: "Primary", label: "Primary" },
              { value: "Outlined", label: "Outlined" },
              { value: "Link", label: "Link" },
            ]}
            onChange={setButtonStyle}
          />

          {/* State */}
          <SegmentedControl
            label="State"
            value={buttonState}
            options={[
              { value: "Enabled", label: "Default" },
              { value: "Hover", label: "Hover" },
              { value: "Press", label: "Press" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setButtonState}
          />

          {/* Size */}
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { value: "sm", label: "SM" },
              { value: "md", label: "MD" },
              { value: "lg", label: "LG" },
              { value: "xl", label: "XL" },
            ]}
            onChange={setSize}
          />

          {/* Icon position */}
          <SegmentedControl
            label="Icon Position"
            value={iconPosition}
            options={[
              { value: "none", label: "None" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "both", label: "Both" },
            ]}
            onChange={setIconPosition}
          />

          {/* Left icon */}
          {(iconPosition === "left" || iconPosition === "both") && (
            <ControlSelect
              label="Left Icon"
              value={leftIcon}
              options={allMaterialIconNames.map((i) => ({ value: i, label: i.replace(/_/g, " ") }))}
              onChange={setLeftIcon}
            />
          )}

          {/* Right icon */}
          {(iconPosition === "right" || iconPosition === "both") && (
            <ControlSelect
              label="Right Icon"
              value={rightIcon}
              options={allMaterialIconNames.map((i) => ({ value: i, label: i.replace(/_/g, " ") }))}
              onChange={setRightIcon}
            />
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Toggle: show/hide text */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Texto
              </span>
              <Switch
                checked={showText}
                onCheckedChange={(v) => setShowText(v)}
                aria-label="Mostrar texto en el botón"
                style={showText ? { backgroundColor: buttonPrimaryBlue } : undefined}
              />
            </label>
          </div>

          {/* Text input (solo si está activado el switch) */}
          {showText && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
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
                <span className="text-gray-500 dark:text-gray-400">Style</span>
                <span className="text-gray-900 dark:text-white font-medium">{buttonStyle}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">State</span>
                <span className="text-gray-900 dark:text-white font-medium">{buttonState}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Size</span>
                <span className="text-gray-900 dark:text-white font-medium">{SIZE_CONFIG[size].label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Font size</span>
                <span className="text-gray-900 dark:text-white font-mono">{cfg.fontSize}px</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Padding</span>
                <span className="text-gray-900 dark:text-white font-mono">{cfg.paddingY}px {cfg.paddingX}px</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Radius</span>
                <span className="text-gray-900 dark:text-white font-mono">{BORDER_RADIUS}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Button — ${buttonStyle} / ${buttonState} / ${SIZE_CONFIG[size].label}`}
          code={buttonCodeSnippet}
        />
      )}
    </div>
  );
}
