import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { CodeXml } from "lucide-react";
import { SegmentedControl, ControlSelect } from "./design-system-controls";
import { Switch } from "./ui/switch";
import lightTokens from "../../imports/Ligth_mode.tokens-3.json";
import darkTokens from "../../imports/darkmode.tokens-3.json";
import { CodeModal } from "./code-modal";
import { allMaterialIconNames } from "../data/material-icon-catalog";

// ─── Types (from Figma MCP) ───────────────────────────────────────────────
// Underline: node 20:7158 — State Default/Hover/press/Selected
// Segmented: nodes 71:1599 (Building Blocks) + 71:1612 (Component 120)

type TabVariant = "Underline" | "Segmented";

type TabState = "Default" | "Hover" | "Press" | "Selected";

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

// ─── Constants from Figma tokens ────────────────────────────────────────────

const FONT_FAMILY =
  (lightTokens as any)?.global?.typography?.fontFamily?.Primary?.$value ||
  "Roboto";

const TAB_FONT_SIZE = 16;
const TAB_LINE_HEIGHT = 24;
const TAB_PADDING_X = 12;
const TAB_PADDING_TOP = 12;
const TAB_PADDING_BOTTOM = 16;
const TAB_GAP = 8;
const INDICATOR_HEIGHT = 2;

// Segmented (Building Blocks / Component 120) — Figma nodes 71:1599, 71:1612
const PILL_CONTAINER_PADDING = 4;
const PILL_CONTAINER_GAP = 8;
const PILL_CONTAINER_RADIUS = 8;
const PILL_ITEM_PADDING_X = 16;
const PILL_ITEM_PADDING_Y = 10;
const PILL_ITEM_RADIUS = 6;
const PILL_FONT_SIZE = 16;
const PILL_SELECTED_SHADOW = "0px 1px 2px 0px rgba(11, 18, 32, 0.15)";

/** Gap between leading icon and label (product option). */
const ICON_LABEL_GAP = 4;
const TAB_ICON_SIZE = 20;

const TAB_ICON_SYMBOL_STYLE: React.CSSProperties = {
  fontSize: TAB_ICON_SIZE,
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
};

// ─── Single tab item preview (Underline — Figma 20:7158) ────────────────────

function TabItemPreview({
  label,
  state,
  isActive,
  tokens,
  iconName,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  state: TabState;
  isActive: boolean;
  tokens: any;
  iconName?: string | null;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const textSecondary = resolveColor(
    tokens,
    "global.color.Text colors.text-secondary"
  );
  const brandHover = resolveColor(
    tokens,
    "global.color.Button color.button-hover"
  );

  const effectiveState = isActive ? "Selected" : state;
  const isHighlighted =
    effectiveState === "Selected" ||
    effectiveState === "Press" ||
    effectiveState === "Hover";
  const showIndicator =
    effectiveState === "Selected" || effectiveState === "Press";

  const textColor = isHighlighted ? brandHover : textSecondary;
  const fontWeight = isHighlighted ? 500 : 400;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: TAB_GAP,
    paddingLeft: TAB_PADDING_X,
    paddingRight: TAB_PADDING_X,
    paddingTop: TAB_PADDING_TOP,
    paddingBottom: TAB_PADDING_BOTTOM,
    position: "relative",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "color 0.15s ease",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: TAB_FONT_SIZE,
    fontWeight,
    lineHeight: `${TAB_LINE_HEIGHT}px`,
    color: textColor,
    transition: "color 0.15s ease, font-weight 0.15s ease",
  };

  const indicatorStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: INDICATOR_HEIGHT,
    backgroundColor: brandHover,
    transform: showIndicator ? "scaleX(1)" : "scaleX(0)",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const iconEl = iconName ? (
    <span
      className="material-symbols-rounded"
      style={{
        ...TAB_ICON_SYMBOL_STYLE,
        color: textColor,
      }}
      aria-hidden
    >
      {iconName}
    </span>
  ) : null;

  return (
    <div
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {iconName ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ICON_LABEL_GAP,
          }}
        >
          {iconEl}
          <span style={textStyle}>{label}</span>
        </div>
      ) : (
        <span style={textStyle}>{label}</span>
      )}
      <div style={indicatorStyle} />
    </div>
  );
}

// ─── Segmented tab item (Component 120 — Figma 71:1612) ─────────────────────

function PillTabItemPreview({
  label,
  isActive,
  isHovered,
  isFocused,
  tokens,
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
  tokens: any;
  iconName?: string | null;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}) {
  const buttonColor = resolveColor(
    tokens,
    "global.color.Button color.button-color"
  );
  const borderPrimary = resolveColor(
    tokens,
    "global.color.Border color.border-primary"
  );
  const bgContainer = resolveColor(
    tokens,
    "global.color.Background.bg-container"
  );
  const buttonPress = resolveColor(
    tokens,
    "global.color.Button color.button-press"
  );
  const textSecondary = resolveColor(
    tokens,
    "global.color.Text colors.text-secondary"
  );
  const textBrand = resolveColor(
    tokens,
    "global.color.Text colors.text-primary-brand"
  );
  const textWhite = resolveColor(
    tokens,
    "global.color.Text colors.text-primary-white"
  );

  let backgroundColor = "transparent";
  let color = textSecondary;
  let border: string = "1px solid transparent";
  let boxShadow: string | undefined;
  let overflow: React.CSSProperties["overflow"] = "visible";

  if (isActive) {
    backgroundColor = buttonColor;
    color = textWhite;
    border = `1px solid ${borderPrimary}`;
    boxShadow = PILL_SELECTED_SHADOW;
  } else if (isFocused) {
    backgroundColor = buttonColor;
    color = textWhite;
    border = `1px solid ${borderPrimary}`;
    overflow = "clip";
    boxShadow = `0px 0px 0px 1px ${bgContainer}, 0px 0px 0px 2px ${buttonPress}`;
  } else if (isHovered) {
    color = textBrand;
  }

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: PILL_ITEM_PADDING_X,
    paddingRight: PILL_ITEM_PADDING_X,
    paddingTop: PILL_ITEM_PADDING_Y,
    paddingBottom: PILL_ITEM_PADDING_Y,
    borderRadius: PILL_ITEM_RADIUS,
    backgroundColor,
    border,
    boxShadow,
    overflow,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition:
      "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: `'${FONT_FAMILY}', sans-serif`,
    fontSize: PILL_FONT_SIZE,
    fontWeight: 500,
    lineHeight: "normal",
    color,
  };

  const iconEl = iconName ? (
    <span
      className="material-symbols-rounded"
      style={{
        ...TAB_ICON_SYMBOL_STYLE,
        color,
      }}
      aria-hidden
    >
      {iconName}
    </span>
  ) : null;

  return (
    <div
      role="tab"
      tabIndex={0}
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {iconName ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ICON_LABEL_GAP,
          }}
        >
          {iconEl}
          <span style={textStyle}>{label}</span>
        </div>
      ) : (
        <span style={textStyle}>{label}</span>
      )}
    </div>
  );
}

function PillTabBar({
  labels,
  activeIndex,
  tokens,
  iconName,
  onSelect,
}: {
  labels: string[];
  activeIndex: number;
  tokens: any;
  iconName?: string | null;
  onSelect: (index: number) => void;
}) {
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [focusedTab, setFocusedTab] = useState<number | null>(null);

  const bgPrimary = resolveColor(
    tokens,
    "global.color.Background.bg-primary"
  );

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: PILL_CONTAINER_GAP,
    alignItems: "center",
    padding: PILL_CONTAINER_PADDING,
    borderRadius: PILL_CONTAINER_RADIUS,
    backgroundColor: bgPrimary,
  };

  return (
    <div style={containerStyle}>
      {labels.map((label, i) => (
        <PillTabItemPreview
          key={i}
          label={label}
          isActive={i === activeIndex}
          isHovered={hoveredTab === i && i !== activeIndex}
          isFocused={focusedTab === i && i !== activeIndex}
          tokens={tokens}
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

// ─── Spec row ───────────────────────────────────────────────────────────────

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

// ─── Main view ──────────────────────────────────────────────────────────────

export function TabsView() {
  const { theme } = useTheme();
  const tokens = theme === "dark" ? darkTokens : lightTokens;

  const accentBlue = resolveColor(
    tokens,
    "global.color.Button color.button-color"
  );

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

  useEffect(() => {
    if (activeTab >= tabCount) setActiveTab(0);
  }, [tabCount, activeTab]);

  const visibleLabels = tabLabels.slice(0, tabCount);

  const stateColors = useMemo(() => {
    const t = tokens as any;
    const secondary = resolveColor(
      t,
      "global.color.Text colors.text-secondary"
    );
    const hover = resolveColor(t, "global.color.Button color.button-hover");
    const brand = resolveColor(
      t,
      "global.color.Text colors.text-primary-brand"
    );
    const btn = resolveColor(t, "global.color.Button color.button-color");
    const border = resolveColor(t, "global.color.Border color.border-primary");
    const press = resolveColor(t, "global.color.Button color.button-press");

    if (tabVariant === "Segmented") {
      return [
        {
          label: "Default (text)",
          hex: secondary,
          tokenName: "text-secondary",
        },
        {
          label: "Hover (text)",
          hex: brand,
          tokenName: "text-primary-brand",
        },
        {
          label: "Selected (fill + shadow)",
          hex: btn,
          tokenName: "button-color",
        },
        { label: "Border", hex: border, tokenName: "border-primary" },
        {
          label: "Focus ring (outer)",
          hex: press,
          tokenName: "button-press",
        },
      ];
    }

    return [
      { label: "Default (text)", hex: secondary, tokenName: "text-secondary" },
      {
        label: "Hover / Press / Selected",
        hex: hover,
        tokenName: "button-hover",
      },
      {
        label: "Indicator",
        hex: hover,
        tokenName: "button-hover",
      },
    ];
  }, [theme, tokens, tabVariant]);

  const codeSnippet = useMemo(() => {
    if (tabVariant === "Segmented") {
      const bgPrimary = resolveColor(
        tokens,
        "global.color.Background.bg-primary"
      );
      const buttonColor = resolveColor(
        tokens,
        "global.color.Button color.button-color"
      );
      const borderPrimary = resolveColor(
        tokens,
        "global.color.Border color.border-primary"
      );
      const secondary = resolveColor(
        tokens,
        "global.color.Text colors.text-secondary"
      );
      const textWhite = resolveColor(
        tokens,
        "global.color.Text colors.text-primary-white"
      );

      const items = visibleLabels
        .map((label, i) => {
          const isActive = i === activeTab;
          const bg = isActive ? buttonColor : "transparent";
          const color = isActive ? textWhite : secondary;
          const border = isActive ? `1px solid ${borderPrimary}` : "1px solid transparent";
          const shadow = isActive ? PILL_SELECTED_SHADOW : "none";
          const labelInner = showTabIcon
            ? `<div style="display: flex; align-items: center; gap: ${ICON_LABEL_GAP}px;"><span class="material-symbols-rounded" style="font-size: ${TAB_ICON_SIZE}px; color: ${color}; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">${tabIconName}</span><span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${PILL_FONT_SIZE}px; font-weight: 500; color: ${color};">${label}</span></div>`
            : `<span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${PILL_FONT_SIZE}px; font-weight: 500; color: ${color};">${label}</span>`;
          return `  <div style="display: flex; align-items: center; justify-content: center; padding: ${PILL_ITEM_PADDING_Y}px ${PILL_ITEM_PADDING_X}px; border-radius: ${PILL_ITEM_RADIUS}px; background: ${bg}; border: ${border}; box-shadow: ${shadow}; cursor: pointer;">
    ${labelInner}
  </div>`;
        })
        .join("\n");

      return `<div style="display: flex; gap: ${PILL_CONTAINER_GAP}px; align-items: center; padding: ${PILL_CONTAINER_PADDING}px; border-radius: ${PILL_CONTAINER_RADIUS}px; background: ${bgPrimary};">\n${items}\n</div>`;
    }

    const secondary = resolveColor(
      tokens,
      "global.color.Text colors.text-secondary"
    );
    const hover = resolveColor(
      tokens,
      "global.color.Button color.button-hover"
    );

    const tabs = visibleLabels
      .map((label, i) => {
        const isActive = i === activeTab;
        const color = isActive ? hover : secondary;
        const weight = isActive ? 500 : 400;
        const indicator = isActive
          ? `\n    <span style="position: absolute; bottom: 0; left: 0; right: 0; height: ${INDICATOR_HEIGHT}px; background: ${hover};"></span>`
          : "";
        const labelInner = showTabIcon
          ? `<div style="display: flex; align-items: center; gap: ${ICON_LABEL_GAP}px;"><span class="material-symbols-rounded" style="font-size: ${TAB_ICON_SIZE}px; color: ${color}; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">${tabIconName}</span><span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${TAB_FONT_SIZE}px; font-weight: ${weight}; line-height: ${TAB_LINE_HEIGHT}px; color: ${color};">${label}</span></div>`
          : `<span style="font-family: '${FONT_FAMILY}', sans-serif; font-size: ${TAB_FONT_SIZE}px; font-weight: ${weight}; line-height: ${TAB_LINE_HEIGHT}px; color: ${color};">${label}</span>`;
        return `  <div style="display: flex; align-items: center; justify-content: center; padding: ${TAB_PADDING_TOP}px ${TAB_PADDING_X}px ${TAB_PADDING_BOTTOM}px; position: relative; cursor: pointer;">
    ${labelInner}${indicator}
  </div>`;
      })
      .join("\n");

    return `<div style="display: flex; border-bottom: 1px solid #e5e7eb;">\n${tabs}\n</div>`;
  }, [visibleLabels, activeTab, tokens, tabVariant, showTabIcon, tabIconName]);

  function getTabItemState(index: number): TabState {
    if (index === activeTab) return "Selected";
    if (hoveredTab === index) return "Hover";
    return "Default";
  }

  return (
    <div className="flex gap-8">
      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pr-80">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tabs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Explora, entiende y configura el componente tabs del sistema de
            diseño.
          </p>
        </div>

        {/* ── Preview ─────────────────────────────────────────────────── */}
        <div className="mb-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl relative overflow-hidden min-h-[280px]">
            <div className="absolute left-0 right-0 top-14 h-px bg-gray-200 dark:bg-gray-800" />
            <div className="absolute top-3 left-0 right-0 flex items-center justify-between pl-5 pr-3 z-10">
              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Preview
              </h2>
              <button
                onClick={() => setShowCodeModal(true)}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all overflow-clip shadow-[inset_0px_0px_0px_1px_rgba(1,17,31,0.1),inset_0px_-2px_2px_0px_rgba(1,17,31,0.1)]"
                title="View Code"
              >
                <CodeXml className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute left-0 right-0 top-16 bottom-0 flex items-center justify-center">
              {tabVariant === "Underline" ? (
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid",
                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  }}
                >
                  {visibleLabels.map((label, i) => (
                    <TabItemPreview
                      key={i}
                      label={label}
                      state={getTabItemState(i)}
                      isActive={i === activeTab}
                      tokens={tokens}
                      iconName={showTabIcon ? tabIconName : null}
                      onClick={() => setActiveTab(i)}
                      onMouseEnter={() => setHoveredTab(i)}
                      onMouseLeave={() => setHoveredTab(null)}
                    />
                  ))}
                </div>
              ) : (
                <PillTabBar
                  labels={visibleLabels}
                  activeIndex={activeTab}
                  tokens={tokens}
                  iconName={showTabIcon ? tabIconName : null}
                  onSelect={setActiveTab}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Component Spec ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Typography */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Typography
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              <SpecRow label="Font family" value={FONT_FAMILY} />
              <SpecRow
                label="Font size"
                value={
                  tabVariant === "Segmented"
                    ? `${PILL_FONT_SIZE}px`
                    : `${TAB_FONT_SIZE}px`
                }
              />
              {tabVariant === "Underline" ? (
                <>
                  <SpecRow label="Weight (default)" value="400 (Regular)" />
                  <SpecRow label="Weight (active)" value="500 (Medium)" />
                  <SpecRow
                    label="Line height"
                    value={`${TAB_LINE_HEIGHT}px`}
                  />
                </>
              ) : (
                <>
                  <SpecRow label="Weight" value="500 (Medium)" />
                  <SpecRow label="Line height" value="normal" />
                </>
              )}
              <SpecRow label="Letter spacing" value="0" />
            </div>
          </div>

          {/* Tab Item Structure */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Tab Item Structure
            </h3>
            <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
              {tabVariant === "Underline" ? (
                <>
                  <SpecRow
                    label="Padding X"
                    value={`${TAB_PADDING_X}px`}
                  />
                  <SpecRow
                    label="Padding top"
                    value={`${TAB_PADDING_TOP}px`}
                  />
                  <SpecRow
                    label="Padding bottom"
                    value={`${TAB_PADDING_BOTTOM}px`}
                  />
                  <SpecRow
                    label={showTabIcon ? "Icon ↔ label gap" : "Gap (icon ↔ text)"}
                    value={
                      showTabIcon ? `${ICON_LABEL_GAP}px` : `${TAB_GAP}px`
                    }
                  />
                  <SpecRow
                    label="Indicator height"
                    value={`${INDICATOR_HEIGHT}px`}
                  />
                  <SpecRow label="Indicator position" value="Bottom" />
                </>
              ) : (
                <>
                  <SpecRow
                    label="Container padding"
                    value={`${PILL_CONTAINER_PADDING}px`}
                  />
                  <SpecRow
                    label="Container gap"
                    value={`${PILL_CONTAINER_GAP}px`}
                  />
                  <SpecRow
                    label="Container radius"
                    value={`${PILL_CONTAINER_RADIUS}px`}
                  />
                  <SpecRow
                    label="Tab padding X / Y"
                    value={`${PILL_ITEM_PADDING_X}px / ${PILL_ITEM_PADDING_Y}px`}
                  />
                  <SpecRow
                    label="Tab border radius"
                    value={`${PILL_ITEM_RADIUS}px`}
                  />
                  <SpecRow label="Selected shadow" value={PILL_SELECTED_SHADOW} />
                  {showTabIcon && (
                    <SpecRow
                      label="Icon ↔ label gap"
                      value={`${ICON_LABEL_GAP}px`}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Colors (States) */}
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

          {/* All States Gallery */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              All States
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Underline (Figma 20:7158)
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {(
                ["Default", "Hover", "Press", "Selected"] as TabState[]
              ).map((state) => (
                <div key={state} className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    {state}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      borderBottom: "1px solid",
                      borderColor:
                        theme === "dark" ? "#374151" : "#e5e7eb",
                    }}
                  >
                    <TabItemPreview
                      label="Active"
                      state={state}
                      isActive={
                        state === "Selected" || state === "Press"
                      }
                      tokens={tokens}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Segmented — Component 120 (Figma 71:1612)
            </p>
            <div className="grid grid-cols-2 gap-6">
              {(
                [
                  { key: "default", label: "Default", active: false, hover: false, focus: false },
                  { key: "hover", label: "Hover", active: false, hover: true, focus: false },
                  { key: "focus", label: "Focused", active: false, hover: false, focus: true },
                  { key: "selected", label: "Selected", active: true, hover: false, focus: false },
                ] as const
              ).map((row) => (
                <div key={row.key} className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    {row.label}
                  </p>
                  <PillTabItemPreview
                    label="Tab"
                    isActive={row.active}
                    isHovered={row.hover}
                    isFocused={row.focus}
                    tokens={tokens}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Control Panel) ───────────────────────────────── */}
      <div className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Controls
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Configure the tabs properties
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          <SegmentedControl
            label="Variant"
            value={tabVariant}
            options={[
              { value: "Underline", label: "Underline" },
              { value: "Segmented", label: "Segmented" },
            ]}
            onChange={setTabVariant}
          />

          {/* Number of tabs */}
          <SegmentedControl
            label="Tab Count"
            value={String(tabCount)}
            options={[
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ]}
            onChange={(v) => setTabCount(Number(v))}
          />

          {/* Active tab */}
          <SegmentedControl
            label="Active Tab"
            value={String(activeTab)}
            options={visibleLabels.map((_, i) => ({
              value: String(i),
              label: `#${i + 1}`,
            }))}
            onChange={(v) => setActiveTab(Number(v))}
          />

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Icon
              </span>
              <Switch
                checked={showTabIcon}
                onCheckedChange={(v) => setShowTabIcon(v)}
                aria-label="Mostrar icono a la izquierda"
                style={
                  showTabIcon ? { backgroundColor: accentBlue } : undefined
                }
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

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Label text inputs */}
          {visibleLabels.map((label, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Tab {i + 1} Label
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
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="h-px bg-gray-200 dark:bg-gray-800" />

          {/* Quick reference */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Current Config
            </label>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Variant
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {tabVariant}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Tab count
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {tabCount}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Active tab
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  #{activeTab + 1}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Icon</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {showTabIcon ? tabIconName : "—"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Font size
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {`${tabVariant === "Segmented" ? PILL_FONT_SIZE : TAB_FONT_SIZE}px`}
                </span>
              </div>
              {tabVariant === "Underline" && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Indicator
                  </span>
                  <span className="text-gray-900 dark:text-white font-mono">
                    {INDICATOR_HEIGHT}px
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Tabs — ${tabVariant} / ${tabCount} tabs / Active #${activeTab + 1}`}
          code={codeSnippet}
        />
      )}
    </div>
  );
}
