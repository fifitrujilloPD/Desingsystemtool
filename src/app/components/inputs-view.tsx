import { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import { CodeModal } from "./code-modal";

// ─── Types ──────────────────────────────────────────────────────────────────

type InputType = "Label text" | "Input text" | "Number";
type InputState = "Default" | "Focused" | "Filled" | "Error" | "Disabled";
type IconPosition = "none" | "left";

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

// ─── Constants ──────────────────────────────────────────────────────────────

const FONT_FAMILY = (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value || "Roboto";
const INPUT_RADIUS = 8;
const INPUT_PADDING_X = 12;
const INPUT_PADDING_Y = 14;

const MATERIAL_SYMBOL_STYLE: React.CSSProperties = {
  fontSize: 20,
  color: "inherit",
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
};

const COUNTRY_LIST = [
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+1", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+51", flag: "🇵🇪", name: "Perú" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "+34", flag: "🇪🇸", name: "España" },
  { code: "+44", flag: "🇬🇧", name: "Reino Unido" },
  { code: "+49", flag: "🇩🇪", name: "Alemania" },
  { code: "+33", flag: "🇫🇷", name: "Francia" },
  { code: "+39", flag: "🇮🇹", name: "Italia" },
  { code: "+81", flag: "🇯🇵", name: "Japón" },
  { code: "+82", flag: "🇰🇷", name: "Corea del Sur" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
];

// ─── Input preview component ────────────────────────────────────────────────

function InputPreview({
  inputType,
  inputState,
  showIcon,
  iconName,
  labelText,
  valueText,
  placeholderText,
  helperText,
  showHelper,
  showRequired,
  numberPrefix,
  tokens,
  onValueChange,
  onPrefixChange,
  onFocus,
  onBlur,
}: {
  inputType: InputType;
  inputState: InputState;
  showIcon: boolean;
  iconName: string;
  labelText: string;
  valueText: string;
  placeholderText: string;
  helperText: string;
  showHelper: boolean;
  showRequired: boolean;
  numberPrefix: string;
  tokens: any;
  onValueChange?: (value: string) => void;
  onPrefixChange?: (code: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const borderPrimary = resolveColor(tokens, "global.color.Border color.border-primary");
  const borderFocus = resolveColor(tokens, "global.color.Button color.button-color");
  const borderFocusHover = resolveColor(tokens, "global.color.Button color.button-hover");
  const borderError = resolveColor(tokens, "global.color.Text colors.text-error");
  // Disabled border uses the same neutral as "primary" per browser preview + Figma variants.
  const borderDisabled = borderPrimary;
  const textPrimary = resolveColor(tokens, "global.color.Text colors.text-primary");
  const textSecondary = resolveColor(tokens, "global.color.Text colors.text-secondary");
  const textDisabled = resolveColor(tokens, "global.color.Text colors.text-disabled");
  const textError = resolveColor(tokens, "global.color.Text colors.text-error");
  const bgContainer = resolveColor(tokens, "global.color.Background.bg-container");

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRY_LIST.find((c) => c.code === numberPrefix) || COUNTRY_LIST[0];

  const filteredCountries = countrySearch
    ? COUNTRY_LIST.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch),
      )
    : COUNTRY_LIST;

  useEffect(() => {
    if (!countryOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCountrySearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [countryOpen]);

  const isDisabled = inputState === "Disabled";
  const isError = inputState === "Error";
  const isFocused = inputState === "Focused";
  const isFilled = inputState === "Filled";
  const isFloating = inputType === "Input text";
  const isNumber = inputType === "Number";
  const hasValue = valueText.trim().length > 0;

  const borderColor = isError
    ? borderError
    : isFocused
      ? borderFocusHover
      : isDisabled
        ? borderDisabled
        : borderPrimary;

  /** Focus (no error): 1.5px + token button-hover; resto 1px */
  const inputBorderWidth = isFocused && !isError ? 1.5 : 1;

  const labelColor = isDisabled
    ? textDisabled
    : isError
      ? textPrimary
      : isFocused
        ? textSecondary
        : isFilled
          ? textPrimary
          : textSecondary;

  const valueColor = isDisabled ? textDisabled : textPrimary;

  const helperColor = isError ? textError : isDisabled ? textDisabled : textSecondary;

  const iconColor = isDisabled ? textDisabled : isFocused || isFilled ? textPrimary : textSecondary;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: INPUT_PADDING_X,
    paddingRight: 14,
    paddingTop: INPUT_PADDING_Y,
    paddingBottom: INPUT_PADDING_Y,
    borderRadius: INPUT_RADIUS,
    border: `${inputBorderWidth}px solid ${borderColor}`,
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: 16,
    lineHeight: "24px",
    position: "relative",
    width: "100%",
    maxWidth: 320,
    minWidth: 0,
    boxSizing: "border-box",
    cursor: isDisabled ? "not-allowed" : "text",
    opacity: isDisabled ? 0.7 : 1,
    backgroundColor: "transparent",
    transition: "border-color 0.15s ease, border-width 0.15s ease",
  };

  const numberLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: INPUT_PADDING_X,
    paddingRight: 12,
    paddingTop: INPUT_PADDING_Y,
    paddingBottom: INPUT_PADDING_Y,
    borderTopLeftRadius: INPUT_RADIUS,
    borderBottomLeftRadius: INPUT_RADIUS,
    border: `${inputBorderWidth}px solid ${borderColor}`,
    borderRight: "none",
    width: 88,
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: 16,
    lineHeight: "24px",
    color: isDisabled ? textDisabled : textPrimary,
    backgroundColor: "transparent",
    opacity: isDisabled ? 0.7 : 1,
  };

  const numberRightStyle: React.CSSProperties = {
    ...containerStyle,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: INPUT_RADIUS,
    borderBottomRightRadius: INPUT_RADIUS,
    borderLeft: "none",
    width: 232,
  };

  useEffect(() => {
    const input = document.getElementById("input-preview-field") as HTMLInputElement | null;
    if (!input) return;
    if (isFocused && !isDisabled) {
      input.focus();
    }
  }, [isFocused, isDisabled]);

  return (
    <div style={{ width: "100%", maxWidth: 320, minWidth: 0, boxSizing: "border-box" }}>
      {isNumber ? (
        <div style={{ display: "flex", width: "100%", maxWidth: 320, minWidth: 0, position: "relative" }} ref={dropdownRef}>
          <div
            style={{ ...numberLeftStyle, cursor: isDisabled ? "not-allowed" : "pointer" }}
            onClick={() => { if (!isDisabled) { setCountryOpen(!countryOpen); setCountrySearch(""); } }}
          >
            <span style={{ fontSize: 16, lineHeight: "20px" }}>{selectedCountry.flag}</span>
            <span
              className="material-symbols-rounded"
              style={{
                ...MATERIAL_SYMBOL_STYLE,
                fontSize: 18,
                color: isDisabled ? textDisabled : textPrimary,
                transition: "transform 0.2s",
                transform: countryOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              keyboard_arrow_down
            </span>
          </div>

          {countryOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 4,
                width: 280,
                maxHeight: 240,
                overflowY: "auto",
                backgroundColor: bgContainer,
                border: `1px solid ${borderPrimary}`,
                borderRadius: INPUT_RADIUS,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 50,
                fontFamily: `'${FONT_FAMILY}', sans-serif`,
              }}
            >
              <div style={{ position: "sticky", top: 0, backgroundColor: bgContainer, padding: 8, borderBottom: `1px solid ${borderPrimary}` }}>
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Buscar país..."
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 13,
                    border: `1px solid ${borderPrimary}`,
                    borderRadius: 6,
                    outline: "none",
                    fontFamily: `'${FONT_FAMILY}', sans-serif`,
                    color: textPrimary,
                    backgroundColor: "transparent",
                  }}
                />
              </div>
              {filteredCountries.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onPrefixChange?.(c.code);
                    setCountryOpen(false);
                    setCountrySearch("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontSize: 14,
                    color: c.code === numberPrefix ? borderFocus : textPrimary,
                    fontWeight: c.code === numberPrefix ? 600 : 400,
                    backgroundColor: c.code === numberPrefix ? `${borderFocus}10` : "transparent",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => { if (c.code !== numberPrefix) (e.currentTarget.style.backgroundColor = `${borderPrimary}30`); }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = c.code === numberPrefix ? `${borderFocus}10` : "transparent"; }}
                >
                  <span style={{ fontSize: 18 }}>{c.flag}</span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: textSecondary, fontFamily: "monospace" }}>{c.code}</span>
                </div>
              ))}
              {filteredCountries.length === 0 && (
                <div style={{ padding: "16px 12px", fontSize: 13, color: textDisabled, textAlign: "center" }}>
                  Sin resultados
                </div>
              )}
            </div>
          )}

          <div style={numberRightStyle}>
            <input
              id="input-preview-field"
              type="text"
              value={valueText}
              placeholder={placeholderText || "Número"}
              disabled={isDisabled}
              onChange={(e) => onValueChange?.(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{
                flex: 1,
                minWidth: 0,
                fontWeight: 400,
                color: hasValue ? valueColor : labelColor,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                fontFamily: `'${FONT_FAMILY}', sans-serif`,
                fontSize: 16,
                lineHeight: "24px",
              }}
            />
          </div>
        </div>
      ) : (
        <div style={containerStyle}>
        {showIcon && (
          <span
            className="material-symbols-rounded"
            style={{ ...MATERIAL_SYMBOL_STYLE, color: iconColor }}
          >
            {iconName}
          </span>
        )}

        {isFloating && (
          <div
            style={{
              position: "absolute",
              top: -8,
              left: 10,
              right: 10,
              paddingLeft: 4,
              paddingRight: 4,
              backgroundColor: bgContainer,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              fontSize: 12,
              lineHeight: "normal",
              fontFamily: `'${FONT_FAMILY}', sans-serif`,
              boxSizing: "border-box",
              minWidth: 0,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <span
              style={{
                color: isDisabled ? textDisabled : textPrimary,
                flex: "1 1 auto",
                minWidth: 0,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {labelText}
            </span>
            {showRequired && (
              <span style={{ color: isError ? borderError : textError, textAlign: "center", flexShrink: 0 }}>*</span>
            )}
          </div>
        )}

        <input
          id="input-preview-field"
          type="text"
          value={valueText}
          placeholder={placeholderText}
          disabled={isDisabled}
          onChange={(e) => onValueChange?.(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            flex: 1,
            minWidth: 0,
            fontWeight: 400,
            color: hasValue || isFloating ? valueColor : labelColor,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontFamily: `'${FONT_FAMILY}', sans-serif`,
            fontSize: 16,
            lineHeight: "24px",
          }}
        />
      </div>
      )}

      {showHelper && (
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: 8,
            paddingRight: 4,
            marginTop: 2,
            fontSize: 14,
            lineHeight: "20px",
            fontFamily: `'${FONT_FAMILY}', sans-serif`,
            color: helperColor,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {helperText}
        </div>
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

export function InputsView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const accentBlue = resolveColor(tokens, "global.color.Button color.button-color");

  const [inputType, setInputType] = useState<InputType>("Label text");
  const [inputState, setInputState] = useState<InputState>("Default");
  const [iconPosition, setIconPosition] = useState<IconPosition>("left");
  const [iconName, setIconName] = useState("radio_button_unchecked");
  const [labelText, setLabelText] = useState("Tipo de documento");
  const [numberPrefix, setNumberPrefix] = useState("+57");
  const [valueText, setValueText] = useState("Label");
  const [placeholderText, setPlaceholderText] = useState("Label");
  const [helperText, setHelperText] = useState("Subtitle");
  const [showHelper, setShowHelper] = useState(true);
  const [showRequired, setShowRequired] = useState(true);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewFocused, setPreviewFocused] = useState(false);

  const showIcon = iconPosition !== "none";

  const effectiveState: InputState =
    inputState === "Default" && previewFocused ? "Focused" : inputState;

  useEffect(() => {
    if (inputState !== "Default") setPreviewFocused(false);
  }, [inputState]);

  const stateColors = useMemo(() => {
    const t = tokens as any;
    return [
      { label: "Default", hex: resolveColor(t, "global.color.Border color.border-primary"), tokenName: "border-primary" },
      { label: "Focused", hex: resolveColor(t, "global.color.Button color.button-hover"), tokenName: "button-hover (1.5px)" },
      { label: "Error", hex: resolveColor(t, "global.color.Text colors.text-error"), tokenName: "text-error" },
      { label: "Disabled", hex: resolveColor(t, "global.color.Border color.border-primary"), tokenName: "border-primary" },
    ];
  }, [theme]);

  const textColors = useMemo(() => {
    const t = tokens as any;
    return [
      { label: "Primary", hex: resolveColor(t, "global.color.Text colors.text-primary"), tokenName: "text-primary" },
      { label: "Secondary", hex: resolveColor(t, "global.color.Text colors.text-secondary"), tokenName: "text-secondary" },
      { label: "Disabled", hex: resolveColor(t, "global.color.Text colors.text-disabled"), tokenName: "text-disabled" },
      { label: "Error", hex: resolveColor(t, "global.color.Text colors.text-error"), tokenName: "text-error" },
    ];
  }, [theme]);

  const codeSnippet = useMemo(() => {
    const t = tokens as any;
    const borderPrimary = resolveColor(t, "global.color.Border color.border-primary");
    const borderFocusHover = resolveColor(t, "global.color.Button color.button-hover");
    const borderError = resolveColor(t, "global.color.Text colors.text-error");
    const textPri = resolveColor(t, "global.color.Text colors.text-primary");
    const textSec = resolveColor(t, "global.color.Text colors.text-secondary");
    const textDis = resolveColor(t, "global.color.Text colors.text-disabled");
    const textErr = resolveColor(t, "global.color.Text colors.text-error");

    const isDisabled = inputState === "Disabled";
    const isError = inputState === "Error";
    const isFocused = inputState === "Focused";

    const border = isError
      ? borderError
      : isFocused
        ? borderFocusHover
        : isDisabled
          ? borderPrimary
          : borderPrimary;

    const borderW = isFocused && !isError ? 1.5 : 1;

    const color = isDisabled ? textDis : isError ? textErr : textPri;
    const placeholderColor = isDisabled ? textDis : textSec;

    const indent = "  ";
    const iconHtml = showIcon
      ? `\n${indent}<span class="material-symbols-rounded" style="font-size: 20px">${iconName}</span>`
      : "";

    const floatingLabel = inputType === "Input text"
      ? `\n${indent}<label style="position: absolute; top: -8px; left: 10px; right: 10px; padding: 0 4px; font-size: 12px; background: #fff; display: flex; flex-wrap: wrap; align-items: center; gap: 2px; box-sizing: border-box; min-width: 0; word-break: break-word; overflow-wrap: break-word;">${labelText}${showRequired ? " *" : ""}</label>`
      : "";

    const styleLines = [
      `display: flex`,
      `align-items: center`,
      `gap: 8px`,
      `padding: ${INPUT_PADDING_Y}px ${INPUT_PADDING_X}px`,
      `border-radius: ${INPUT_RADIUS}px`,
      `border: ${borderW}px solid ${border}`,
      `color: ${color}`,
      `font-family: '${FONT_FAMILY}', sans-serif`,
      `font-size: 16px`,
      `line-height: 24px`,
      `width: 320px`,
      `position: relative`,
      isDisabled ? `opacity: 0.7` : null,
      isDisabled ? `cursor: not-allowed` : null,
    ]
      .filter(Boolean)
      .map((l) => `  ${l};`)
      .join("\n");

    let html = "";
    if (inputType === "Number") {
      html = `<div style="display: flex; width: 320px;">\n${indent}<div style="display: flex; align-items: center; gap: 8px; width: 88px; padding: ${INPUT_PADDING_Y}px ${INPUT_PADDING_X}px; border: ${borderW}px solid ${border}; border-right: none; border-radius: ${INPUT_RADIUS}px 0 0 ${INPUT_RADIUS}px;">\n${indent}  <span>🇨🇴</span>\n${indent}  <span class="material-symbols-rounded" style="font-size: 18px">keyboard_arrow_down</span>\n${indent}</div>\n${indent}<div style="display: flex; align-items: center; flex: 1; padding: ${INPUT_PADDING_Y}px ${INPUT_PADDING_X}px; border: ${borderW}px solid ${border}; border-left: none; border-radius: 0 ${INPUT_RADIUS}px ${INPUT_RADIUS}px 0;">\n${indent}  <input type="text" value="${valueText}" placeholder="${placeholderText}" style="border: none; outline: none; flex: 1; font: inherit; color: inherit; background: transparent;"${isDisabled ? " disabled" : ""} />\n${indent}</div>\n</div>`;
    } else {
      html = `<div style="\n${styleLines}\n">${floatingLabel}${iconHtml}\n${indent}<input\n${indent}  type="text"\n${indent}  placeholder="${placeholderText}"\n${indent}  value="${valueText}"\n${indent}  style="border: none; outline: none; flex: 1; font: inherit; color: inherit; background: transparent;"`;
      if (isDisabled) html += `\n${indent}  disabled`;
      html += `\n${indent}/>\n</div>`;
    }

    if (showHelper) {
      html += `\n<p style="width: 100%; max-width: 320px; box-sizing: border-box; padding-left: 8px; padding-right: 4px; margin-top: 2px; font-size: 14px; line-height: 20px; color: ${isError ? textErr : placeholderColor}; word-break: break-word; overflow-wrap: break-word;">${helperText}</p>`;
    }

    return html;
  }, [inputType, inputState, showIcon, iconName, labelText, placeholderText, helperText, showHelper, showRequired, valueText, numberPrefix, tokens]);

  return (
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Inputs</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente input del sistema de diseño.
          </p>
        </div>

        {/* ── Preview ─────────────────────────────────────────────────── */}
        <div className="mb-4">
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl relative overflow-visible min-h-[280px]"
            style={{ boxSizing: "content-box" }}
          >
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
              <InputPreview
                inputType={inputType}
                inputState={effectiveState}
                showIcon={showIcon}
                iconName={iconName}
                labelText={labelText}
                valueText={valueText}
                placeholderText={placeholderText}
                helperText={helperText}
                showHelper={showHelper}
                showRequired={showRequired}
                numberPrefix={numberPrefix}
                tokens={tokens}
                onValueChange={setValueText}
                onPrefixChange={setNumberPrefix}
                onFocus={() => {
                  if (inputState === "Default") setPreviewFocused(true);
                }}
                onBlur={() => {
                  if (inputState === "Default") setPreviewFocused(false);
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
              <SpecRow label="Label size" value="16px / 24px" />
              <SpecRow label="Floating label" value="12px" />
              <SpecRow label="Helper text" value="14px / 20px" />
              <SpecRow label="Font weight" value="400 (Regular)" />
            </div>
          </div>

          {/* Border & Spacing */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Border & Spacing
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Border radius" value={`${INPUT_RADIUS}px`} />
              <SpecRow label="Border width" value="1px (1.5px en focus)" />
              <SpecRow label="Padding X" value={`${INPUT_PADDING_X}px`} />
              <SpecRow label="Padding Y" value={`${INPUT_PADDING_Y}px`} />
              <SpecRow label="Icon gap" value="8px" />
            </div>
          </div>

          {/* Border Colors (States) */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Border Colors (States)
            </h3>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Text Colors
            </h3>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-800">
              {textColors.map((tc) => (
                <StateColorCard key={tc.label} {...tc} />
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Configure the input properties</p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Input Type */}
          <SegmentedControl
            label="Type"
            value={inputType}
            options={[
              { value: "Label text", label: "Default" },
              { value: "Input text", label: "Floating" },
              { value: "Number", label: "Number" },
            ]}
            onChange={setInputType}
          />

          {/* State */}
          <SegmentedControl
            label="State"
            value={inputState}
            options={[
              { value: "Default", label: "Default" },
              { value: "Focused", label: "Focus" },
              { value: "Filled", label: "Filled" },
              { value: "Error", label: "Error" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setInputState}
          />

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Icon toggle */}
          {inputType !== "Number" && (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Icon
                </span>
                <Switch
                  checked={showIcon}
                  onCheckedChange={(v) => setIconPosition(v ? "left" : "none")}
                  aria-label="Mostrar icono"
                  style={showIcon ? { backgroundColor: accentBlue } : undefined}
                />
              </label>
            </div>
          )}

          {/* Icon selector */}
          {inputType !== "Number" && showIcon && (
            <ControlSelect
              label="Icon"
              value={iconName}
              options={allMaterialIconNames.map((i) => ({ value: i, label: i.replace(/_/g, " ") }))}
              onChange={setIconName}
            />
          )}

          {inputType === "Number" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Prefix
              </label>
              <input
                type="text"
                value={numberPrefix}
                onChange={(e) => setNumberPrefix(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Required field toggle */}
          {inputType === "Input text" && (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Required
                </span>
                <Switch
                  checked={showRequired}
                  onCheckedChange={setShowRequired}
                  aria-label="Campo requerido"
                  style={showRequired ? { backgroundColor: accentBlue } : undefined}
                />
              </label>
            </div>
          )}

          {/* Label text (for floating label) */}
          {(inputType === "Input text" || inputType === "Number") && (
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

          {/* Value text (solo en tipo Floating / Input text) */}
          {inputType === "Input text" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Value
              </label>
              <input
                type="text"
                value={valueText}
                onChange={(e) => setValueText(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Placeholder */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Placeholder
            </label>
            <input
              type="text"
              value={placeholderText}
              onChange={(e) => setPlaceholderText(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Helper text toggle */}
          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Helper Text
              </span>
              <Switch
                checked={showHelper}
                onCheckedChange={setShowHelper}
                aria-label="Mostrar texto de ayuda"
                style={showHelper ? { backgroundColor: accentBlue } : undefined}
              />
            </label>
          </div>

          {/* Helper text input */}
          {showHelper && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Helper / Error Text
              </label>
              <input
                type="text"
                value={helperText}
                onChange={(e) => setHelperText(e.target.value)}
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
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="text-gray-900 dark:text-white font-medium">{inputType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">State</span>
                <span className="text-gray-900 dark:text-white font-medium">{inputState}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Font size</span>
                <span className="text-gray-900 dark:text-white font-mono">16px</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Padding</span>
                <span className="text-gray-900 dark:text-white font-mono">{INPUT_PADDING_Y}px {INPUT_PADDING_X}px</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Radius</span>
                <span className="text-gray-900 dark:text-white font-mono">{INPUT_RADIUS}px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Input — ${inputType} / ${inputState}`}
          code={codeSnippet}
        />
      )}
    </div>
  );
}
