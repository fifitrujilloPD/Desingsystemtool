import { Check, Copy, ChevronDown } from "lucide-react";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import lightTokens from "../../imports/Ligth_mode.tokens.json";
import darkTokens from "../../imports/darkmode.tokens.json";
import { copyToClipboard } from "../utils/clipboard";

export type CodeModalTab = "html" | "css" | "tokens";

interface CodeBottomSheetProps {
  onClose: () => void;
  title?: string;
  /** Fragmento HTML / JSX de referencia */
  html?: string;
  /** Reglas CSS equivalentes (sin duplicar el markup) */
  css?: string;
  /**
   * Cadena legacy única (markup con estilos inline o bloque mixto).
   * Si no pasás `html`/`css`, intentamos separar lo más común (Typography, Button, Badge).
   */
  code?: string;
  /** JSON de tokens; por defecto light + dark del proyecto */
  tokens?: string;
}

const EMPTY_HTML_PLACEHOLDER = "// Sin fragmento HTML para esta vista.";
const EMPTY_CSS_PLACEHOLDER = "// Sin bloque CSS separado.";
const INLINE_ONLY_CSS_HINT =
  "/* Los estilos están en atributos style del HTML. Copiá cada propiedad aquí o convertí a clases. */";

/**
 * Intenta separar snippets históricos en HTML + CSS sin cambiar el significado visual de referencia.
 */
export function splitLegacyCombinedCode(code: string): { html: string; css: string } {
  const trimmed = code.trim();
  if (!trimmed) return { html: "", css: "" };

  const usageMarker = "/* Usage */";
  const usageIdx = trimmed.indexOf(usageMarker);
  if (usageIdx !== -1) {
    return {
      css: trimmed.slice(0, usageIdx).trim(),
      html: trimmed.slice(usageIdx + usageMarker.length).trim(),
    };
  }

  const buttonMatch = trimmed.match(
    /^<button\s+style="\n([\s\S]*?)\n"([^>]*)>\n([\s\S]*)\n<\/button>$/
  );
  if (buttonMatch) {
    const styleInner = buttonMatch[1];
    const extraAttrs = buttonMatch[2].trim();
    const inner = buttonMatch[3];
    const cssBlock = `.ds-button-preview {\n${styleInner}\n}`;
    const htmlBlock = `<button type="button" class="ds-button-preview"${extraAttrs ? ` ${extraAttrs}` : ""}>\n${inner}\n</button>`;
    return { html: htmlBlock, css: cssBlock };
  }

  const divMatch = trimmed.match(/^<div\s+style="\n([\s\S]*?)\n">\n([\s\S]*)\n<\/div>$/);
  if (divMatch) {
    const styleInner = divMatch[1];
    const inner = divMatch[2];
    const cssBlock = `.ds-badge-preview {\n${styleInner}\n}`;
    const htmlBlock = `<div class="ds-badge-preview">\n${inner}\n</div>`;
    return { html: htmlBlock, css: cssBlock };
  }

  if (
    trimmed.startsWith("<span") &&
    trimmed.includes("material-symbols-rounded")
  ) {
    return {
      html: trimmed,
      css: `.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: normal;
  font-style: normal;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}`,
    };
  }

  return { html: trimmed, css: INLINE_ONLY_CSS_HINT };
}

export function CodeModal({
  onClose,
  title,
  html: htmlProp,
  css: cssProp,
  code,
  tokens: tokensProp,
}: CodeBottomSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeModalTab>("html");

  const tokensString = useMemo(
    () =>
      tokensProp ??
      JSON.stringify({ light: lightTokens, dark: darkTokens }, null, 2),
    [tokensProp]
  );

  const { html, css } = useMemo(() => {
    if (htmlProp !== undefined || cssProp !== undefined) {
      return {
        html: (htmlProp ?? "").trim(),
        css: (cssProp ?? "").trim(),
      };
    }
    if (code !== undefined && code.trim() !== "") {
      return splitLegacyCombinedCode(code);
    }
    return { html: "", css: "" };
  }, [htmlProp, cssProp, code]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "html":
        return html || EMPTY_HTML_PLACEHOLDER;
      case "css":
        return css || EMPTY_CSS_PLACEHOLDER;
      default:
        return tokensString;
    }
  }, [activeTab, html, css, tokensString]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    setCopied(false);
  }, [activeTab]);

  /** Primera pestaña útil (antes del pintado para minimizar flash) */
  useLayoutEffect(() => {
    const next: CodeModalTab = html.trim()
      ? "html"
      : css.trim()
        ? "css"
        : "tokens";
    setActiveTab(next);
  }, [html, css]);

  const displayTitle = title ?? "Design Tokens";

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(tabContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabBtn = (id: CodeModalTab, label: string) => (
    <button
      type="button"
      key={id}
      onClick={() => setActiveTab(id)}
      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
        activeTab === id
          ? "border-blue-600 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? "opacity-40" : "opacity-0"
        }`}
      />

      <div
        className={`relative z-10 rounded-t-2xl bg-card text-card-foreground shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "55vh", minHeight: 320 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <h2 className="text-sm text-gray-800 dark:text-gray-200 truncate">
              {displayTitle}
            </h2>
            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 -mb-px">
              {tabBtn("html", "HTML")}
              {tabBtn("css", "CSS")}
              {tabBtn("tokens", "Tokens")}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4 bg-gray-50 dark:bg-transparent">
          <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
            <code>{tabContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
