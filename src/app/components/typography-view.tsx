import { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "./theme-provider";
import { ChevronDown, Code, Heading2, LayoutGrid, Type } from "lucide-react";
import { CodeModal } from "./code-modal";
import { SegmentedControl } from "./design-system-controls";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";

// Typography scale derived from design tokens / reference
const typographyStyles = [
  { id: "h1", label: "H1", category: "HEADING", token: "--fs-h1", sizePx: 64, lineHeightPx: 72, sampleText: "Heading 1" },
  { id: "h2", label: "H2", category: "HEADING", token: "--fs-h2", sizePx: 48, lineHeightPx: 56, sampleText: "Heading 2" },
  { id: "h3", label: "H3", category: "HEADING", token: "--fs-h3", sizePx: 36, lineHeightPx: 44, sampleText: "Heading 3" },
  { id: "h4", label: "H4", category: "HEADING", token: "--fs-h4", sizePx: 30, lineHeightPx: 38, sampleText: "Heading 4" },
  { id: "h5", label: "H5", category: "HEADING", token: "--fs-h5", sizePx: 24, lineHeightPx: 32, sampleText: "Heading 5" },
  { id: "h6", label: "H6", category: "HEADING", token: "--fs-h6", sizePx: 20, lineHeightPx: 28, sampleText: "Heading 6" },
  { id: "body-xl", label: "Body XL", category: "BODY", token: "--fs-body-xl", sizePx: 20, lineHeightPx: 30, sampleText: "Body extra large text for emphasis and introductions." },
  { id: "body-lg", label: "Body LG", category: "BODY", token: "--fs-body-lg", sizePx: 18, lineHeightPx: 28, sampleText: "Body large text used for lead paragraphs." },
  { id: "body-md", label: "Body MD", category: "BODY", token: "--fs-body-md", sizePx: 16, lineHeightPx: 24, sampleText: "Body medium is the default paragraph style." },
  { id: "body-sm", label: "Body SM", category: "BODY", token: "--fs-body-sm", sizePx: 14, lineHeightPx: 20, sampleText: "Body small for secondary content and descriptions." },
  { id: "body-xs", label: "Body XS", category: "BODY", token: "--fs-body-xs", sizePx: 12, lineHeightPx: 18, sampleText: "Caption and helper text at the smallest readable size." },
];

const fontWeights = [
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
];

// Font family from tokens
const fontFamily = (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value || "roboto";

// Resolve text color tokens - resolves references like {global.Primary.neutral.950}
function resolveRef(ref: string, root: any): string | null {
  const path = ref.replace(/[{}]/g, "").split(".");
  let current = root;
  for (const p of path) {
    current = current?.[p];
    if (!current) return null;
  }
  return current?.$value?.hex || null;
}

function resolveTextColors(tokens: any): { name: string; hex: string; token: string; refLabel: string }[] {
  const textColorSection = tokens?.global?.color?.["Text colors"] || {};
  const results: { name: string; hex: string; token: string; refLabel: string }[] = [];

  for (const [name, tokenDef] of Object.entries(textColorSection)) {
    const t = tokenDef as any;
    if (t.$type !== "color") continue;

    let hex: string | null = null;
    const refStr = typeof t.$value === "string" ? t.$value : null;
    let refLabel = "";

    if (refStr && refStr.startsWith("{")) {
      hex = resolveRef(refStr, tokens);
      // Extract friendly label like "neutral-950" from "{global.Primary.neutral.950}"
      const parts = refStr.replace(/[{}]/g, "").split(".");
      refLabel = parts.slice(-2).join("-"); // e.g. "neutral-950"
    } else if (t.$value?.hex) {
      hex = t.$value.hex;
      refLabel = hex;
    }

    if (hex) {
      results.push({ name, hex, token: refStr || hex, refLabel });
    }
  }

  return results;
}

// Get both light and dark resolved colors for comparison display
function resolveTextColorsBoth(): { name: string; lightHex: string; darkHex: string; lightRef: string; darkRef: string }[] {
  const lightSection = (lightTokens as any)?.global?.color?.["Text colors"] || {};
  const darkSection = (darkTokens as any)?.global?.color?.["Text colors"] || {};
  const results: { name: string; lightHex: string; darkHex: string; lightRef: string; darkRef: string }[] = [];

  for (const [name, tokenDef] of Object.entries(lightSection)) {
    const lt = tokenDef as any;
    if (lt.$type !== "color") continue;
    const dt = (darkSection as any)[name];

    const lightRefStr = typeof lt.$value === "string" ? lt.$value : null;
    const darkRefStr = dt && typeof dt.$value === "string" ? dt.$value : null;

    const lightHex = lightRefStr?.startsWith("{") ? resolveRef(lightRefStr, lightTokens) : lt.$value?.hex;
    const darkHex = darkRefStr?.startsWith("{") ? resolveRef(darkRefStr, darkTokens) : dt?.$value?.hex;

    const extractLabel = (ref: string | null) => {
      if (!ref || !ref.startsWith("{")) return "";
      const parts = ref.replace(/[{}]/g, "").split(".");
      return parts.slice(-2).join("-");
    };

    if (lightHex && darkHex) {
      results.push({
        name,
        lightHex,
        darkHex,
        lightRef: extractLabel(lightRefStr),
        darkRef: extractLabel(darkRefStr),
      });
    }
  }

  return results;
}

export function TypographyView() {
  const { theme } = useTheme();
  const [selectedWeight, setSelectedWeight] = useState(400);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});
  const [colorOpen, setColorOpen] = useState(false);
  const [showCodeSheet, setShowCodeSheet] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"ALL" | "HEADING" | "BODY">("ALL");
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const colorBtnRef = useRef<HTMLButtonElement>(null);

  const tokens = theme === "dark" ? darkTokens : lightTokens;
  const textColors = useMemo(
    () => resolveTextColors(tokens as any),
    [theme]
  );

  const bothColors = useMemo(() => resolveTextColorsBoth(), []);

  // When theme changes, reset to first color's resolved value
  useEffect(() => {
    // selectedColorName stays the same, but the hex resolves differently per mode
  }, [theme]);

  // Derive currentColor from selectedColorName (so it auto-updates on theme switch)
  const currentColor = useMemo(() => {
    if (selectedColorName) {
      const found = textColors.find((c) => c.name === selectedColorName);
      if (found) return found.hex;
    }
    return textColors[0]?.hex || "#101828";
  }, [selectedColorName, textColors]);

  const filteredStyles = useMemo(() => {
    if (filterCategory === "ALL") return typographyStyles;
    return typographyStyles.filter((s) => s.category === filterCategory);
  }, [filterCategory]);

  const selectedStyle = typographyStyles.find((s) => s.id === selectedStyleId);

  const getCodeSnippet = () => {
    if (!selectedStyle) return "";
    const text = editedTexts[selectedStyle.id] || selectedStyle.sampleText;
    const weight = fontWeights.find((w) => w.value === selectedWeight);
    return `/* ${selectedStyle.label} - ${selectedStyle.token} */
font-family: '${fontFamily}', sans-serif;
font-size: ${selectedStyle.sizePx}px; /* ${(selectedStyle.sizePx / 16).toFixed(3)}rem */
line-height: ${selectedStyle.lineHeightPx}px;
font-weight: ${selectedWeight}; /* ${weight?.label} */
color: ${currentColor};

/* Usage */
<${selectedStyle.id.startsWith("h") ? selectedStyle.id : "p"} style="font: ${selectedWeight} ${selectedStyle.sizePx}px/${selectedStyle.lineHeightPx}px '${fontFamily}', sans-serif; color: ${currentColor};">
  ${text}
</${selectedStyle.id.startsWith("h") ? selectedStyle.id : "p"}>`;
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8 pr-80">
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
        <div className="flex-1 pr-80 space-y-0">
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
                      <p className="text-xs text-gray-400 font-mono">
                        {style.token}
                      </p>
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
                            fontFamily: `'${fontFamily}', sans-serif`,
                            fontSize: `${style.sizePx}px`,
                            lineHeight: `${style.lineHeightPx}px`,
                            fontWeight: selectedWeight,
                            color: currentColor,
                          }}
                        />
                      ) : (
                        <span
                          className="text-gray-900 dark:text-white"
                          style={{
                            fontFamily: `'${fontFamily}', sans-serif`,
                            fontSize: `${style.sizePx}px`,
                            lineHeight: `${style.lineHeightPx}px`,
                            fontWeight: selectedWeight,
                            color: currentColor,
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
        <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto z-10">
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
                      fontFamily: `'${fontFamily}', sans-serif`,
                      fontSize: `${Math.min(selectedStyle.sizePx, 48)}px`,
                      lineHeight: `${Math.min(selectedStyle.lineHeightPx, 56)}px`,
                      fontWeight: selectedWeight,
                      color: currentColor,
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
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Token</span>
                    <span className="text-gray-700 dark:text-gray-300 font-mono text-[10px]">{selectedStyle.token}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setShowCodeSheet(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-white dark:bg-[#1a1a2e] text-[#003d6d] dark:text-blue-300 border border-gray-300 dark:border-gray-700 shadow-[inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-3 py-2"
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
                  className="w-5 h-5 rounded-full shrink-0 border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: currentColor }}
                />
                <span className="truncate">
                  {textColors.find((c) => c.hex === currentColor)?.name || "Custom"}
                </span>
                <span className="ml-auto text-gray-400 font-mono text-[10px]">
                  {currentColor}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    colorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
          </div>
          </div>
        </div>
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
              {bothColors.map((color) => {
                const isActive = selectedColorName === color.name || (!selectedColorName && color.name === bothColors[0]?.name);
                const activeHex = theme === "dark" ? color.darkHex : color.lightHex;
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColorName(color.name);
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
                        style={{ backgroundColor: activeHex }}
                      />
                      <span className="text-gray-800 dark:text-gray-200">
                        {color.name}
                      </span>
                    </div>
                    <div className="flex gap-1.5 ml-6">
                      {/* Light mode badge */}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: color.lightHex }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">{color.lightRef}</span>
                      </span>
                      {/* Dark mode badge */}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-800 dark:bg-gray-700 text-[10px]">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-600"
                          style={{ backgroundColor: color.darkHex }}
                        />
                        <span className="text-gray-300">{color.darkRef}</span>
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
          code={getCodeSnippet()}
        />
      )}
    </div>
  );
}