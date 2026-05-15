import { useState, useMemo, useEffect } from "react";
import { CodeXml } from "lucide-react";
import { SegmentedControl, ControlSelect } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import { allMaterialIconNames } from "../data/material-icon-catalog";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./tabs.module.css";

type TabVariant = "Underline" | "Segmented";
type TabState = "Default" | "Hover" | "Press" | "Selected";

function tabThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-tab-text-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-tab-text-active" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-tab-indicator" as string]: resolveJsonButtonColor("button-hover", mode),
    ["--ds-tab-pill-track" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-tab-pill-active-bg" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-tab-pill-active-text" as string]: resolveJsonTextColor(
      "text-primary-white",
      mode,
    ),
    ["--ds-tab-pill-hover-text" as string]: resolveJsonTextColor(
      "text-primary-brand",
      mode,
    ),
    ["--ds-tab-pill-border" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-tab-pill-focus-inner" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-tab-pill-focus-outer" as string]: resolveJsonButtonColor(
      "button-press",
      mode,
    ),
  };
}

function TabItemPreview({
  label,
  state,
  isActive,
  iconName,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  state: TabState;
  isActive: boolean;
  iconName?: string | null;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const effectiveState = isActive ? "Selected" : state;
  const isHighlighted =
    effectiveState === "Selected" ||
    effectiveState === "Press" ||
    effectiveState === "Hover";
  const showIndicator =
    effectiveState === "Selected" || effectiveState === "Press";

  return (
    <button
      type="button"
      className={styles.underlineTab}
      data-highlight={isHighlighted ? "true" : "false"}
      data-show-indicator={showIndicator ? "true" : "false"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {iconName ? (
        <span className={styles.underlineInner}>
          <span
            className={`material-symbols-rounded ${styles.underlineIcon}`}
            aria-hidden
          >
            {iconName}
          </span>
          {label}
        </span>
      ) : (
        label
      )}
      <span className={styles.underlineIndicator} aria-hidden />
    </button>
  );
}

function PillTabItemPreview({
  label,
  isActive,
  isHovered,
  isFocused,
  iconName,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: {
  label: string;
  isActive: boolean;
  isHovered: boolean;
  isFocused: boolean;
  iconName?: string | null;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      role="tab"
      className={styles.pillTab}
      data-active={isActive ? "true" : "false"}
      data-hover={isHovered ? "true" : "false"}
      data-focus={isFocused ? "true" : "false"}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {iconName ? (
        <span className={styles.pillInner}>
          <span
            className={`material-symbols-rounded ${styles.pillIcon}`}
            aria-hidden
          >
            {iconName}
          </span>
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
}

function PillTabBar({
  labels,
  activeIndex,
  iconName,
  onSelect,
}: {
  labels: string[];
  activeIndex: number;
  iconName?: string | null;
  onSelect: (index: number) => void;
}) {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [focusedTab, setFocusedTab] = useState<number | null>(null);

  return (
    <div className={styles.pillBar}>
      {labels.map((label, i) => (
        <PillTabItemPreview
          key={label}
          label={label}
          isActive={i === activeIndex}
          isHovered={hoveredTab === i && i !== activeIndex}
          isFocused={focusedTab === i && i !== activeIndex}
          iconName={iconName}
          onClick={() => onSelect(i)}
          onMouseEnter={() => setHoveredTab(i)}
          onMouseLeave={() => setHoveredTab(null)}
          onFocus={() => setFocusedTab(i)}
          onBlur={() => setFocusedTab(null)}
        />
      ))}
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

function buildTabsSnippet(opts: {
  variant: TabVariant;
  labels: string[];
  activeIndex: number;
  showIcon: boolean;
  iconName: string;
  mode: "light" | "dark";
}): { html: string; css: string } {
  const { variant, labels, activeIndex, showIcon, iconName, mode } = opts;

  const css = `/* Tabs — Figma 2:8279 */
.ds-tabs {
  --ds-tab-text-muted: var(--ds-color-control-ink-muted);
  --ds-tab-text-active: var(--ds-color-brand-hover);
  --ds-tab-indicator: var(--ds-color-brand-hover);
  --ds-tab-bar-border: var(--ds-color-border-default);
  --ds-tab-pill-track: var(--ds-color-surface-app);
  --ds-tab-pill-active-bg: var(--ds-color-brand);
  --ds-tab-pill-active-text: var(--ds-color-on-primary);
  --ds-tab-pill-hover-text: var(--ds-color-brand);
  --ds-tab-pill-border: var(--ds-input-border);
  font-family: var(--ds-typography-font-family);
}

.ds-tabs--underline {
  display: flex;
  border-bottom: 1px solid var(--ds-tab-bar-border);
}

.ds-tabs__tab--underline {
  position: relative;
  padding: 12px 12px 16px;
  border: none;
  background: transparent;
  color: var(--ds-tab-text-muted);
  font-size: var(--ds-typography-body-md-font-size);
  line-height: var(--ds-typography-body-md-line-height);
  cursor: pointer;
}

.ds-tabs__tab--underline[data-active="true"] {
  color: var(--ds-tab-text-active);
  font-weight: 500;
}

.ds-tabs__tab--underline[data-active="true"]::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--ds-tab-indicator);
}

.ds-tabs--segmented {
  display: flex;
  gap: 8px;
  padding: 4px;
  border-radius: 8px;
  background: var(--ds-tab-pill-track);
}

.ds-tabs__tab--segmented {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ds-tab-text-muted);
  font-size: var(--ds-typography-body-md-font-size);
  font-weight: 500;
  cursor: pointer;
}

.ds-tabs__tab--segmented[data-active="true"] {
  background: var(--ds-tab-pill-active-bg);
  color: var(--ds-tab-pill-active-text);
  border-color: var(--ds-tab-pill-border);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--ds-color-control-ink) 15%, transparent);
}`;

  if (variant === "Segmented") {
    const items = labels
      .map(
        (label, i) =>
          `  <button type="button" class="ds-tabs__tab--segmented" data-active="${i === activeIndex ? "true" : "false"}">${showIcon ? `<span class="material-symbols-rounded">${iconName}</span> ` : ""}${label}</button>`,
      )
      .join("\n");
    return {
      html: `<nav class="ds-tabs ds-tabs--segmented" aria-label="Tabs">\n${items}\n</nav>`,
      css,
    };
  }

  const items = labels
    .map(
      (label, i) =>
        `  <button type="button" class="ds-tabs__tab--underline" data-active="${i === activeIndex ? "true" : "false"}">${showIcon ? `<span class="material-symbols-rounded">${iconName}</span> ` : ""}${label}</button>`,
    )
    .join("\n");
  return {
    html: `<nav class="ds-tabs ds-tabs--underline" aria-label="Tabs">\n${items}\n</nav>`,
    css,
  };
}

const UNDERLINE_COLOR_DEFS = [
  {
    label: "Default (text)",
    cssVar: "--ds-tab-text-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Hover / Press / Selected",
    cssVar: "--ds-tab-text-active",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Indicator",
    cssVar: "--ds-tab-indicator",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
] as const;

const SEGMENTED_COLOR_DEFS = [
  {
    label: "Default (text)",
    cssVar: "--ds-tab-text-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Hover (text)",
    cssVar: "--ds-tab-pill-hover-text",
    jsonPath: "Text colors.text-primary-brand",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-brand", mode),
  },
  {
    label: "Selected (fill)",
    cssVar: "--ds-tab-pill-active-bg",
    jsonPath: "Button color.button-color",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-color", mode),
  },
  {
    label: "Border",
    cssVar: "--ds-tab-pill-border",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
  {
    label: "Focus ring (outer)",
    cssVar: "--ds-tab-pill-focus-outer",
    jsonPath: "Button color.button-press",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-press", mode),
  },
] as const;

export function TabsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [tabVariant, setTabVariant] = useState<TabVariant>("Underline");
  const [tabCount, setTabCount] = useState(3);
  const [activeTab, setActiveTab] = useState(0);
  const [tabLabels, setTabLabels] = useState([
    "Tab 1",
    "Tab 2",
    "Tab 3",
    "Tab 4",
    "Tab 5",
  ]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [showTabIcon, setShowTabIcon] = useState(false);
  const [tabIconName, setTabIconName] = useState("home");

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;
  const themeVars = useMemo(() => tabThemeVars(mode), [mode]);

  useEffect(() => {
    if (activeTab >= tabCount) setActiveTab(0);
  }, [tabCount, activeTab]);

  const visibleLabels = tabLabels.slice(0, tabCount);

  const stateColors = useMemo(() => {
    const defs =
      tabVariant === "Segmented" ? SEGMENTED_COLOR_DEFS : UNDERLINE_COLOR_DEFS;
    return defs.map((d) => ({
      label: d.label,
      cssVar: d.cssVar,
      jsonPath: d.jsonPath,
      hex: d.resolve(mode),
    }));
  }, [mode, tabVariant]);

  const codeSnippet = useMemo(
    () =>
      buildTabsSnippet({
        variant: tabVariant,
        labels: visibleLabels,
        activeIndex: activeTab,
        showIcon: showTabIcon,
        iconName: tabIconName,
        mode,
      }),
    [tabVariant, visibleLabels, activeTab, showTabIcon, tabIconName, mode],
  );

  function getTabItemState(index: number): TabState {
    if (index === activeTab) return "Selected";
    if (hoveredTab === index) return "Hover";
    return "Default";
  }

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Explora, entiende y configura el componente tabs del sistema de
          diseño. Variantes{" "}
          <strong className="font-medium text-[var(--ds-color-text-primary)]">
            Underline
          </strong>{" "}
          y{" "}
          <strong className="font-medium text-[var(--ds-color-text-primary)]">
            Segmented
          </strong>{" "}
          (Figma 2:8279). Colores vía{" "}
          <code className="font-mono text-[length:inherit]">var(--ds-tab-*)</code>
          .
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
              {tabVariant === "Underline" ? (
                <nav className={styles.underlineBar} aria-label="Tabs preview">
                  {visibleLabels.map((label, i) => (
                    <TabItemPreview
                      key={label}
                      label={label}
                      state={getTabItemState(i)}
                      isActive={i === activeTab}
                      iconName={showTabIcon ? tabIconName : null}
                      onClick={() => setActiveTab(i)}
                      onMouseEnter={() => setHoveredTab(i)}
                      onMouseLeave={() => setHoveredTab(null)}
                    />
                  ))}
                </nav>
              ) : (
                <PillTabBar
                  labels={visibleLabels}
                  activeIndex={activeTab}
                  iconName={showTabIcon ? tabIconName : null}
                  onSelect={setActiveTab}
                />
              )}
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
                label="Font size"
                value="var(--ds-typography-body-md-font-size)"
              />
              <SpecRow
                label="Weight"
                value={
                  tabVariant === "Underline"
                    ? "400 default / 500 active"
                    : "500 (Medium)"
                }
              />
              <SpecRow
                label="Line height"
                value={
                  tabVariant === "Underline"
                    ? "var(--ds-typography-body-md-line-height)"
                    : "normal"
                }
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>
              {tabVariant === "Underline"
                ? "Underline structure"
                : "Segmented structure"}
            </h3>
            <div className={shell.specDivider}>
              {tabVariant === "Underline" ? (
                <>
                  <SpecRow label="Padding X" value="var(--ds-tab-padding-x)" />
                  <SpecRow
                    label="Padding top / bottom"
                    value="var(--ds-tab-padding-top) / var(--ds-tab-padding-bottom)"
                  />
                  <SpecRow
                    label={showTabIcon ? "Icon gap" : "Item gap"}
                    value={
                      showTabIcon
                        ? "var(--ds-tab-icon-gap)"
                        : "var(--ds-tab-gap)"
                    }
                  />
                  <SpecRow
                    label="Indicator"
                    value="var(--ds-tab-indicator-h)"
                  />
                </>
              ) : (
                <>
                  <SpecRow
                    label="Container padding"
                    value="var(--ds-tab-pill-container-p)"
                  />
                  <SpecRow
                    label="Container gap"
                    value="var(--ds-tab-pill-container-gap)"
                  />
                  <SpecRow
                    label="Container radius"
                    value="var(--ds-tab-pill-container-radius)"
                  />
                  <SpecRow
                    label="Tab padding"
                    value="var(--ds-tab-pill-item-py) var(--ds-tab-pill-item-px)"
                  />
                  <SpecRow
                    label="Tab radius"
                    value="var(--ds-tab-pill-item-radius)"
                  />
                </>
              )}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>
              Colors — {tabVariant}
            </h3>
            <div className={shell.specDivider}>
              {stateColors.map((sc) => (
                <StateColorCard key={sc.label} {...sc} />
              ))}
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>All states</h3>
            <p className="mb-4 text-sm text-[var(--ds-color-text-muted)]">
              Underline (Figma 20:7158)
            </p>
            <div className="mb-8 grid grid-cols-2 gap-6">
              {(["Default", "Hover", "Press", "Selected"] as TabState[]).map(
                (state) => (
                  <div key={state} className="space-y-3">
                    <p className={styles.stateGalleryLabel}>{state}</p>
                    <nav className={styles.underlineBar}>
                      <TabItemPreview
                        label="Active"
                        state={state}
                        isActive={
                          state === "Selected" || state === "Press"
                        }
                      />
                    </nav>
                  </div>
                ),
              )}
            </div>
            <p className="mb-4 text-sm text-[var(--ds-color-text-muted)]">
              Segmented (Figma 71:1612)
            </p>
            <div className="grid grid-cols-2 gap-6">
              {(
                [
                  {
                    key: "default",
                    label: "Default",
                    active: false,
                    hover: false,
                    focus: false,
                  },
                  {
                    key: "hover",
                    label: "Hover",
                    active: false,
                    hover: true,
                    focus: false,
                  },
                  {
                    key: "focus",
                    label: "Focused",
                    active: false,
                    hover: false,
                    focus: true,
                  },
                  {
                    key: "selected",
                    label: "Selected",
                    active: true,
                    hover: false,
                    focus: false,
                  },
                ] as const
              ).map((row) => (
                <div key={row.key} className="space-y-3">
                  <p className={styles.stateGalleryLabel}>{row.label}</p>
                  <PillTabItemPreview
                    label="Tab"
                    isActive={row.active}
                    isHovered={row.hover}
                    isFocused={row.focus}
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
            <p className={shell.panelHint}>Configure the tabs properties</p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Variant"
            value={tabVariant}
            options={[
              { value: "Underline", label: "Underline" },
              { value: "Segmented", label: "Segmented" },
            ]}
            onChange={setTabVariant}
          />

          <SegmentedControl
            label="Tab count"
            value={String(tabCount)}
            options={[
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ]}
            onChange={(v) => setTabCount(Number(v))}
          />

          <SegmentedControl
            label="Active tab"
            value={String(activeTab)}
            options={visibleLabels.map((_, i) => ({
              value: String(i),
              label: `#${i + 1}`,
            }))}
            onChange={(v) => setActiveTab(Number(v))}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Icon</span>
              <Switch
                checked={showTabIcon}
                onCheckedChange={setShowTabIcon}
                aria-label="Mostrar icono a la izquierda"
                style={showTabIcon ? switchOnStyle : undefined}
              />
            </label>
          </div>

          {showTabIcon && (
            <ControlSelect
              label="Icon"
              value={tabIconName}
              options={allMaterialIconNames.map((i) => ({
                value: i,
                label: i.replace(/_/g, " "),
              }))}
              onChange={setTabIconName}
            />
          )}

          <div className={shell.panelDivider} />

          {visibleLabels.map((label, i) => (
            <div key={label}>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Tab {i + 1} label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => {
                  setTabLabels((prev) => {
                    const next = [...prev];
                    next[i] = e.target.value;
                    return next;
                  });
                }}
                className={shell.panelInput}
              />
            </div>
          ))}

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Variant</span>
                <span className={shell.configVal}>{tabVariant}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Tabs</span>
                <span className={shell.configVal}>{tabCount}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Active</span>
                <span className={shell.configVal}>#{activeTab + 1}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Icon</span>
                <span className={shell.configVal}>
                  {showTabIcon ? tabIconName : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Tabs — ${tabVariant} / ${tabCount} tabs / #${activeTab + 1}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
