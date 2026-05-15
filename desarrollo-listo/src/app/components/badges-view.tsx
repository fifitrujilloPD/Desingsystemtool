import { useState, useMemo } from "react";
import { CodeXml, ChevronDown } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./badges.module.css";

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
  | "Pink"
  | "Blue";

type DotTextToken =
  | "text-primary-brand"
  | "text-secondary"
  | "text-error"
  | "text-success"
  | "text-warnning"
  | "text-orange"
  | "text-purple"
  | "text-pink"
  | "text-blue";

interface BadgeColorTokens {
  bg?: string;
  text: string;
  border: string;
}

interface BadgeColorDef {
  label: string;
  key: BadgeColor;
  tokens: BadgeColorTokens;
  resolve: (mode: "light" | "dark") => {
    bg: string;
    text: string;
    border: string;
  };
}

const BADGE_COLOR_DEFS: BadgeColorDef[] = [
  {
    label: "Outline",
    key: "Outline",
    tokens: { text: "text-secondary", border: "border-primary" },
    resolve: (mode) => ({
      bg: "transparent",
      text: resolveJsonTextColor("text-secondary", mode),
      border: resolveJsonBorderColor("border-primary", mode),
    }),
  },
  {
    label: "Brand",
    key: "Brand",
    tokens: {
      bg: "bg-brand-ships",
      text: "text-primary-brand",
      border: "border-brand",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-brand-ships", mode),
      text: resolveJsonTextColor("text-primary-brand", mode),
      border: resolveJsonBorderColor("border-brand", mode),
    }),
  },
  {
    label: "Gray",
    key: "gray",
    tokens: {
      bg: "bg-primary",
      text: "text-secondary",
      border: "border-secondary",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-primary", mode),
      text: resolveJsonTextColor("text-secondary", mode),
      border: resolveJsonBorderColor("border-secondary", mode),
    }),
  },
  {
    label: "Red",
    key: "Red",
    tokens: { bg: "bg-error", text: "text-error", border: "border-error" },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-error", mode),
      text: resolveJsonTextColor("text-error", mode),
      border: resolveJsonBorderColor("border-error", mode),
    }),
  },
  {
    label: "Green",
    key: "Green",
    tokens: {
      bg: "bg-success",
      text: "text-success",
      border: "border-success",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-success", mode),
      text: resolveJsonTextColor("text-success", mode),
      border: resolveJsonBorderColor("border-success", mode),
    }),
  },
  {
    label: "Yellow",
    key: "Yellow",
    tokens: {
      bg: "bg-warnning",
      text: "text-warnning",
      border: "border-warning",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-warnning", mode),
      text: resolveJsonTextColor("text-warnning", mode),
      border: resolveJsonBorderColor("border-warning", mode),
    }),
  },
  {
    label: "Orange",
    key: "Orange",
    tokens: {
      bg: "bg-orange",
      text: "text-orange",
      border: "border-orange",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-orange", mode),
      text: resolveJsonTextColor("text-orange", mode),
      border: resolveJsonBorderColor("border-orange", mode),
    }),
  },
  {
    label: "Purple",
    key: "Purple",
    tokens: {
      bg: "bg-purple",
      text: "text-purple",
      border: "border-purple",
    },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-purple", mode),
      text: resolveJsonTextColor("text-purple", mode),
      border: resolveJsonBorderColor("border-purple", mode),
    }),
  },
  {
    label: "Pink",
    key: "Pink",
    tokens: { bg: "bg-pink", text: "text-pink", border: "border-pink" },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-pink", mode),
      text: resolveJsonTextColor("text-pink", mode),
      border: resolveJsonBorderColor("border-pink", mode),
    }),
  },
  {
    label: "Blue",
    key: "Blue",
    tokens: { bg: "bg-blue", text: "text-blue", border: "border-blue" },
    resolve: (mode) => ({
      bg: resolveJsonBackgroundColor("bg-blue", mode),
      text: resolveJsonTextColor("text-blue", mode),
      border: resolveJsonBorderColor("border-blue", mode),
    }),
  },
];

const DOT_COLOR_OPTIONS: { label: string; token: DotTextToken }[] = [
  { label: "Brand", token: "text-primary-brand" },
  { label: "Secondary", token: "text-secondary" },
  { label: "Error", token: "text-error" },
  { label: "Success", token: "text-success" },
  { label: "Warning", token: "text-warnning" },
  { label: "Orange", token: "text-orange" },
  { label: "Purple", token: "text-purple" },
  { label: "Pink", token: "text-pink" },
  { label: "Blue", token: "text-blue" },
];

const SIZE_LABELS: Record<BadgeSize, string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

function badgeStyleAttr(style: BadgeStyle): "rounded" | "pill" {
  return style === "Full border" ? "pill" : "rounded";
}

function badgeCssVars(colors: {
  bg: string;
  text: string;
  border: string;
  dot?: string;
}): React.CSSProperties {
  return {
    ["--ds-badge-bg" as string]: colors.bg,
    ["--ds-badge-text" as string]: colors.text,
    ["--ds-badge-border" as string]: colors.border,
    ...(colors.dot ? { ["--ds-badge-dot" as string]: colors.dot } : {}),
  };
}

function BadgePreview({
  badgeSize,
  badgeType,
  badgeStyle,
  colors,
  badgeIconName,
  labelText,
  showTrailingIcon,
}: {
  badgeSize: BadgeSize;
  badgeType: BadgeType;
  badgeStyle: BadgeStyle;
  colors: { bg: string; text: string; border: string; dot: string };
  badgeIconName?: string;
  labelText: string;
  showTrailingIcon: boolean;
}) {
  const isOutline = colors.bg === "transparent";

  return (
    <div
      className={styles.badge}
      data-size={badgeSize}
      data-type={badgeType}
      data-style={badgeStyleAttr(badgeStyle)}
      style={badgeCssVars({
        bg: isOutline ? "transparent" : colors.bg,
        text: colors.text,
        border: colors.border,
        dot: colors.dot,
      })}
    >
      <div className={styles.stateLayer}>
        {badgeType === "dot" && <span className={styles.dot} aria-hidden />}
        {badgeType === "icon" && (
          <span className={`material-symbols-rounded ${styles.leadingIcon}`}>
            {badgeIconName || "radio_button_unchecked"}
          </span>
        )}
        <span className={styles.label}>{labelText}</span>
        {showTrailingIcon && (
          <span className={`material-symbols-rounded ${styles.trailingIcon}`}>
            close
          </span>
        )}
      </div>
    </div>
  );
}

function StateColorCard({
  label,
  hex,
  jsonPath,
}: {
  label: string;
  hex: string;
  jsonPath: string;
}) {
  return (
    <div className={shell.tokenRow}>
      <div
        className={shell.tokenSwatch}
        style={{ backgroundColor: hex === "transparent" ? undefined : hex }}
        title={hex}
      />
      <div className="min-w-0">
        <p className={shell.tokenTitle}>{label}</p>
        <p className={shell.tokenMeta}>JSON {jsonPath}</p>
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

function ColorPicker({
  label,
  valueKey,
  options,
  onChange,
  renderSwatch,
  renderMeta,
}: {
  label: string;
  valueKey: string;
  options: { key: string; label: string }[];
  onChange: (key: string) => void;
  renderSwatch: (key: string) => React.ReactNode;
  renderMeta?: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.key === valueKey) || options[0];

  return (
    <div>
      <label className={`${shell.panelLabel} block mb-1.5`}>{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={styles.colorPickerBtn}
        >
          {renderSwatch(valueKey)}
          <span className="truncate">{current.label}</span>
          {renderMeta && (
            <span className="ml-auto font-mono text-[10px] text-[var(--ds-color-text-muted)]">
              {renderMeta(valueKey)}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <>
            <div
              className={styles.colorPickerBackdrop}
              onClick={() => setOpen(false)}
            />
            <div className={styles.colorPickerMenu}>
              {options.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  data-selected={valueKey === opt.key ? "true" : "false"}
                  className={styles.colorPickerOption}
                  onClick={() => {
                    onChange(opt.key);
                    setOpen(false);
                  }}
                >
                  {renderSwatch(opt.key)}
                  <span className="truncate text-[var(--ds-color-text-primary)]">
                    {opt.label}
                  </span>
                  {renderMeta && (
                    <span className="ml-auto font-mono text-[10px] text-[var(--ds-color-text-muted)]">
                      {renderMeta(opt.key)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function buildBadgeSnippet(opts: {
  badgeSize: BadgeSize;
  badgeType: BadgeType;
  badgeStyle: BadgeStyle;
  colors: { bg: string; text: string; border: string; dot: string };
  badgeIconName: string;
  labelText: string;
  showTrailingIcon: boolean;
  jsonComment: string;
}): { html: string; css: string } {
  const {
    badgeSize,
    badgeType,
    badgeStyle,
    colors,
    badgeIconName,
    labelText,
    showTrailingIcon,
    jsonComment,
  } = opts;

  const styleAttr = badgeStyleAttr(badgeStyle);
  const vars = [
    `--ds-badge-bg: ${colors.bg}`,
    `--ds-badge-text: ${colors.text}`,
    `--ds-badge-border: ${colors.border}`,
    `--ds-badge-dot: ${colors.dot}`,
  ].join("; ");

  const children: string[] = [];
  if (badgeType === "dot") {
    children.push('  <span class="ds-badge__dot" aria-hidden="true"></span>');
  }
  if (badgeType === "icon") {
    children.push(
      `  <span class="material-symbols-rounded ds-badge__icon">${badgeIconName}</span>`,
    );
  }
  children.push(`  <span class="ds-badge__label">${labelText}</span>`);
  if (showTrailingIcon) {
    children.push(
      '  <span class="material-symbols-rounded ds-badge__icon-trail">close</span>',
    );
  }

  const html = `<div class="ds-badge" data-size="${badgeSize}" data-type="${badgeType}" data-style="${styleAttr}" style="${vars}">
${children.join("\n")}
</div>`;

  const css = `/* Badge — Figma 3:8722 · ${jsonComment} */
.ds-badge {
  --ds-badge-bg: transparent;
  --ds-badge-text: var(--ds-color-control-ink);
  --ds-badge-border: var(--ds-input-border);
  --ds-badge-dot: var(--ds-badge-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: var(--ds-badge-border-w, 1px) solid var(--ds-badge-border);
  background: var(--ds-badge-bg);
  font-family: var(--ds-typography-font-family);
  font-weight: 400;
}

.ds-badge[data-style="rounded"] { border-radius: 8px; }
.ds-badge[data-style="pill"] { border-radius: 1000px; }

.ds-badge[data-size="sm"] .ds-badge__label {
  font-size: var(--ds-typography-body-sm-font-size);
  line-height: var(--ds-typography-body-sm-line-height);
  padding: 4px 8px;
}

.ds-badge[data-size="md"] .ds-badge__label {
  font-size: var(--ds-typography-body-sm-font-size);
  line-height: var(--ds-typography-body-sm-line-height);
  padding: 6px 8px;
}

.ds-badge[data-size="lg"] .ds-badge__label {
  font-size: var(--ds-typography-body-md-font-size);
  line-height: var(--ds-typography-body-md-line-height);
  padding: 8px 10px;
}

.ds-badge__label { color: var(--ds-badge-text); white-space: nowrap; }
.ds-badge__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ds-badge-dot);
}
.ds-badge__icon,
.ds-badge__icon-trail {
  color: var(--ds-badge-text);
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}`;

  return { html, css };
}

export function BadgesView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [badgeSize, setBadgeSize] = useState<BadgeSize>("md");
  const [badgeType, setBadgeType] = useState<BadgeType>("Text");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>("8 px border");
  const [badgeColor, setBadgeColor] = useState<BadgeColor>("Brand");
  const [badgeIconName, setBadgeIconName] = useState("radio_button_unchecked");
  const [labelText, setLabelText] = useState("Label");
  const [showTrailingIcon, setShowTrailingIcon] = useState(false);
  const [dotColorToken, setDotColorToken] = useState<DotTextToken | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const colorDefs = useMemo(
    () =>
      BADGE_COLOR_DEFS.map((def) => ({
        ...def,
        colors: def.resolve(mode),
      })),
    [mode],
  );

  const currentDef =
    colorDefs.find((c) => c.key === badgeColor) || colorDefs[0];
  const showDotColorPicker = badgeColor === "Outline" && badgeType === "dot";

  const previewColors = useMemo(() => {
    const base = currentDef.colors;
    const dot =
      showDotColorPicker && dotColorToken
        ? resolveJsonTextColor(dotColorToken, mode)
        : base.text;
    return { ...base, dot };
  }, [currentDef, showDotColorPicker, dotColorToken, mode]);

  const dotOptions = useMemo(
    () =>
      DOT_COLOR_OPTIONS.map((opt) => ({
        key: opt.token,
        label: opt.label,
        hex: resolveJsonTextColor(opt.token, mode),
      })),
    [mode],
  );

  const colorPickerOptions = useMemo(
    () =>
      colorDefs.map((cd) => ({
        key: cd.key,
        label: cd.label,
      })),
    [colorDefs],
  );

  const jsonComment = useMemo(() => {
    const t = currentDef.tokens;
    const parts = [
      t.bg ? `Background.${t.bg}` : "bg: transparent",
      `Text colors.${t.text}`,
      `Border color.${t.border}`,
    ];
    if (showDotColorPicker && dotColorToken) {
      parts.push(`dot: Text colors.${dotColorToken}`);
    }
    return parts.join(" · ");
  }, [currentDef, showDotColorPicker, dotColorToken]);

  const codeSnippet = useMemo(
    () =>
      buildBadgeSnippet({
        badgeSize,
        badgeType,
        badgeStyle,
        colors: previewColors,
        badgeIconName,
        labelText,
        showTrailingIcon,
        jsonComment,
      }),
    [
      badgeSize,
      badgeType,
      badgeStyle,
      previewColors,
      badgeIconName,
      labelText,
      showTrailingIcon,
      jsonComment,
    ],
  );

  const renderBadgeSwatch = (key: string) => {
    const cd = colorDefs.find((c) => c.key === key) || colorDefs[0];
    const isOutline = cd.key === "Outline";
    return (
      <span
        className={styles.colorSwatch}
        style={{
          backgroundColor: isOutline ? "transparent" : cd.colors.bg,
          borderColor: cd.colors.border,
        }}
      />
    );
  };

  const swatchMeta = (key: string) => {
    const cd = colorDefs.find((c) => c.key === key) || colorDefs[0];
    return cd.key === "Outline" ? cd.colors.border : cd.colors.bg;
  };

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Explora, entiende y configura el componente badge del sistema de
          diseño. Colores desde Foundation / JSON Feature 02 (
          <code className="font-mono text-[length:inherit]">--ds-badge-*</code>
          ).
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
              <BadgePreview
                badgeSize={badgeSize}
                badgeType={badgeType}
                badgeStyle={badgeStyle}
                colors={previewColors}
                badgeIconName={badgeIconName}
                labelText={labelText}
                showTrailingIcon={showTrailingIcon}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Font family"
                value="var(--ds-typography-font-family)"
              />
              <SpecRow
                label="Font size (SM/MD)"
                value="var(--ds-typography-body-sm-font-size)"
              />
              <SpecRow
                label="Font size (LG)"
                value="var(--ds-typography-body-md-font-size)"
              />
              <SpecRow label="Font weight" value="400 (Regular)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Border & Spacing</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Border radius"
                value={
                  badgeStyle === "Full border"
                    ? "var(--ds-badge-radius-pill)"
                    : "var(--ds-badge-radius-sm)"
                }
              />
              <SpecRow label="Border width" value="var(--ds-badge-border-w)" />
              <SpecRow label="Gap" value="8px (4px con icono)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>
              Colors — {currentDef.label}
            </h3>
            <div className={shell.specDivider}>
              <StateColorCard
                label="Background"
                hex={
                  currentDef.colors.bg === "transparent"
                    ? "transparent"
                    : currentDef.colors.bg
                }
                jsonPath={
                  currentDef.tokens.bg
                    ? `Background.${currentDef.tokens.bg}`
                    : "transparent"
                }
              />
              <StateColorCard
                label="Text"
                hex={currentDef.colors.text}
                jsonPath={`Text colors.${currentDef.tokens.text}`}
              />
              <StateColorCard
                label="Border"
                hex={currentDef.colors.border}
                jsonPath={`Border color.${currentDef.tokens.border}`}
              />
              {showDotColorPicker && (
                <StateColorCard
                  label="Dot"
                  hex={previewColors.dot}
                  jsonPath={`Text colors.${dotColorToken || currentDef.tokens.text}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>Configure the badge properties</p>
          </div>

          <div className={shell.panelDivider} />

          <ColorPicker
            label="Color"
            valueKey={badgeColor}
            options={colorPickerOptions}
            onChange={(k) => setBadgeColor(k as BadgeColor)}
            renderSwatch={renderBadgeSwatch}
            renderMeta={swatchMeta}
          />

          {showDotColorPicker && (
            <ColorPicker
              label="Dot color"
              valueKey={dotColorToken || currentDef.tokens.text}
              options={dotOptions}
              onChange={(k) => setDotColorToken(k as DotTextToken)}
              renderSwatch={(key) => (
                <span
                  className={styles.colorSwatch}
                  style={{
                    backgroundColor:
                      dotOptions.find((o) => o.key === key)?.hex ||
                      previewColors.dot,
                  }}
                />
              )}
              renderMeta={(key) =>
                dotOptions.find((o) => o.key === key)?.hex || ""
              }
            />
          )}

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

          <SegmentedControl
            label="Style"
            value={badgeStyle}
            options={[
              { value: "8 px border", label: "Rounded" },
              { value: "Full border", label: "Pill" },
            ]}
            onChange={setBadgeStyle}
          />

          <div className={shell.panelDivider} />

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

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Trailing icon</span>
              <Switch
                checked={showTrailingIcon}
                onCheckedChange={setShowTrailingIcon}
                aria-label="Mostrar icono trailing"
                style={showTrailingIcon ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Badge text
            </label>
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Color</span>
                <span className={shell.configVal}>{currentDef.label}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Type</span>
                <span className={shell.configVal}>{badgeType}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Size</span>
                <span className={shell.configVal}>
                  {SIZE_LABELS[badgeSize]}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Style</span>
                <span className={shell.configVal}>
                  {badgeStyle === "Full border" ? "Pill" : "Rounded"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Badge — ${currentDef.label} / ${badgeType} / ${SIZE_LABELS[badgeSize]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
