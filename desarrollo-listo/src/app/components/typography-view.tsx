import { useState, useMemo, useEffect, useRef, type CSSProperties } from "react";
import { ChevronDown, Code, Heading2, LayoutGrid, Type } from "lucide-react";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { SegmentedControl } from "./design-system-controls";
import { useTheme } from "./theme-provider";
import { TYPOGRAPHY_FOUNDATION_STYLES } from "../data/typography-foundation-scale";
import { getFoundationTextColors } from "../utils/token-parser";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";

const fontWeights = [
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
];

// Font family from tokens
const fontFamily = (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value || "roboto";

export function TypographyView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const [selectedWeight, setSelectedWeight] = useState(400);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});
  const [colorOpen, setColorOpen] = useState(false);
  const [showCodeSheet, setShowCodeSheet] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"ALL" | "HEADING" | "BODY">("ALL");
  /** Nombre de token igual que en Colors → Foundation → Text (`FoundationTable`). */
  const [selectedFoundationTextName, setSelectedFoundationTextName] = useState<
    string | null
  >(null);
  const colorBtnRef = useRef<HTMLButtonElement>(null);

  const foundationTextColors = useMemo(() => getFoundationTextColors(), []);

  useEffect(() => {
    if (
      selectedFoundationTextName == null &&
      foundationTextColors.length > 0
    ) {
      setSelectedFoundationTextName(foundationTextColors[0].name);
    }
  }, [foundationTextColors, selectedFoundationTextName]);

  const selectedFoundationText = useMemo(() => {
    const found = foundationTextColors.find(
      (c) => c.name === selectedFoundationTextName,
    );
    return found ?? foundationTextColors[0] ?? null;
  }, [foundationTextColors, selectedFoundationTextName]);

  const previewHex = useMemo(() => {
    if (!selectedFoundationText) return null;
    return theme === "dark"
      ? selectedFoundationText.dark
      : selectedFoundationText.light;
  }, [selectedFoundationText, theme]);

  const previewColor =
    previewHex && previewHex !== "transparent"
      ? previewHex
      : "var(--ds-color-text-primary)";

  const filteredStyles = useMemo(() => {
    if (filterCategory === "ALL") return TYPOGRAPHY_FOUNDATION_STYLES;
    return TYPOGRAPHY_FOUNDATION_STYLES.filter((s) => s.category === filterCategory);
  }, [filterCategory]);

  const selectedStyle = TYPOGRAPHY_FOUNDATION_STYLES.find((s) => s.id === selectedStyleId);

  const typographyCodeSnippet = useMemo(() => {
    if (!selectedStyle) return { html: "", css: "" };
    const text = editedTexts[selectedStyle.id] || selectedStyle.sampleText;
    const weight = fontWeights.find((w) => w.value === selectedWeight);
    const tag = selectedStyle.id.startsWith("h") ? selectedStyle.id : "p";
    const colorCss = previewColor;
    const tokenLabel = selectedFoundationText?.name ?? "text-primary";
    const css = `/* ${selectedStyle.label} — color: ${tokenLabel} (Foundation / Text, mismo origen que Colors) */
.${selectedStyle.id}-sample {
  font-family: var(--ds-typography-font-family);
  font-size: var(${selectedStyle.fontSizeVar});
  line-height: var(${selectedStyle.lineHeightVar});
  font-weight: ${selectedWeight}; /* ${weight?.label} */
  color: ${colorCss};
}`;
    const html = `<${tag} class="${selectedStyle.id}-sample">\n  ${text}\n</${tag}>`;
    return { html, css };
  }, [selectedStyle, editedTexts, selectedWeight, previewColor, selectedFoundationText?.name]);

  const typographyScopeStyle = {
    ["--ds-typography-font-family" as string]: `'${fontFamily}', sans-serif`,
  } as CSSProperties;

  return (
    <div className="" style={typographyScopeStyle}>
      {/* Header */}
      <div className={`mb-8 ${contentPaddingClass}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Typography
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Explora y edita los estilos tipográficos del sistema en tiempo real.
              Font family: <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{fontFamily}</span>
            </p>
          </div>
        </div>

        {/* Filter tabs — segmented control (matches ColorsView view mode) */}
        <div className="flex items-center justify-start gap-2 mb-6">
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setFilterCategory("ALL")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterCategory === "ALL"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              All Styles
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("HEADING")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterCategory === "HEADING"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Heading2 className="w-4 h-4 shrink-0" />
              Headings
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("BODY")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterCategory === "BODY"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Type className="w-4 h-4 shrink-0" />
              Body
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Right Controls */}
      <div className="flex">
        {/* Typography Showcase */}
        <div className={`flex-1 ${contentPaddingClass} space-y-0`}>
          {filteredStyles.map((style, idx) => {
            const text = editedTexts[style.id] || style.sampleText;
            const isSelected = selectedStyleId === style.id;
            const remValue = (style.sizePx / 16).toFixed(3);

            return (
              <div key={style.id}>
                <div
                  onClick={() =>
                    setSelectedStyleId(isSelected ? null : style.id)
                  }
                  className={`w-full text-left py-8 px-6 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/20 ring-1 ring-blue-500/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  }`}
                >
                  <div className="flex items-start gap-8">
                    {/* Left metadata */}
                    <div className="w-40 shrink-0 pt-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {style.label}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                          {style.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono space-y-0.5 leading-snug">
                        <p className="truncate" title={style.fontSizeVar}>
                          {style.fontSizeVar}
                        </p>
                        <p className="truncate" title={style.lineHeightVar}>
                          {style.lineHeightVar}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
                        <div className="flex justify-between pr-4">
                          <span className="text-gray-400">px</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{style.sizePx}px</span>
                        </div>
                        <div className="flex justify-between pr-4">
                          <span className="text-gray-400">rem</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{remValue}</span>
                        </div>
                        <div className="flex justify-between pr-4">
                          <span className="text-gray-400">lh</span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{style.lineHeightPx}px</span>
                        </div>
                      </div>
                    </div>

                    {/* Right preview */}
                    <div className="flex-1 flex items-center min-h-[60px]">
                      {isSelected ? (
                        <input
                          type="text"
                          value={text}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setEditedTexts((prev) => ({
                              ...prev,
                              [style.id]: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white caret-blue-500"
                          style={{
                            fontFamily: "var(--ds-typography-font-family)",
                            fontSize: `var(${style.fontSizeVar})`,
                            lineHeight: `var(${style.lineHeightVar})`,
                            fontWeight: selectedWeight,
                            color: previewColor,
                          }}
                        />
                      ) : (
                        <span
                          className="text-gray-900 dark:text-white"
                          style={{
                            fontFamily: "var(--ds-typography-font-family)",
                            fontSize: `var(${style.fontSizeVar})`,
                            lineHeight: `var(${style.lineHeightVar})`,
                            fontWeight: selectedWeight,
                            color: previewColor,
                          }}
                        >
                          {text}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {idx < filteredStyles.length - 1 && (
                  <div className="border-b border-gray-100 dark:border-gray-800/50 mx-6" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Controls Panel — matches ButtonsView hierarchy */}
        <ControlsPanelFrame>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Controls</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure weight, font family, and preview text color.
              </p>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Selected style detail */}
          {selectedStyle && (
            <>
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Selected Style
                </h3>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[80px]">
                  <span
                    style={{
                      fontFamily: "var(--ds-typography-font-family)",
                      fontSize: `min(var(${selectedStyle.fontSizeVar}), 48px)`,
                      lineHeight: `min(var(${selectedStyle.lineHeightVar}), 56px)`,
                      fontWeight: selectedWeight,
                      color: previewColor,
                    }}
                  >
                    {selectedStyle.label}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Font size</span>
                    <span className="text-gray-700 dark:text-gray-300 font-mono">{selectedStyle.sizePx}px</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Line height</span>
                    <span className="text-gray-700 dark:text-gray-300 font-mono">{selectedStyle.lineHeightPx}px</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Weight</span>
                    <span className="text-gray-700 dark:text-gray-300 font-mono">{selectedWeight}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 gap-2">
                    <span className="shrink-0">Tokens</span>
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-[9px] text-right break-all">
                      {selectedStyle.fontSizeVar}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setShowCodeSheet(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-gray-900 text-primary border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-3 py-2"
                >
                  <Code className="w-3.5 h-3.5" />
                  Code
                </button>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800" />
            </>
          )}

          <SegmentedControl
            label="Weight"
            value={String(selectedWeight)}
            options={fontWeights.map((w) => ({ value: String(w.value), label: w.label }))}
            onChange={(v) => setSelectedWeight(Number(v))}
          />

          {/* Font Family */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Font Family
            </label>
            <div className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono">
              {fontFamily}
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Color
            </label>
              <button
                ref={colorBtnRef}
                onClick={() => setColorOpen(!colorOpen)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700 bg-muted"
                  style={{ backgroundColor: previewColor }}
                />
                <span className="truncate">
                  {selectedFoundationText?.name ?? "—"}
                </span>
                <span className="ml-auto text-gray-400 font-mono text-[10px] truncate max-w-[100px] text-right">
                  {previewHex && previewHex !== "transparent"
                    ? previewHex
                    : previewColor}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    colorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
          </div>
        </div>
      </ControlsPanelFrame>
      </div>

      {/* Color dropdown rendered outside the overflow panel */}
      {colorOpen && (() => {
        const rect = colorBtnRef.current?.getBoundingClientRect();
        const top = rect ? rect.bottom + 4 : 200;
        const right = rect ? window.innerWidth - rect.right : 20;
        const width = rect ? rect.width : 220;
        return (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setColorOpen(false)}
            />
            <div
              className="fixed z-[101] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-80 overflow-y-auto"
              style={{ top, right, width: Math.max(width, 260) }}
            >
              {foundationTextColors.map((row) => {
                const isActive =
                  selectedFoundationTextName === row.name ||
                  (!selectedFoundationTextName &&
                    row.name === foundationTextColors[0]?.name);
                const activeSwatch =
                  theme === "dark" ? row.dark : row.light;
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => {
                      setSelectedFoundationTextName(row.name);
                      setColorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-3 text-xs transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950 ring-1 ring-inset ring-blue-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: activeSwatch }}
                      />
                      <span className="text-gray-800 dark:text-gray-200 font-medium font-mono">
                        {row.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-6">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: row.light }}
                        />
                        <span className="text-gray-600 dark:text-gray-400 font-mono">
                          {row.lightToken}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-800 dark:bg-gray-700 text-[10px]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-600"
                          style={{ backgroundColor: row.dark }}
                        />
                        <span className="text-gray-300 font-mono">{row.darkToken}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* Code Bottom Sheet */}
      {showCodeSheet && selectedStyle && (
        <CodeModal
          onClose={() => setShowCodeSheet(false)}
          title={`Typography: ${selectedStyle.label}`}
          html={typographyCodeSnippet.html}
          css={typographyCodeSnippet.css}
        />
      )}
    </div>
  );
}