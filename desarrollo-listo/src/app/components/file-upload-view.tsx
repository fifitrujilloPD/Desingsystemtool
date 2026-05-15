import { useState, useMemo, useRef, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect } from "./design-system-controls";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./file-upload.module.css";

/** Figma `state` del componente base */
type FileUploadBaseState = "Default" | "Hover" | "Disabled";

type FileUploadVisual = "default" | "hover" | "disabled";

const STATE_LABELS: Record<FileUploadBaseState, string> = {
  Default: "Default",
  Hover: "Hover",
  Disabled: "Disabled",
};

const ALL_STATES: FileUploadBaseState[] = ["Default", "Hover", "Disabled"];

const COLOR_DEFS = [
  {
    label: "Zone border (default)",
    cssVar: "--ds-file-border-default",
    jsonPath: "Border color.border-primary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", m),
  },
  {
    label: "Zone border (hover)",
    cssVar: "--ds-file-border-hover",
    jsonPath: "Button color.button-hover",
    resolve: (m: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", m),
  },
  {
    label: "Zone border (disabled)",
    cssVar: "--ds-file-border-disabled",
    jsonPath: "Border color.border-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-secondary", m),
  },
  {
    label: "Zone background",
    cssVar: "--ds-file-zone-bg",
    jsonPath: "Background.bg-primary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-primary", m),
  },
  {
    label: "Icon tile bg",
    cssVar: "--ds-file-icon-bg",
    jsonPath: "Background.bg-container",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", m),
  },
  {
    label: "Icon tile border",
    cssVar: "--ds-file-icon-border",
    jsonPath: "Border color.border-primary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", m),
  },
  {
    label: "CTA (primary brand)",
    cssVar: "--ds-file-cta",
    jsonPath: "Text colors.text-primary-brand",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-primary-brand", m),
  },
  {
    label: "Tail (secondary)",
    cssVar: "--ds-file-tail",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", m),
  },
  {
    label: "Hint (tertiary)",
    cssVar: "--ds-file-hint",
    jsonPath: "Text colors.text-tertiary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", m),
  },
  {
    label: "Upload icon",
    cssVar: "--ds-file-icon-ink",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", m),
  },
  {
    label: "Disabled ink",
    cssVar: "--ds-file-disabled",
    jsonPath: "Text colors.text-disabled",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-disabled", m),
  },
] as const;

function fileUploadThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-file-border-default" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-file-border-hover" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-file-border-disabled" as string]: resolveJsonBorderColor(
      "border-secondary",
      mode,
    ),
    ["--ds-file-zone-bg" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-file-icon-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-file-icon-border" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-file-cta-active" as string]: resolveJsonTextColor(
      "text-primary-brand",
      mode,
    ),
    ["--ds-file-tail-active" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-file-hint-active" as string]: resolveJsonTextColor(
      "text-tertiary",
      mode,
    ),
    ["--ds-file-icon-ink-active" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-file-disabled" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function panelStateToVisual(
  panel: FileUploadBaseState,
  previewHovered: boolean,
): FileUploadVisual {
  if (panel === "Disabled") return "disabled";
  if (panel === "Hover") return "hover";
  if (previewHovered) return "hover";
  return "default";
}

export function FileUploadZone({
  visual,
  ctaText,
  tailText,
  hintText,
  interactive,
  onMouseEnter,
  onMouseLeave,
  onPickFiles,
}: {
  visual: FileUploadVisual;
  ctaText: string;
  tailText: string;
  hintText: string;
  interactive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onPickFiles?: (files: FileList | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = visual === "disabled";

  const borderW = visual === "hover" ? "2px" : "1px";
  const borderColorVar =
    visual === "disabled"
      ? "var(--ds-file-border-disabled)"
      : visual === "hover"
        ? "var(--ds-file-border-hover)"
        : "var(--ds-file-border-default)";

  const ctaCol =
    disabled ? "var(--ds-file-disabled)" : "var(--ds-file-cta-active)";
  const tailCol =
    disabled ? "var(--ds-file-disabled)" : "var(--ds-file-tail-active)";
  const hintCol =
    disabled ? "var(--ds-file-disabled)" : "var(--ds-file-hint-active)";
  const iconInk =
    disabled ? "var(--ds-file-disabled)" : "var(--ds-file-icon-ink-active)";

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        multiple
        onChange={(e) => {
          onPickFiles?.(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className={styles.zone}
        data-visual={visual}
        data-interactive={interactive && !disabled ? "true" : "false"}
        disabled={disabled && !interactive}
        style={{
          ["--ds-file-zone-border-w" as string]: borderW,
          ["--ds-file-zone-border" as string]: borderColorVar,
          ["--ds-file-cta" as string]: ctaCol,
          ["--ds-file-tail" as string]: tailCol,
          ["--ds-file-hint" as string]: hintCol,
          ["--ds-file-icon-ink" as string]: iconInk,
        }}
        onClick={() => {
          if (!interactive || disabled) return;
          inputRef.current?.click();
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-disabled={disabled}
      >
        <div className={styles.content}>
          <span className={styles.iconWrap} aria-hidden>
            <span className={`material-symbols-rounded ${styles.material}`}>
              upload
            </span>
          </span>
          <div className={styles.textCol}>
            <div className={styles.actionRow}>
              <span className={styles.cta}>{ctaText}</span>
              <span className={styles.tail}>{tailText}</span>
            </div>
            <p className={styles.hint}>{hintText}</p>
          </div>
        </div>
      </button>
    </>
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

function buildFileUploadSnippet(opts: {
  borderHex: string;
  brandHex: string;
}): { html: string; css: string } {
  const { borderHex, brandHex } = opts;
  const css = `/* File upload base — Figma 978:299120 */
.ds-file-zone {
  max-width: min(100%, 512px);
  min-width: 320px;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid ${borderHex};
  background: var(--ds-file-zone-bg);
  font-family: var(--ds-typography-font-family);
}

.ds-file-zone__cta {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${brandHex};
}`;

  return {
    html: `<button type="button" class="ds-file-zone">\n  <span class="material-symbols-rounded">upload</span>\n  <p><strong class="ds-file-zone__cta">Haga clic para cargar</strong> o arrastrar y soltar</p>\n</button>`,
    css,
  };
}

export function FileUploadView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [panelState, setPanelState] = useState<FileUploadBaseState>("Default");
  const [previewHovered, setPreviewHovered] = useState(false);
  const [ctaText, setCtaText] = useState("Haga clic para cargar");
  const [tailText, setTailText] = useState("o arrastrar y soltar");
  const [hintText, setHintText] = useState(
    "SVG, PNG, JPG o GIF (max. 800x400px)",
  );
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [logLastPick, setLogLastPick] = useState<string | null>(null);

  const themeVars = useMemo(() => fileUploadThemeVars(mode), [mode]);

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

  const previewVisual = panelStateToVisual(panelState, previewHovered);

  useEffect(() => {
    if (panelState !== "Default") setPreviewHovered(false);
  }, [panelState]);

  const codeSnippet = useMemo(
    () =>
      buildFileUploadSnippet({
        borderHex: stateColors[0].hex,
        brandHex: stateColors[6].hex,
      }),
    [stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          File upload base (Figma 978:299120): zona para{" "}
          <strong>carga por clic</strong> o arrastre (solo maquetación en el
          catálogo). Estados <strong>Default</strong>, <strong>Hover</strong>{" "}
          (borde marca 2px) y <strong>Disabled</strong>; tipografía y fondos
          según tokens JSON.
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
            <div className={shell.previewStage}>
              <FileUploadZone
                visual={previewVisual}
                ctaText={ctaText}
                tailText={tailText}
                hintText={hintText}
                interactive={panelState !== "Disabled"}
                onMouseEnter={() => {
                  if (panelState === "Default") setPreviewHovered(true);
                }}
                onMouseLeave={() => setPreviewHovered(false)}
                onPickFiles={(files) => {
                  const n = files?.length ?? 0;
                  setLogLastPick(
                    n === 0 ? null : `${n} archivo(s) seleccionado(s)`,
                  );
                }}
              />
              {logLastPick ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="text-xs text-[var(--ds-color-text-muted)]">
                    {logLastPick}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-medium text-[var(--ds-color-brand)] underline-offset-2 hover:underline"
                    onClick={() => setLogLastPick(null)}
                  >
                    Limpiar
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Max width (Figma)" value="512px" />
              <SpecRow label="Min width (catálogo)" value="320px" />
              <SpecRow label="Outer radius" value="12px" />
              <SpecRow label="Padding" value="16px 24px" />
              <SpecRow label="Icon tile" value="40×40px · radius 8px" />
              <SpecRow label="State (panel)" value={STATE_LABELS[panelState]} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow label="CTA" value="14px / medium / 20px lh" />
              <SpecRow label="Tail" value="14px / regular / 20px lh" />
              <SpecRow label="Hint" value="12px / regular / 16px lh" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={`${sc.label}-${sc.jsonPath}`} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Matrix (Figma)</h3>
            <p className="mb-3 text-sm text-[var(--ds-color-text-muted)]">
              Los tres estados del componente base.
            </p>
            <div className={styles.matrix}>
              {ALL_STATES.map((s) => (
                <div key={s} className={styles.matrixCell}>
                  <span className={styles.matrixLabel}>{STATE_LABELS[s]}</span>
                  <FileUploadZone
                    visual={
                      s === "Disabled"
                        ? "disabled"
                        : s === "Hover"
                          ? "hover"
                          : "default"
                    }
                    ctaText="Haga clic para cargar"
                    tailText="o arrastrar y soltar"
                    hintText="SVG, PNG, JPG o GIF (max. 800x400px)"
                  />
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
            <p className={shell.panelHint}>Estado y copys</p>
          </div>

          <div className={shell.panelDivider} />

          <ControlSelect
            label="State"
            value={panelState}
            options={ALL_STATES.map((st) => ({
              value: st,
              label: STATE_LABELS[st],
            }))}
            onChange={(v) => setPanelState(v as FileUploadBaseState)}
          />

          <p className={`${shell.panelHint} -mt-2`}>
            Con <strong>Default</strong>, pasar el mouse sobre el preview activa
            el aspecto Hover.
          </p>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              CTA (clic)
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className={shell.panelInput}
              disabled={panelState === "Disabled"}
            />
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Texto arrastre
            </label>
            <input
              type="text"
              value={tailText}
              onChange={(e) => setTailText(e.target.value)}
              className={shell.panelInput}
              disabled={panelState === "Disabled"}
            />
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Hint formatos
            </label>
            <input
              type="text"
              value={hintText}
              onChange={(e) => setHintText(e.target.value)}
              className={shell.panelInput}
              disabled={panelState === "Disabled"}
            />
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div
                  key={`${sc.label}-${sc.jsonPath}`}
                  className={shell.configRow}
                >
                  <span className={shell.configKey}>{sc.label}</span>
                  <span className={shell.configValMono}>{sc.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title="File upload — base"
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
