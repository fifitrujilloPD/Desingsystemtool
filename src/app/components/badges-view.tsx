import { useState, useMemo } from "react";
import { useTheme } from "./theme-provider";
import { ChevronDown, CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { CodeModal } from "./code-modal";
import { allMaterialIconNames } from "../data/material-icon-catalog";

// ─── Types ──────────────────────────────────────────────────────────────────

type BadgeSize = "sm" | "md" | "lg";
type BadgeType = "Text" | "dot" | "icon";
type BadgeStyle = "8 px border" | "Full border";
type BadgeColor =
  | "Outline"
  | "Brand"
  | "gray"
  | "Red"
  | "Green"
  | "Yellow"
  | "Orange"
  | "Purple"
  | "Pinck"
  | "Blue";

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

// ─── Constants from Figma tokens ────────────────────────────────────────────

const FONT_FAMILY =
  (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value || "Roboto";

const SIZE_CONFIG: Record<BadgeSize, { fontSize: number; paddingX: number; paddingY: number; iconSize: number; gap: number; label: string }> = {
  sm: { fontSize: 14, paddingX: 8, paddingY: 4, iconSize: 18, gap: 8, label: "Small" },
  md: { fontSize: 14, paddingX: 8, paddingY: 6, iconSize: 20, gap: 8, label: "Medium" },
  lg: { fontSize: 16, paddingX: 10, paddingY: 8, iconSize: 24, gap: 8, label: "Large" },
};

const CORNER_SMALL = 8;
const CORNER_FULL = 1000;

interface DotColorOption {
  label: string;
  hex: string;
  tokenName: string;
}

function getDotColorOptions(tokens: any): DotColorOption[] {
  const resolve = (path: string) => resolveColor(tokens, path);
  return [
    { label: "Brand", hex: resolve("global.color.Text colors.text-primary-brand"), tokenName: "text-primary-brand" },
    { label: "Secondary", hex: resolve("global.color.Text colors.text-secondary"), tokenName: "text-secondary" },
    { label: "Error", hex: resolve("global.color.Text colors.text-error"), tokenName: "text-error" },
    { label: "Success", hex: resolve("global.color.Text colors.text-success"), tokenName: "text-success" },
    { label: "Warning", hex: resolve("global.color.Text colors.text-warnning"), tokenName: "text-warnning" },
    { label: "Orange", hex: resolve("global.color.Text colors.text-orange"), tokenName: "text-orange" },
    { label: "Purple", hex: resolve("global.color.Text colors.text-purple"), tokenName: "text-purple" },
    { label: "Pink", hex: resolve("global.color.Text colors.text-pink"), tokenName: "text-pink" },
    { label: "Blue", hex: resolve("global.color.Text colors.text-blue"), tokenName: "text-blue" },
  ];
}

interface ColorDef {
  label: string;
  key: BadgeColor;
  bg: string;
  text: string;
  border: string;
}

function getColorDefs(tokens: any): ColorDef[] {
  return [
    {
      label: "Outline",
      key: "Outline",
      bg: "transparent",
      text: resolveColor(tokens, "global.color.Text colors.text-secondary"),
      border: resolveColor(tokens, "global.color.Border color.border-primary"),
    },
    {
      label: "Brand",
      key: "Brand",
      bg: resolveColor(tokens, "global.color.Background.bg-brand-ships"),
      text: resolveColor(tokens, "global.color.Text colors.text-primary-brand"),
      border: resolveColor(tokens, "global.color.Border color.border-brand"),
    },
    {
      label: "Gray",
      key: "gray",
      bg: resolveColor(tokens, "global.color.Background.bg-primary"),
      text: resolveColor(tokens, "global.color.Text colors.text-secondary"),
      border: resolveColor(tokens, "global.color.Border color.border-secondary"),
    },
    {
      label: "Red",
      key: "Red",
      bg: resolveColor(tokens, "global.color.Background.bg-error"),
      text: resolveColor(tokens, "global.color.Text colors.text-error"),
      border: resolveColor(tokens, "global.color.Border color.border-error"),
    },
    {
      label: "Green",
      key: "Green",
      bg: resolveColor(tokens, "global.color.Background.bg-success"),
      text: resolveColor(tokens, "global.color.Text colors.text-success"),
      border: resolveColor(tokens, "global.color.Border color.border-success"),
    },
    {
      label: "Yellow",
      key: "Yellow",
      bg: resolveColor(tokens, "global.color.Background.bg-warnning"),
      text: resolveColor(tokens, "global.color.Text colors.text-warnning"),
      border: resolveColor(tokens, "global.color.Border color.border-warning"),
    },
    {
      label: "Orange",
      key: "Orange",
      bg: resolveColor(tokens, "global.color.Background.bg-orange"),
      text: resolveColor(tokens, "global.color.Text colors.text-orange"),
      border: resolveColor(tokens, "global.color.Border color.border-orange"),
    },
    {
      label: "Purple",
      key: "Purple",
      bg: resolveColor(tokens, "global.color.Background.bg-purple"),
      text: resolveColor(tokens, "global.color.Text colors.text-purple"),
      border: resolveColor(tokens, "global.color.Border color.border-purple"),
    },
    {
      label: "Pink",
      key: "Pinck",
      bg: resolveColor(tokens, "global.color.Background.bg-pink"),
      text: resolveColor(tokens, "global.color.Text colors.text-pink"),
      border: resolveColor(tokens, "global.color.Border color.border-pink"),
    },
    {
      label: "Blue",
      key: "Blue",
      bg: resolveColor(tokens, "global.color.Background.bg-blue"),
      text: resolveColor(tokens, "global.color.Text colors.text-blue"),
      border: resolveColor(tokens, "global.color.Border color.border-blue"),
    },
  ];
}

// ─── Badge preview component ────────────────────────────────────────────────

function BadgePreview({
  badgeSize,
  badgeType,
  badgeStyle,
  badgeColor,
  badgeIconName,
  labelText,
  showTrailingIcon,
  colorDefs,
  dotColorOverride,
}: {
  badgeSize: BadgeSize;
  badgeType: BadgeType;
  badgeStyle: BadgeStyle;
  badgeColor: BadgeColor;
  badgeIconName?: string;
  labelText: string;
  showTrailingIcon: boolean;
  colorDefs: ColorDef[];
  dotColorOverride?: string | null;
}) {
  const cfg = SIZE_CONFIG[badgeSize];
  const cd = colorDefs.find((c) => c.key === badgeColor) || colorDefs[0];
  const radius = badgeStyle === "Full border" ? CORNER_FULL : CORNER_SMALL;

  const isOutline = badgeColor === "Outline";
  const effectiveDotColor = (isOutline && dotColorOverride) ? dotColorOverride : cd.text;

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "clip",
    borderRadius: radius,
    border: `1px solid ${cd.border}`,
    backgroundColor: isOutline ? "transparent" : cd.bg,
    position: "relative",
  };

  const stateLayerPadding: React.CSSProperties =
    badgeType === "icon"
      ? { paddingLeft: 6, paddingRight: cfg.paddingX, paddingTop: cfg.paddingY, paddingBottom: cfg.paddingY, gap: 4 }
      : { paddingLeft: cfg.paddingX, paddingRight: cfg.paddingX, paddingTop: cfg.paddingY, paddingBottom: cfg.paddingY, gap: cfg.gap };

  const stateLayerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
    ...stateLayerPadding,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: cfg.fontSize,
    fontWeight: 400,
    lineHeight: `${cfg.fontSize + 6}px`,
    color: cd.text,
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  const dotSize = badgeSize === "sm" ? 6 : badgeSize === "md" ? 7 : 8;

  return (
    <div style={containerStyle}>
      <div style={stateLayerStyle}>
        {badgeType === "dot" && (
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: effectiveDotColor,
              flexShrink: 0,
            }}
          />
        )}

        {badgeType === "icon" && (
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: cfg.iconSize,
              color: cd.text,
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              flexShrink: 0,
            }}
          >
            {badgeIconName || "radio_button_unchecked"}
          </span>
        )}

        <span style={textStyle}>{labelText}</span>

        {showTrailingIcon && (
          <span
            className="material-symbols-rounded"
            style={{
              fontSize: 18,
              color: cd.text,
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              flexShrink: 0,
            }}
          >
            close
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Reusable spec components ───────────────────────────────────────────────

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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-mono text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

// ─── Main view ──────────────────────────────────────────────────────────────

export function BadgesView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const accentBlue = resolveColor(tokens, "global.color.Button color.button-color");

  const [badgeSize, setBadgeSize] = useState<BadgeSize>("md");
  const [badgeType, setBadgeType] = useState<BadgeType>("Text");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>("8 px border");
  const [badgeColor, setBadgeColor] = useState<BadgeColor>("Brand");
  const [badgeIconName, setBadgeIconName] = useState<string>("radio_button_unchecked");
  const [labelText, setLabelText] = useState("Label");
  const [showTrailingIcon, setShowTrailingIcon] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [dotColorOpen, setDotColorOpen] = useState(false);
  const [dotColorOverride, setDotColorOverride] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const colorDefs = useMemo(() => getColorDefs(tokens), [theme]);
  const dotColorOptions = useMemo(() => getDotColorOptions(tokens), [theme]);
  const currentColor = colorDefs.find((c) => c.key === badgeColor) || colorDefs[0];
  const cfg = SIZE_CONFIG[badgeSize];
  const showDotColorPicker = badgeColor === "Outline" && badgeType === "dot";
  const activeDotHex = (showDotColorPicker && dotColorOverride) ? dotColorOverride : currentColor.text;
  const activeDotOption = dotColorOptions.find((o) => o.hex === dotColorOverride);

  const badgeCodeSnippet = useMemo(() => {
    const cd = colorDefs.find((c) => c.key === badgeColor) || colorDefs[0];
    const radius = badgeStyle === "Full border" ? CORNER_FULL : CORNER_SMALL;
    const isOutline = badgeColor === "Outline";

    const indent = "  ";
    const dotSize = badgeSize === "sm" ? 6 : badgeSize === "md" ? 7 : 8;

    const effectiveDot = (badgeColor === "Outline" && dotColorOverride) ? dotColorOverride : cd.text;

    const children: string[] = [];
    if (badgeType === "dot") {
      children.push(
        `${indent}<span style="width: ${dotSize}px; height: ${dotSize}px; border-radius: 50%; background: ${effectiveDot}; display: inline-block;"></span>`
      );
    }
    if (badgeType === "icon") {
      children.push(
        `${indent}<span class="material-symbols-rounded" style="font-size: ${cfg.iconSize}px; color: ${cd.text};">${badgeIconName}</span>`
      );
    }
    children.push(`${indent}<span>${labelText}</span>`);
    if (showTrailingIcon) {
      children.push(
        `${indent}<span class="material-symbols-rounded" style="font-size: 18px; color: ${cd.text};">close</span>`
      );
    }

    const paddingStr =
      badgeType === "icon"
        ? `padding: ${cfg.paddingY}px ${cfg.paddingX}px ${cfg.paddingY}px 6px`
        : `padding: ${cfg.paddingY}px ${cfg.paddingX}px`;

    const gapStr = badgeType === "icon" ? "4px" : `${cfg.gap}px`;

    const styleLines = [
      `display: inline-flex`,
      `align-items: center`,
      `gap: ${gapStr}`,
      paddingStr,
      `border-radius: ${radius}px`,
      `background: ${isOutline ? "transparent" : cd.bg}`,
      `border: 1px solid ${cd.border}`,
      `color: ${cd.text}`,
      `font-family: '${FONT_FAMILY}', sans-serif`,
      `font-size: ${cfg.fontSize}px`,
      `font-weight: 400`,
      `line-height: ${cfg.fontSize + 6}px`,
    ]
      .map((l) => `  ${l};`)
      .join("\n");

    return `<div style="\n${styleLines}\n">\n${children.join("\n")}\n</div>`;
  }, [badgeSize, badgeType, badgeStyle, badgeColor, badgeIconName, labelText, showTrailingIcon, colorDefs, cfg, dotColorOverride]);

  return (
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Badges</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente badge del sistema de diseño.
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
              <BadgePreview
                badgeSize={badgeSize}
                badgeType={badgeType}
                badgeStyle={badgeStyle}
                badgeColor={badgeColor}
                badgeIconName={badgeIconName}
                labelText={labelText}
                showTrailingIcon={showTrailingIcon}
                colorDefs={colorDefs}
                dotColorOverride={showDotColorPicker ? dotColorOverride : null}
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
              <SpecRow label="Font weight" value="400 (Regular)" />
              <SpecRow label="Line height" value={`${cfg.fontSize + 6}px`} />
            </div>
          </div>

          {/* Border & Spacing */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Border & Spacing
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Border radius" value={badgeStyle === "Full border" ? `${CORNER_FULL}px (pill)` : `${CORNER_SMALL}px`} />
              <SpecRow label="Border width" value="1px" />
              <SpecRow label="Padding X" value={badgeType === "icon" ? `6px / ${cfg.paddingX}px` : `${cfg.paddingX}px`} />
              <SpecRow label="Padding Y" value={`${cfg.paddingY}px`} />
              <SpecRow label="Gap" value={badgeType === "icon" ? "4px" : `${cfg.gap}px`} />
            </div>
          </div>

          {/* Colors (Current variant) */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Colors — {currentColor.label}
            </h3>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              <StateColorCard label="Background" hex={currentColor.bg === "transparent" ? "#FFFFFF" : currentColor.bg} tokenName={currentColor.key === "Outline" ? "transparent" : `bg-${currentColor.key.toLowerCase()}`} />
              <StateColorCard label="Text" hex={currentColor.text} tokenName={`text-${currentColor.key.toLowerCase()}`} />
              <StateColorCard label="Border" hex={currentColor.border} tokenName={`border-${currentColor.key.toLowerCase()}`} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Right Panel (Control Panel) ───────────────────────────────── */}
      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Controls</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure the badge properties</p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setColorOpen(!colorOpen)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                  style={{
                    backgroundColor:
                      badgeColor === "Outline" ? "transparent" : currentColor.bg,
                    borderColor: badgeColor === "Outline" ? currentColor.border : currentColor.border,
                  }}
                />
                <span className="truncate">{`COLOR ${currentColor.label}`}</span>
                <span className="ml-auto text-gray-400 font-mono text-[10px]">
                  {badgeColor === "Outline" ? currentColor.border : currentColor.bg}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    colorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {colorOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setColorOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {colorDefs.map((cd) => {
                      const swatchBg = cd.key === "Outline" ? "transparent" : cd.bg;
                      const swatchBorder = cd.border;
                      const optionHex = cd.key === "Outline" ? cd.border : cd.bg;
                      const selected = badgeColor === cd.key;

                      return (
                        <button
                          key={cd.key}
                          type="button"
                          onClick={() => {
                            setBadgeColor(cd.key);
                            setColorOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                            selected
                              ? "bg-blue-50 dark:bg-blue-950 ring-1 ring-inset ring-blue-500"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                            style={{ backgroundColor: swatchBg, borderColor: swatchBorder }}
                          />
                          <span className="text-gray-700 dark:text-gray-300 truncate">
                            {`COLOR ${cd.label}`}
                          </span>
                          <span className="ml-auto text-gray-400 text-[10px] font-mono">
                            {optionHex}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Type */}
          <SegmentedControl
            label="Type"
            value={badgeType}
            options={[
              { value: "Text", label: "Text" },
              { value: "dot", label: "Dot" },
              { value: "icon", label: "Icon" },
            ]}
            onChange={setBadgeType}
          />

          {/* Size */}
          <SegmentedControl
            label="Size"
            value={badgeSize}
            options={[
              { value: "sm", label: "SM" },
              { value: "md", label: "MD" },
              { value: "lg", label: "LG" },
            ]}
            onChange={setBadgeSize}
          />

          {/* Style (border shape) */}
          <SegmentedControl
            label="Style"
            value={badgeStyle}
            options={[
              { value: "8 px border", label: "Rounded" },
              { value: "Full border", label: "Pill" },
            ]}
            onChange={setBadgeStyle}
          />

          {/* Dot Color — only visible for Outline + Dot */}
          {showDotColorPicker && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Dot Color
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDotColorOpen(!dotColorOpen)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: activeDotHex }}
                  />
                  <span className="truncate">{activeDotOption?.label || "Default"}</span>
                  <span className="ml-auto text-gray-400 font-mono text-[10px]">{activeDotHex}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${dotColorOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dotColorOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDotColorOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {dotColorOptions.map((opt) => {
                        const selected = dotColorOverride === opt.hex;
                        return (
                          <button
                            key={opt.tokenName}
                            type="button"
                            onClick={() => {
                              setDotColorOverride(opt.hex);
                              setDotColorOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${
                              selected
                                ? "bg-blue-50 dark:bg-blue-950 ring-1 ring-inset ring-blue-500"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                              style={{ backgroundColor: opt.hex }}
                            />
                            <span className="text-gray-700 dark:text-gray-300 truncate">{opt.label}</span>
                            <span className="ml-auto text-gray-400 text-[10px] font-mono">{opt.hex}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Icon selector (only when type is Icon) */}
          {badgeType === "icon" && (
            <ControlSelect
              label="Icon"
              value={badgeIconName}
              options={allMaterialIconNames.map((i) => ({
                value: i,
                label: i.replace(/_/g, " "),
              }))}
              onChange={setBadgeIconName}
            />
          )}

          {/* Trailing icon toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trailing Icon
              </span>
              <Switch
                checked={showTrailingIcon}
                onCheckedChange={setShowTrailingIcon}
                aria-label="Show trailing icon"
                style={showTrailingIcon ? { backgroundColor: accentBlue } : undefined}
              />
            </label>
          </div>

          {/* Label text */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Badge Text
            </label>
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Quick reference */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Current Config
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Color</span>
                <span className="text-gray-900 dark:text-white font-medium">{currentColor.label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white font-medium">{badgeType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Size</span>
                <span className="text-gray-900 dark:text-white font-medium">{SIZE_CONFIG[badgeSize].label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Style</span>
                <span className="text-gray-900 dark:text-white font-medium">{badgeStyle === "Full border" ? "Pill" : "Rounded"}</span>
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
                <span className="text-gray-900 dark:text-white font-mono">{badgeStyle === "Full border" ? `${CORNER_FULL}px` : `${CORNER_SMALL}px`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Badge — ${currentColor.label} / ${badgeType} / ${SIZE_CONFIG[badgeSize].label} / ${badgeStyle === "Full border" ? "Pill" : "Rounded"}`}
          code={badgeCodeSnippet}
        />
      )}
    </div>
  );
}
