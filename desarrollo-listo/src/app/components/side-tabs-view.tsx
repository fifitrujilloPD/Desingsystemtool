import { useState, useMemo } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import {
  resolveJsonBackgroundColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./side-tabs.module.css";

/** Figma: primary | Secundarios */
type SideTabType = "primary" | "secondary";
type SideTabState = "enabled" | "hovered";

const TYPE_LABELS: Record<SideTabType, string> = {
  primary: "Primary",
  secondary: "Secondary",
};

const STATE_LABELS: Record<SideTabState, string> = {
  enabled: "Enabled",
  hovered: "Hovered",
};

const DEFAULT_LABELS = ["Label", "Label", "Label", "Label", "Label"];
const DEFAULT_ICON = "radio_button_unchecked";

const COLOR_DEFS = [
  {
    label: "Label default (primary)",
    cssVar: "--ds-side-tab-label",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Label hover (primary)",
    cssVar: "--ds-side-tab-label",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Label selected (primary)",
    cssVar: "--ds-side-tab-label",
    jsonPath: "Text colors.text-primary-brand",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-brand", mode),
  },
  {
    label: "Label default (secondary)",
    cssVar: "--ds-side-tab-label",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Label hover / dot (secondary)",
    cssVar: "--ds-side-tab-dot-hover",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Label / dot selected",
    cssVar: "--ds-side-tab-dot-selected",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Selected background",
    cssVar: "--ds-side-tab-selected-bg",
    jsonPath: "Background.bg-brand-ships",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-brand-ships", mode),
  },
  {
    label: "Hover background",
    cssVar: "--ds-side-tab-hover-bg",
    jsonPath: "Button color.button-hover (10% mix)",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
] as const;

function sideTabThemeVars(mode: "light" | "dark"): React.CSSProperties {
  const hoverBase = resolveJsonButtonColor("button-hover", mode);
  return {
    ["--ds-side-tab-selected-bg" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-side-tab-hover-bg" as string]: `color-mix(in srgb, ${hoverBase} 10%, transparent)`,
    ["--ds-side-tab-dot" as string]: resolveJsonTextColor(
      "text-disabled",
      mode,
    ),
    ["--ds-side-tab-dot-hover" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-side-tab-dot-selected" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-side-tab-counter" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function resolveLabelColor(opts: {
  type: SideTabType;
  state: SideTabState;
  selected: boolean;
  mode: "light" | "dark";
}): string {
  const { type, state, selected, mode } = opts;
  if (type === "secondary") {
    if (selected) return resolveJsonButtonColor("button-color", mode);
    if (state === "hovered") return resolveJsonButtonColor("button-hover", mode);
    return resolveJsonTextColor("text-tertiary", mode);
  }
  if (selected) return resolveJsonTextColor("text-primary-brand", mode);
  if (state === "hovered") return resolveJsonTextColor("text-primary", mode);
  return resolveJsonTextColor("text-secondary", mode);
}

function resolveIconColor(opts: {
  type: SideTabType;
  state: SideTabState;
  selected: boolean;
  mode: "light" | "dark";
}): string {
  const { type, state, selected, mode } = opts;
  if (type === "secondary") {
    if (selected) return resolveJsonButtonColor("button-color", mode);
    if (state === "hovered") return resolveJsonButtonColor("button-hover", mode);
    return resolveJsonTextColor("text-tertiary", mode);
  }
  if (selected) return resolveJsonTextColor("text-primary-brand", mode);
  if (state === "hovered") return resolveJsonTextColor("text-primary", mode);
  return resolveJsonTextColor("text-secondary", mode);
}

export function SideNavItem({
  type,
  state,
  selected,
  showIcon,
  label,
  iconName = DEFAULT_ICON,
  showActions = false,
  showCounter = false,
  showDrop = false,
  interactive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
}: {
  type: SideTabType;
  state: SideTabState;
  selected: boolean;
  showIcon: boolean;
  label: string;
  iconName?: string;
  showActions?: boolean;
  showCounter?: boolean;
  showDrop?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}) {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const labelColor = resolveLabelColor({ type, state, selected, mode });
  const iconColor = resolveIconColor({ type, state, selected, mode });

  const itemStyle: React.CSSProperties = {
    ...style,
    ["--ds-side-tab-label" as string]: labelColor,
    ["--ds-side-tab-icon" as string]: iconColor,
  };

  const showLeadingIcon = type === "primary" && showIcon;
  const showStatusDot = type === "secondary";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={styles.item}
      data-type={type}
      data-state={state}
      data-selected={selected ? "true" : "false"}
      data-has-icon={showLeadingIcon ? "true" : "false"}
      tabIndex={interactive ? 0 : -1}
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={styles.stateLayer}>
        <span className={styles.content}>
          {showStatusDot ? (
            <span className={styles.statusDot} aria-hidden />
          ) : null}
          {showLeadingIcon ? (
            <span
              className={`material-symbols-rounded ${styles.materialIcon}`}
              aria-hidden
            >
              {iconName}
            </span>
          ) : null}
          <span className={styles.label}>{label}</span>
        </span>
        {showActions && (showCounter || showDrop) ? (
          <span className={styles.actions}>
            {showCounter ? (
              <span className={styles.counter}>10</span>
            ) : null}
            {showDrop ? (
              <span
                className={`material-symbols-rounded ${styles.chevron}`}
                aria-hidden
              >
                arrow_drop_down
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
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

function buildSideTabSnippet(opts: {
  type: SideTabType;
  selected: boolean;
  showIcon: boolean;
  label: string;
  iconName: string;
  showActions: boolean;
  showCounter: boolean;
  showDrop: boolean;
  selectedBg: string;
  labelHex: string;
}): { html: string; css: string } {
  const {
    type,
    selected,
    showIcon,
    label,
    iconName,
    showActions,
    showCounter,
    showDrop,
    selectedBg,
    labelHex,
  } = opts;

  const dotHtml =
    type === "secondary"
      ? '  <span class="ds-side-tab__dot" aria-hidden></span>\n'
      : "";
  const iconHtml =
    type === "primary" && showIcon
      ? `  <span class="material-symbols-rounded ds-side-tab__icon">${iconName}</span>\n`
      : "";
  const actionsHtml =
    showActions && (showCounter || showDrop)
      ? `  <span class="ds-side-tab__actions">${showCounter ? '<span class="ds-side-tab__counter">10</span>' : ""}${showDrop ? '<span class="material-symbols-rounded">arrow_drop_down</span>' : ""}</span>\n`
      : "";

  const css = `/* Side tab — Figma 131:69223 */
.ds-side-tab {
  --ds-side-tab-selected-bg: ${selectedBg};
  --ds-side-tab-label: ${labelHex};
  display: flex;
  align-items: center;
  width: 274px;
  max-width: 100%;
  border: none;
  border-radius: 100px;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-family: var(--ds-typography-font-family);
}

.ds-side-tab[data-selected="true"][data-type="primary"] .ds-side-tab__layer {
  background: var(--ds-side-tab-selected-bg);
}

.ds-side-tab__layer {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: inherit;
}

.ds-side-tab__content {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ds-side-tab__dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--ds-side-tab-label);
  flex-shrink: 0;
}

.ds-side-tab__label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ds-side-tab-label);
}`;

  return {
    html: `<button type="button" class="ds-side-tab" role="tab" data-type="${type}" data-selected="${selected ? "true" : "false"}" aria-selected="${selected}">
  <span class="ds-side-tab__layer">
    <span class="ds-side-tab__content">
${dotHtml}${iconHtml}      <span class="ds-side-tab__label">${label}</span>
    </span>
${actionsHtml}  </span>
</button>`,
    css,
  };
}

const PRIMARY_GALLERY: {
  state: SideTabState;
  selected: boolean;
  label: string;
}[] = [
  { state: "enabled", selected: false, label: "Default" },
  { state: "hovered", selected: false, label: "Hovered" },
  { state: "enabled", selected: true, label: "Selected" },
];

const SECONDARY_GALLERY: typeof PRIMARY_GALLERY = [
  { state: "enabled", selected: false, label: "Default" },
  { state: "hovered", selected: false, label: "Hovered" },
  { state: "enabled", selected: true, label: "Selected" },
];

export function SideTabsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [tabType, setTabType] = useState<SideTabType>("primary");
  const [panelState, setPanelState] = useState<SideTabState>("enabled");
  const [selected, setSelected] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [labelText, setLabelText] = useState("Label");
  const [iconName, setIconName] = useState(DEFAULT_ICON);
  const [itemCount, setItemCount] = useState(4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => sideTabThemeVars(mode), [mode]);

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

  const visibleLabels = labels.slice(0, itemCount);

  const previewState: SideTabState =
    panelState === "hovered" ? "hovered" : "enabled";

  const codeSnippet = useMemo(
    () =>
      buildSideTabSnippet({
        type: tabType,
        selected,
        showIcon,
        label: labelText,
        iconName,
        showActions,
        showCounter,
        showDrop,
        selectedBg: stateColors[6]?.hex ?? "",
        labelHex: resolveLabelColor({
          type: tabType,
          state: previewState,
          selected,
          mode,
        }),
      }),
    [
      tabType,
      selected,
      showIcon,
      labelText,
      iconName,
      showActions,
      showCounter,
      showDrop,
      stateColors,
      previewState,
      mode,
    ],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Side tabs / Nav item (Figma 131:69223): rail vertical con variantes{" "}
          <strong>Primary</strong> (icono opcional, pill al hover/selected) y{" "}
          <strong>Secondary</strong> (punto de estado + indent 24px). Acciones
          opcionales: contador y chevron.
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
              <nav
                className={styles.rail}
                role="tablist"
                aria-label="Side navigation preview"
              >
                {visibleLabels.map((label, i) => (
                  <SideNavItem
                    key={`${label}-${i}`}
                    type={tabType}
                    state={
                      hoveredIndex === i && i !== activeIndex
                        ? "hovered"
                        : "enabled"
                    }
                    selected={i === activeIndex}
                    showIcon={showIcon}
                    label={label}
                    iconName={iconName}
                    showActions={showActions}
                    showCounter={showCounter}
                    showDrop={showDrop}
                    interactive
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Width" value="var(--ds-side-tab-width)" />
              <SpecRow label="Radius" value="var(--ds-side-tab-radius)" />
              <SpecRow
                label="Padding"
                value="12px · secondary pl 24px"
              />
              <SpecRow label="Type" value={TYPE_LABELS[tabType]} />
              <SpecRow label="Icon" value={showIcon ? "true" : "false"} />
              <SpecRow
                label="Actions"
                value={
                  showActions
                    ? `counter ${showCounter ? "on" : "off"} · drop ${showDrop ? "on" : "off"}`
                    : "off"
                }
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Label" value="14px / 500 / 20px lh" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Colors</h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.jsonPath} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>All states</h3>
            <div className={styles.stateGallerySection}>
              <p className={styles.stateGallerySectionTitle}>Primary</p>
              <div className={styles.stateGallery}>
                {PRIMARY_GALLERY.map((row) => (
                  <div key={row.label} className={styles.stateGalleryItem}>
                    <span className={styles.stateGalleryLabel}>{row.label}</span>
                    <SideNavItem
                      type="primary"
                      state={row.state}
                      selected={row.selected}
                      showIcon
                      label="Label"
                      iconName={DEFAULT_ICON}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={styles.stateGallerySectionTitle}>Secondary</p>
              <div className={styles.stateGallery}>
                {SECONDARY_GALLERY.map((row) => (
                  <div key={row.label} className={styles.stateGalleryItem}>
                    <span className={styles.stateGalleryLabel}>{row.label}</span>
                    <SideNavItem
                      type="secondary"
                      state={row.state}
                      selected={row.selected}
                      showIcon={false}
                      label="Label"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-6">
          <div>
            <h2 className={shell.panelTitle}>Controls</h2>
            <p className={shell.panelHint}>
              Type, state, selection y rail interactivo
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Type"
            value={tabType}
            options={[
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
            ]}
            onChange={(v) => setTabType(v as SideTabType)}
          />

          <ControlSelect
            label="State (single item)"
            value={panelState}
            options={(["enabled", "hovered"] as SideTabState[]).map((s) => ({
              value: s,
              label: STATE_LABELS[s],
            }))}
            onChange={(v) => setPanelState(v as SideTabState)}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Selected</span>
              <Switch
                checked={selected}
                onCheckedChange={setSelected}
                aria-label="Selected"
                style={selected ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {tabType === "primary" ? (
            <div>
              <label className="flex items-center justify-between gap-4">
                <span className={shell.panelLabel}>Icon</span>
                <Switch
                  checked={showIcon}
                  onCheckedChange={setShowIcon}
                  aria-label="Mostrar icono"
                  style={showIcon ? switchOnStyle : undefined}
                />
              </label>
            </div>
          ) : null}

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Actions</span>
              <Switch
                checked={showActions}
                onCheckedChange={setShowActions}
                aria-label="Mostrar acciones"
                style={showActions ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showActions ? (
            <>
              <div>
                <label className="flex items-center justify-between gap-4">
                  <span className={shell.panelLabel}>Counter</span>
                  <Switch
                    checked={showCounter}
                    onCheckedChange={setShowCounter}
                    aria-label="Contador"
                    style={showCounter ? switchOnStyle : undefined}
                  />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between gap-4">
                  <span className={shell.panelLabel}>Dropdown</span>
                  <Switch
                    checked={showDrop}
                    onCheckedChange={setShowDrop}
                    aria-label="Chevron dropdown"
                    style={showDrop ? switchOnStyle : undefined}
                  />
                </label>
              </div>
            </>
          ) : null}

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>Label</label>
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          {tabType === "primary" && showIcon ? (
            <ControlSelect
              label="Icon"
              value={iconName}
              options={allMaterialIconNames.slice(0, 80).map((name) => ({
                value: name,
                label: name,
              }))}
              onChange={setIconName}
            />
          ) : null}

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Item count"
            value={String(itemCount)}
            options={["1", "2", "3", "4", "5"].map((n) => ({
              value: n,
              label: n,
            }))}
            onChange={(v) => {
              const n = Number(v);
              setItemCount(n);
              setActiveIndex((i) => Math.min(i, n - 1));
            }}
          />

          {itemCount > 1 ? (
            <SegmentedControl
              label="Active item"
              value={String(activeIndex)}
              options={visibleLabels.map((_, i) => ({
                value: String(i),
                label: `#${i + 1}`,
              }))}
              onChange={(v) => setActiveIndex(Number(v))}
            />
          ) : null}

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              {itemCount === 1 ? "Label" : "Rail labels"}
            </label>
            <div className="space-y-2">
              {visibleLabels.map((lbl, i) => (
                <input
                  key={i}
                  type="text"
                  value={lbl}
                  onChange={(e) => {
                    const next = [...labels];
                    next[i] = e.target.value;
                    setLabels(next);
                  }}
                  className={shell.panelInput}
                  aria-label={`Label ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Single item preview
            </label>
            <SideNavItem
              type={tabType}
              state={previewState}
              selected={selected}
              showIcon={tabType === "primary" && showIcon}
              label={labelText}
              iconName={iconName}
              showActions={showActions}
              showCounter={showCounter}
              showDrop={showDrop}
            />
          </div>

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
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Side tabs — ${TYPE_LABELS[tabType]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
