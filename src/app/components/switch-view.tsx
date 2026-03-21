import { useState, useMemo } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { SegmentedControl } from "./design-system-controls";
import { Switch, type SwitchVisualState } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { CodeModal } from "./code-modal";

// ─── Types (variantes del componente en Figma: State, Switch, Label) ─────────

type SwitchComponentState = "Enabled" | "Hover" | "Focus" | "Disabled";

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

const FONT_FAMILY =
  (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value ||
  "Roboto";

/** Dimensiones del switch en UI (alineado a switch.module.css). */
const TRACK_W = 32;
const TRACK_H = 20;
const THUMB = 14;
/** Inset horizontal del thumb (2px desde el borde interno en off y en on). */
const THUMB_PAD = 2;
/** Recorrido checked: ancho útil (32 − bordes 1px×2) − pad izq − thumb − pad der = 30 − 2 − 14 − 2 */
const THUMB_TRANSLATE = 12;
const LABEL_FONT_SIZE = 16;
const LABEL_GAP = 8;

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

function previewVisualState(
  panelState: SwitchComponentState,
): SwitchVisualState {
  if (panelState === "Hover") return "hover";
  if (panelState === "Focus") return "focus";
  return "default";
}

// ─── Main view ─────────────────────────────────────────────────────────────

export function SwitchView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const [componentState, setComponentState] =
    useState<SwitchComponentState>("Enabled");
  const [checked, setChecked] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [labelText, setLabelText] = useState("Etiqueta");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const interactive = componentState === "Enabled";

  const stateColors = useMemo(() => {
    const t = tokens as any;
    return [
      {
        label: "Default (OFF track)",
        hex: resolveColor(t, "global.color.Border color.border-secondary"),
        tokenName: "border-secondary",
      },
      {
        label: "ON (Active track)",
        hex: resolveColor(t, "global.color.Button color.button-color"),
        tokenName: "button-color",
      },
      {
        label: "Hover (ON track)",
        hex: resolveColor(t, "global.color.Button color.button-hover"),
        tokenName: "button-hover",
      },
      {
        label: "Focus ring (referencia)",
        hex: resolveColor(t, "global.color.Border color.border-brand"),
        tokenName: "border-brand",
      },
      {
        label: "Disabled (track / fill)",
        hex: resolveColor(t, "global.color.Button color.button-disabled"),
        tokenName: "button-disabled",
      },
      {
        label: "Label (default)",
        hex: resolveColor(t, "global.color.Text colors.text-primary"),
        tokenName: "text-primary",
      },
      {
        label: "Thumb (surface)",
        hex: resolveColor(t, "global.color.Background.bg-container"),
        tokenName: "bg-container",
      },
    ];
  }, [theme, tokens]);

  const labelStyle: React.CSSProperties = {
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: LABEL_FONT_SIZE,
    fontWeight: 400,
    lineHeight: "1.5",
    color:
      componentState === "Disabled"
        ? resolveColor(tokens, "global.color.Text colors.text-disabled")
        : resolveColor(tokens, "global.color.Text colors.text-primary"),
    maxWidth: 280,
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  const codeSnippet = useMemo(() => {
    const t = tokens as any;
    const brand = resolveColor(t, "global.color.Button color.button-color");
    const brandHover = resolveColor(t, "global.color.Button color.button-hover");
    const borderSecondary = resolveColor(
      t,
      "global.color.Border color.border-secondary"
    );
    const borderPrimary = resolveColor(
      t,
      "global.color.Border color.border-primary"
    );
    const bgContainer = resolveColor(
      t,
      "global.color.Background.bg-container"
    );
    const textPrimary = resolveColor(t, "global.color.Text colors.text-primary");
    const textDisabled = resolveColor(t, "global.color.Text colors.text-disabled");
    const textSecondary = resolveColor(
      t,
      "global.color.Text colors.text-secondary"
    );
    const buttonDisabled = resolveColor(
      t,
      "global.color.Button color.button-disabled"
    );

    const isDisabled = componentState === "Disabled";
    const forceHover = componentState === "Hover";
    const forceFocus = componentState === "Focus";

    let trackBg: string;
    let trackBorder: string;
    if (isDisabled) {
      trackBg = checked ? textSecondary : buttonDisabled;
      trackBorder = `1px solid ${borderPrimary}`;
    } else if (checked) {
      trackBg = forceHover ? brandHover : brand;
      trackBorder = "1px solid transparent";
    } else {
      trackBg = forceHover ? borderPrimary : borderSecondary;
      trackBorder = `1px solid ${borderPrimary}`;
    }

    const thumbBg = isDisabled
      ? checked
        ? bgContainer
        : borderSecondary
      : bgContainer;

    const focusShadow =
      forceFocus && !isDisabled
        ? `0 0 0 3px ${hexToRgba(brand, 0.28)}`
        : "none";

    const thumbBorder = isDisabled ? ` border: 1px solid ${borderPrimary};` : "";

    const track = `  <div style="width: ${TRACK_W}px; height: ${TRACK_H}px; border-radius: ${TRACK_H / 2}px; background: ${trackBg}; border: ${trackBorder}; box-sizing: border-box; position: relative; flex-shrink: 0; box-shadow: ${focusShadow};">
    <div style="position: absolute; left: ${THUMB_PAD}px; top: 50%; width: ${THUMB}px; height: ${THUMB}px; margin-top: ${-THUMB / 2}px; border-radius: 50%; background: ${thumbBg}; transform: translateX(${checked ? THUMB_TRANSLATE : 0}px); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-sizing: border-box;${thumbBorder}"></div>
  </div>`;

    const labelHtml =
      showLabel && labelText
        ? `\n  <span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${LABEL_FONT_SIZE}px; font-weight: 400; line-height: 1.5; color: ${isDisabled ? textDisabled : textPrimary}; max-width: 280px; word-break: break-word;">${labelText}</span>`
        : "";

    return `<div style="display: inline-flex; align-items: center; gap: ${LABEL_GAP}px; cursor: ${isDisabled ? "not-allowed" : "pointer"}; opacity: ${isDisabled ? 0.38 : 1};">
${track}${labelHtml}
</div>`;
  }, [componentState, checked, labelText, showLabel, tokens]);

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 pr-80">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Switch
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente switch del sistema de
            diseño.
          </p>
        </div>

        <div className="mb-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl relative overflow-visible min-h-[280px]">
            <div className="absolute left-0 right-0 top-14 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="absolute top-3 left-0 right-0 flex items-center justify-between pl-5 pr-3 z-10">
              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preview
              </h2>
              <button
                type="button"
                onClick={() => setShowCodeModal(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all overflow-clip shadow-[inset_0px_0px_0px_1px_rgba(1,17,31,0.1),inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)]"
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div
              className="absolute left-0 right-0 top-16 bottom-0 flex items-center justify-center p-6"
              style={
                interactive ? undefined : { pointerEvents: "none" }
              }
            >
              <div className="inline-flex items-center gap-2">
                <Switch
                  checked={checked}
                  onCheckedChange={
                    interactive ? setChecked : undefined
                  }
                  disabled={componentState === "Disabled"}
                  visualState={previewVisualState(componentState)}
                  aria-label="Switch"
                />
                {showLabel && labelText ? (
                  <span style={labelStyle}>{labelText}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Border &amp; Control
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Track size" value={`${TRACK_W}×${TRACK_H}px`} />
              <SpecRow
                label="Track border radius"
                value={`${TRACK_H / 2}px (pill)`}
              />
              <SpecRow label="Thumb diameter" value={`${THUMB}px`} />
              <SpecRow
                label="Thumb inset"
                value={`${THUMB_PAD}px (horizontal)`}
              />
              <SpecRow
                label="Thumb travel"
                value={`${THUMB_TRANSLATE}px`}
              />
              <SpecRow label="Label ↔ control gap" value={`${LABEL_GAP}px`} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Structure
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Track" value="Contenedor pill (Radix Root)" />
              <SpecRow label="Thumb" value="Control circular (Radix Thumb)" />
              <SpecRow label="Label" value="Texto opcional junto al control" />
              <SpecRow
                label="Spacing"
                value={`gap ${LABEL_GAP}px`}
              />
            </div>
          </div>

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

      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Controls
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Variantes del componente
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          <SegmentedControl
            label="State"
            value={componentState}
            options={[
              { value: "Enabled", label: "Enabled" },
              { value: "Hover", label: "Hover" },
              { value: "Focus", label: "Focus" },
              { value: "Disabled", label: "Disabled" },
            ]}
            onChange={setComponentState}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Switch
              </span>
              <Switch
                checked={checked}
                onCheckedChange={setChecked}
                aria-label="Valor On u Off"
              />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Label
              </span>
              <Switch
                checked={showLabel}
                onCheckedChange={setShowLabel}
                aria-label="Mostrar label"
              />
            </label>
          </div>

          {showLabel && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Label
              </label>
              <input
                type="text"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Switch — ${componentState} / ${checked ? "On" : "Off"}`}
          code={codeSnippet}
        />
      )}
    </div>
  );
}
