import { useState, useMemo, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./drop-items.module.css";

/** Figma Building Blocks / Nav item — `state` en diseño */
type DropItemVariant = "icon" | "text" | "person";

const VARIANT_LABELS: Record<DropItemVariant, string> = {
  icon: "Icon + label",
  text: "Label only",
  person: "Person + label",
};

const VARIANT_KEYS: DropItemVariant[] = ["icon", "text", "person"];

const COLOR_DEFS = [
  {
    label: "Label (default)",
    cssVar: "--ds-drop-item-label-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Label (selected)",
    cssVar: "--ds-drop-item-label-brand",
    jsonPath: "Text colors.text-primary-brand",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-brand", mode),
  },
  {
    label: "Subtitle",
    cssVar: "--ds-drop-item-subtitle-muted",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Subtitle (selected)",
    cssVar: "--ds-drop-item-subtitle-selected",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Row background (selected)",
    cssVar: "--ds-drop-item-bg-selected",
    jsonPath: "Background.bg-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-primary", mode),
  },
  {
    label: "Avatar surface",
    cssVar: "--ds-drop-item-avatar-bg",
    jsonPath: "Background.bg-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-primary", mode),
  },
] as const;

function dropItemsThemeVars(mode: "light" | "dark"): React.CSSProperties {
  const bgSel = resolveJsonBackgroundColor("bg-primary", mode);
  const avatarBg = resolveJsonBackgroundColor("bg-primary", mode);
  return {
    ["--ds-drop-item-bg-selected" as string]: bgSel,
    ["--ds-drop-item-avatar-bg" as string]: avatarBg,
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function rowInkVars(
  selected: boolean,
  mode: "light" | "dark",
): React.CSSProperties {
  const label = selected
    ? resolveJsonTextColor("text-primary-brand", mode)
    : resolveJsonTextColor("text-secondary", mode);
  const sub = selected
    ? resolveJsonTextColor("text-secondary", mode)
    : resolveJsonTextColor("text-tertiary", mode);
  const icon = selected
    ? resolveJsonTextColor("text-primary-brand", mode)
    : resolveJsonTextColor("text-secondary", mode);
  return {
    ["--ds-drop-item-label" as string]: label,
    ["--ds-drop-item-subtitle" as string]: sub,
    ["--ds-drop-item-icon-ink" as string]: icon,
  };
}

export function DropItemRow({
  variant,
  selected,
  labelText,
  showSubtitle,
  subtitleText,
  leadingIconName,
  interactive,
  onClick,
  onMouseDown,
}: {
  variant: DropItemVariant;
  selected: boolean;
  labelText: string;
  showSubtitle: boolean;
  subtitleText: string;
  leadingIconName: string;
  interactive?: boolean;
  onClick?: () => void;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";
  const ink = rowInkVars(selected, mode);

  const textBlock = (
    <span className={styles.textBlock}>
      <span className={styles.label}>{labelText}</span>
      {showSubtitle ? (
        <span className={styles.subtitle}>{subtitleText}</span>
      ) : null}
    </span>
  );

  return (
    <button
      type="button"
      className={styles.row}
      role="option"
      aria-selected={selected}
      data-selected={selected ? "true" : "false"}
      data-variant={variant}
      data-interactive={interactive ? "true" : "false"}
      style={ink}
      onClick={interactive ? onClick : undefined}
      onMouseDown={onMouseDown}
    >
      {variant === "icon" ? (
        <>
          <span
            className={`material-symbols-rounded ${styles.leadingIcon}`}
            aria-hidden
          >
            {leadingIconName}
          </span>
          {textBlock}
        </>
      ) : null}

      {variant === "text" ? textBlock : null}

      {variant === "person" ? (
        <>
          <span className={styles.avatar} aria-hidden>
            <span
              className={`material-symbols-rounded ${styles.material}`}
            >
              person
            </span>
          </span>
          {textBlock}
        </>
      ) : null}
    </button>
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

function buildDropItemsSnippet(opts: {
  variant: DropItemVariant;
  selected: boolean;
  labelHex: string;
  selectedHex: string;
  bgHex: string;
}): { html: string; css: string } {
  const { variant, selected, labelHex, selectedHex, bgHex } = opts;
  const css = `/* Drop items — Figma 3:25753 */
.ds-drop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 320px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  background: ${selected ? bgHex : "transparent"};
  font-family: var(--ds-typography-font-family);
  font-size: 14px;
  line-height: 20px;
  color: ${selected ? selectedHex : labelHex};
  text-align: left;
  cursor: pointer;
}

.ds-drop-item__label {
  font-weight: 500;
}

.ds-drop-item__subtitle {
  font-weight: 400;
  opacity: 0.9;
}`;

  const iconInner =
    variant === "icon"
      ? `  <span class="material-symbols-rounded">radio_button_unchecked</span>\n  <span class="ds-drop-item__stack">\n    <span class="ds-drop-item__label">Label</span>\n  </span>`
      : variant === "person"
        ? `  <span class="ds-drop-item__avatar" aria-hidden></span>\n  <span class="ds-drop-item__stack">\n    <span class="ds-drop-item__label">Label</span>\n  </span>`
        : `  <span class="ds-drop-item__stack">\n    <span class="ds-drop-item__label">Label</span>\n  </span>`;

  return {
    html: `<button type="button" class="ds-drop-item" role="option" aria-selected="${selected}">\n${iconInner}\n</button>`,
    css,
  };
}

export function DropItemsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [variant, setVariant] = useState<DropItemVariant>("icon");
  const [panelSelected, setPanelSelected] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [labelText, setLabelText] = useState("Label");
  const [subtitleText, setSubtitleText] = useState("Subtitle");
  const [leadingIcon, setLeadingIcon] = useState("radio_button_unchecked");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [previewSelected, setPreviewSelected] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => dropItemsThemeVars(mode), [mode]);

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

  const previewHighlight = panelSelected || previewSelected;

  useEffect(() => {
    if (!previewSelected || panelSelected) return;
    let clearListener: (() => void) | undefined;
    const t = window.setTimeout(() => {
      const onDocPointerDown = () => setPreviewSelected(false);
      document.addEventListener("pointerdown", onDocPointerDown);
      clearListener = () =>
        document.removeEventListener("pointerdown", onDocPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(t);
      clearListener?.();
    };
  }, [previewSelected, panelSelected]);

  const codeSnippet = useMemo(
    () =>
      buildDropItemsSnippet({
        variant,
        selected: previewHighlight,
        labelHex: stateColors[0].hex,
        selectedHex: stateColors[1].hex,
        bgHex: stateColors[4].hex,
      }),
    [variant, previewHighlight, stateColors],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Drop items (Figma 3:25753): ítems de lista para selects / menús. Variantes{" "}
          <strong>Icon + label</strong>, <strong>Label only</strong> y{" "}
          <strong>Person + label</strong>; fila <strong>sin seleccionar</strong> o{" "}
          <strong>seleccionada</strong> (fondo <code className="font-mono text-xs">bg-primary</code>, texto{" "}
          <code className="font-mono text-xs">text-primary-brand</code>); subtítulo opcional.
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
              <DropItemRow
                variant={variant}
                selected={previewHighlight}
                labelText={labelText}
                showSubtitle={showSubtitle}
                subtitleText={subtitleText}
                leadingIconName={leadingIcon}
                interactive
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={() => {
                  if (!panelSelected) setPreviewSelected((s) => !s);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Width" value="mín. 320px" />
              <SpecRow label="Radius" value="6px" />
              <SpecRow label="Padding" value="12px 16px" />
              <SpecRow label="Gap (icon / avatar → texto)" value="8px" />
              <SpecRow label="Variant" value={VARIANT_LABELS[variant]} />
              <SpecRow
                label="Selected"
                value={previewHighlight ? "Sí" : "No"}
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Label" value="14px / medium / 20px lh" />
              <SpecRow label="Subtitle" value="14px / regular / 20px lh" />
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
              Variante × estado (default / selected); subtítulo desactivado.
            </p>
            <div className={styles.matrix}>
              {VARIANT_KEYS.map((v) => (
                <div key={v} className={styles.matrixCell}>
                  <span className={styles.matrixLabel}>{VARIANT_LABELS[v]}</span>
                  <div className="flex flex-col gap-2">
                    <DropItemRow
                      variant={v}
                      selected={false}
                      labelText="Label"
                      showSubtitle={false}
                      subtitleText=""
                      leadingIconName="radio_button_unchecked"
                    />
                    <DropItemRow
                      variant={v}
                      selected
                      labelText="Label"
                      showSubtitle={false}
                      subtitleText=""
                      leadingIconName="radio_button_unchecked"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 mb-2 text-sm text-[var(--ds-color-text-muted)]">
              Con subtítulo (Icon + label)
            </p>
            <div className={styles.stateStrip}>
              <DropItemRow
                variant="icon"
                selected={false}
                labelText="Label"
                showSubtitle
                subtitleText="Subtitle"
                leadingIconName="radio_button_unchecked"
              />
              <DropItemRow
                variant="icon"
                selected
                labelText="Label"
                showSubtitle
                subtitleText="Subtitle"
                leadingIconName="radio_button_unchecked"
              />
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>
              Variante, selección y copys
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Variant"
            value={variant}
            options={VARIANT_KEYS.map((v) => ({
              value: v,
              label: VARIANT_LABELS[v],
            }))}
            onChange={(val) => setVariant(val as DropItemVariant)}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Selected (panel)</span>
              <Switch
                checked={panelSelected}
                onCheckedChange={(v) => {
                  setPanelSelected(v);
                  if (v) setPreviewSelected(false);
                }}
                style={panelSelected ? switchOnStyle : undefined}
              />
            </label>
            <p className={`${shell.panelHint} mt-1`}>
              Si está off, el preview alterna al clic (estado simulado).
            </p>
          </div>

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Subtitle</span>
              <Switch
                checked={showSubtitle}
                onCheckedChange={setShowSubtitle}
                style={showSubtitle ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>Label</label>
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          {showSubtitle ? (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Subtitle
              </label>
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          ) : null}

          {variant === "icon" ? (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Leading icon (Material Symbols)
              </label>
              <input
                type="text"
                value={leadingIcon}
                onChange={(e) => setLeadingIcon(e.target.value)}
                className={shell.panelInput}
                placeholder="radio_button_unchecked"
              />
            </div>
          ) : null}

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div key={`${sc.label}-${sc.jsonPath}`} className={shell.configRow}>
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
          title={`Drop items — ${VARIANT_LABELS[variant]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
