import { useState, useMemo, useRef, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./search.module.css";

/** Figma prop: Default | Focused | Filed | Disabled */
type SearchFigmaState = "Default" | "Focused" | "Filed" | "Disabled";
type SearchVisualState = "default" | "focused" | "filled" | "disabled";
type PreviewWidth = "320" | "100%";

const FIGMA_STATE_LABELS: Record<SearchFigmaState, string> = {
  Default: "Default",
  Focused: "Focused",
  Filed: "Filed (filled)",
  Disabled: "Disabled",
};

const ALL_FIGMA_STATES: SearchFigmaState[] = [
  "Default",
  "Focused",
  "Filed",
  "Disabled",
];

const PREVIEW_WIDTH_OPTIONS: { value: PreviewWidth; label: string }[] = [
  { value: "320", label: "320px (min)" },
  { value: "100%", label: "100%" },
];

const COLOR_DEFS = [
  {
    label: "Border default",
    cssVar: "--ds-input-border",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
  {
    label: "Border focused",
    cssVar: "--ds-input-border-focus",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Border disabled",
    cssVar: "--ds-input-border",
    jsonPath: "Border color.border-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", mode),
  },
  {
    label: "Text placeholder",
    cssVar: "--ds-color-control-ink-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Text value",
    cssVar: "--ds-color-control-ink",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Text disabled",
    cssVar: "--ds-input-text-disabled",
    jsonPath: "Text colors.text-disabled",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", mode),
  },
] as const;

function figmaToVisual(state: SearchFigmaState): SearchVisualState {
  if (state === "Focused") return "focused";
  if (state === "Filed") return "filled";
  if (state === "Disabled") return "disabled";
  return "default";
}

function searchThemeVars(opts: {
  mode: "light" | "dark";
  previewWidth: PreviewWidth;
}): React.CSSProperties {
  const { mode, previewWidth } = opts;
  return {
    ["--ds-input-border" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-input-border-focus" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-input-text-disabled" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-color-control-ink" as string]: resolveJsonTextColor(
      "text-primary",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-search-preview-width" as string]:
      previewWidth === "100%" ? "100%" : `${previewWidth}px`,
    ["--ds-search-width" as string]:
      previewWidth === "100%" ? "100%" : `${previewWidth}px`,
  };
}

function SearchField({
  showIcon,
  visualState,
  placeholder,
  value,
  showClear,
  interactive,
  onChange,
  onClear,
  ariaLabel = "Search",
}: {
  showIcon: boolean;
  visualState: SearchVisualState;
  placeholder: string;
  value: string;
  showClear: boolean;
  interactive?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
  ariaLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const disabled = visualState === "disabled";
  const hasValue = value.length > 0;

  const displayState: SearchVisualState = disabled
    ? "disabled"
    : isFocused && interactive
      ? "focused"
      : hasValue
        ? "filled"
        : visualState === "focused"
          ? "focused"
          : visualState;

  const canClear =
    showClear && hasValue && !disabled && interactive && onClear;

  return (
    <div
      className={styles.field}
      data-state={displayState}
      data-has-value={hasValue ? "true" : "false"}
      data-has-icon={showIcon ? "true" : "false"}
      onClick={() => {
        if (interactive && !disabled) inputRef.current?.focus();
      }}
    >
      {showIcon ? (
        <span className={`material-symbols-rounded ${styles.materialIcon}`}>
          search
        </span>
      ) : null}
      {interactive ? (
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          enterKeyHint="search"
          className={styles.nativeInput}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <span className={styles.nativeInput} aria-hidden>
          {hasValue || displayState === "filled" ? value || placeholder : placeholder}
        </span>
      )}
      {canClear ? (
        <button
          type="button"
          className={styles.clearBtn}
          aria-label="Clear search"
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
            inputRef.current?.focus();
          }}
        >
          <span className={`material-symbols-rounded ${styles.clearIcon}`}>
            close
          </span>
        </button>
      ) : null}
    </div>
  );
}

function StateColorCard({
  label,
  hex,
  jsonPath,
  cssVar,
}: {
  label: string;
  hex: string;
  jsonPath: string;
  cssVar: string;
}) {
  return (
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: hex }}
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

function buildSearchSnippet(opts: {
  showIcon: boolean;
  placeholder: string;
  borderHex: string;
  focusBorderHex: string;
}): { html: string; css: string } {
  const { showIcon, placeholder, borderHex, focusBorderHex } = opts;
  const iconHtml = showIcon
    ? '  <span class="material-symbols-rounded ds-search__icon">search</span>\n'
    : "";

  const css = `/* Search — Figma 241:123115 */
.ds-search {
  --ds-input-border: ${borderHex};
  --ds-input-border-focus: ${focusBorderHex};
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 320px;
  max-width: 100%;
  padding: 14px 14px 14px 12px;
  border-radius: 8px;
  border: 1px solid var(--ds-input-border);
  font-family: var(--ds-typography-font-family);
  font-size: 16px;
  line-height: 24px;
}

.ds-search:focus-within {
  border-width: 2px;
  border-color: var(--ds-input-border-focus);
}

.ds-search__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
}`;

  return {
    html: `<div class="ds-search" role="search">\n${iconHtml}  <input class="ds-search__input" type="text" role="searchbox" placeholder="${placeholder}" aria-label="Search" />\n  <button type="button" class="ds-search__clear" aria-label="Clear search"><span class="material-symbols-rounded">close</span></button>\n</div>`,
    css,
  };
}

export function SearchView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [figmaState, setFigmaState] = useState<SearchFigmaState>("Default");
  const [showIcon, setShowIcon] = useState(true);
  const [placeholder, setPlaceholder] = useState("Label");
  const [query, setQuery] = useState("");
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("320");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(
    () => searchThemeVars({ mode, previewWidth }),
    [mode, previewWidth],
  );

  const stateColors = useMemo(
    () =>
      COLOR_DEFS.map((d) => ({
        label: d.label,
        cssVar: d.cssVar,
        jsonPath: d.jsonPath,
        hex: d.resolve(mode),
      })),
    [mode],
  );

  useEffect(() => {
    if (figmaState === "Filed" && !query) setQuery("Search query");
  }, [figmaState, query]);

  const previewVisual = figmaToVisual(figmaState);

  const codeSnippet = useMemo(
    () =>
      buildSearchSnippet({
        showIcon,
        placeholder,
        borderHex: stateColors[0].hex,
        focusBorderHex: stateColors[1].hex,
      }),
    [showIcon, placeholder, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Campo de búsqueda (Figma 241:123115): icono{" "}
          <span className="material-symbols-rounded text-[length:inherit] align-middle text-base">
            search
          </span>
          , estados Default, Focused, Filed y Disabled. Escribe en el preview;
          el botón{" "}
          <span className="material-symbols-rounded text-[length:inherit] align-middle text-base">
            close
          </span>{" "}
          limpia el valor.
        </p>

        <div className="mb-4">
          <div className={`${shell.previewCard} overflow-visible`}>
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
            <div
              className={shell.previewStage}
            >
              <div className={styles.previewWrap}>
                  <SearchField
                    showIcon={showIcon}
                    visualState={
                      figmaState === "Disabled"
                        ? "disabled"
                        : previewVisual
                    }
                    placeholder={placeholder}
                    value={query}
                    showClear
                    interactive={figmaState !== "Disabled"}
                    onChange={setQuery}
                    onClear={() => setQuery("")}
                  />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Min width" value="var(--ds-search-min-width)" />
              <SpecRow label="Width" value="var(--ds-search-width)" />
              <SpecRow label="Radius" value="var(--ds-search-radius)" />
              <SpecRow
                label="Padding"
                value="14px 14px 14px 12px (y · right · left)"
              />
              <SpecRow label="Icon gap" value="var(--ds-search-icon-gap)" />
              <SpecRow label="Icon size" value="24px" />
              <SpecRow label="State" value={FIGMA_STATE_LABELS[figmaState]} />
              <SpecRow label="Icon" value={showIcon ? "true" : "false"} />
              <SpecRow label="Clear" value="on when filled" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Input"
                value="var(--ds-typography-body-md) / 400 / 24px lh"
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
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
              State, Icon (Figma) y tokens del componente
            </p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="State"
            value={figmaState}
            options={ALL_FIGMA_STATES.map((s) => ({
              value: s,
              label: FIGMA_STATE_LABELS[s],
            }))}
            onChange={(v) => setFigmaState(v as SearchFigmaState)}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Icon</span>
              <Switch
                checked={showIcon}
                onCheckedChange={setShowIcon}
                disabled={figmaState === "Disabled"}
                aria-label="Mostrar icono search"
                style={showIcon ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Placeholder
            </label>
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              className={shell.panelInput}
              disabled={figmaState === "Disabled"}
            />
          </div>

          <ControlSelect
            label="Preview width"
            value={previewWidth}
            options={PREVIEW_WIDTH_OPTIONS}
            onChange={setPreviewWidth}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div key={sc.label} className={shell.configRow}>
                  <span className={shell.configKey}>{sc.label}</span>
                  <span className={shell.configValMono}>{sc.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>
                  {FIGMA_STATE_LABELS[figmaState]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Value</span>
                <span className={shell.configVal}>
                  {query || "(empty)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Search — ${FIGMA_STATE_LABELS[figmaState]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
