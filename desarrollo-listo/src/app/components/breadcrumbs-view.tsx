import { useState, useMemo, type ReactNode } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
import { CodeModal } from "./code-modal";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBorderColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import shell from "./radio-button.module.css";
import styles from "./breadcrumbs.module.css";

type BreadcrumbBreakpoint = "desktop" | "mobile";
type BreadcrumbLinkCount = 2 | 3 | 4 | 5 | 6 | 7;

const ELLIPSIS_ITEM_THRESHOLD = 5;

const DEFAULT_LINK_LABELS = [
  "Settings",
  "Catalog",
  "Products",
  "Reports",
  "Billing",
  "Members",
  "Team",
];

const BREAKPOINT_LABELS: Record<BreadcrumbBreakpoint, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
};

const COLOR_DEFS = [
  {
    label: "Link / ellipsis",
    cssVar: "--ds-bc-link",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Link hover",
    cssVar: "--ds-bc-link-hover",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Current page",
    cssVar: "--ds-bc-current",
    jsonPath: "Text colors.text-primary-brand",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary-brand", mode),
  },
  {
    label: "Separator",
    cssVar: "--ds-bc-separator",
    jsonPath: "Border color.border-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", mode),
  },
  {
    label: "Home icon",
    cssVar: "--ds-bc-home",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
] as const;

function breadcrumbThemeVars(mode: "light" | "dark"): React.CSSProperties {
  const tertiary = resolveJsonTextColor("text-tertiary", mode);
  return {
    ["--ds-bc-link" as string]: tertiary,
    ["--ds-bc-ellipsis" as string]: tertiary,
    ["--ds-bc-link-hover" as string]: resolveJsonTextColor("text-primary", mode),
    ["--ds-bc-current" as string]: resolveJsonTextColor(
      "text-primary-brand",
      mode,
    ),
    ["--ds-bc-separator" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-bc-home" as string]: tertiary,
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

type BreadcrumbSegment =
  | { kind: "home" }
  | { kind: "link"; label: string }
  | { kind: "ellipsis" }
  | { kind: "current"; label: string };

function activeLinkLabels(
  linkCount: BreadcrumbLinkCount,
  linkLabels: string[],
): string[] {
  return linkLabels
    .slice(0, linkCount)
    .map((label) => label.trim())
    .filter(Boolean);
}

/** Elipsis solo si el trail tendría más de 5 ítems (home + links + current). */
function breadcrumbItemCount(showHome: boolean, links: string[]): number {
  return (showHome ? 1 : 0) + links.length + 1;
}

function shouldCollapseTrail(showHome: boolean, links: string[]): boolean {
  return breadcrumbItemCount(showHome, links) > ELLIPSIS_ITEM_THRESHOLD;
}

function buildSegments(opts: {
  showHome: boolean;
  linkCount: BreadcrumbLinkCount;
  linkLabels: string[];
  currentLabel: string;
}): BreadcrumbSegment[] {
  const { showHome, linkCount, linkLabels, currentLabel } = opts;
  const links = activeLinkLabels(linkCount, linkLabels);
  const collapse = shouldCollapseTrail(showHome, links);
  const segments: BreadcrumbSegment[] = [];

  if (showHome) segments.push({ kind: "home" });

  if (!collapse) {
    links.forEach((label) => segments.push({ kind: "link", label }));
  } else {
    if (links.length > 0) {
      segments.push({ kind: "link", label: links[0] });
    }
    segments.push({ kind: "ellipsis" });
  }

  segments.push({ kind: "current", label: currentLabel });
  return segments;
}

function BreadcrumbSeparator() {
  return (
    <span className={styles.separator} aria-hidden>
      /
    </span>
  );
}

export function BreadcrumbTrail({
  breakpoint,
  segments,
  interactive = false,
  onHomeClick,
}: {
  breakpoint: BreadcrumbBreakpoint;
  segments: BreadcrumbSegment[];
  interactive?: boolean;
  onHomeClick?: () => void;
}) {
  if (segments.length === 0) return null;

  return (
    <nav
      className={styles.trail}
      aria-label="Breadcrumb"
      data-breakpoint={breakpoint}
    >
      <ol className={styles.list}>
        {segments.flatMap((segment, index) => {
          const items: ReactNode[] = [];
          if (index > 0) {
            items.push(
              <li
                key={`sep-${index}`}
                className={styles.listSep}
                aria-hidden
              >
                <BreadcrumbSeparator />
              </li>,
            );
          }
          items.push(
            <li key={`${segment.kind}-${index}`} className={styles.listItem}>
              {segment.kind === "home" ? (
                interactive ? (
                  <button
                    type="button"
                    className={styles.homeBtn}
                    aria-label="Home"
                    onClick={onHomeClick}
                  >
                    <span
                      className={`material-symbols-rounded ${styles.homeIcon}`}
                      aria-hidden
                    >
                      home
                    </span>
                  </button>
                ) : (
                  <span className={styles.homeBtn} aria-hidden>
                    <span
                      className={`material-symbols-rounded ${styles.homeIcon}`}
                    >
                      home
                    </span>
                  </span>
                )
              ) : null}
              {segment.kind === "link" ? (
                interactive ? (
                  <button type="button" className={styles.link}>
                    {segment.label}
                  </button>
                ) : (
                  <span className={styles.link} style={{ cursor: "default" }}>
                    {segment.label}
                  </span>
                )
              ) : null}
              {segment.kind === "ellipsis" ? (
                <span className={styles.ellipsis} aria-hidden>
                  ...
                </span>
              ) : null}
              {segment.kind === "current" ? (
                <span className={styles.current} aria-current="page">
                  {segment.label}
                </span>
              ) : null}
            </li>,
          );
          return items;
        })}
      </ol>
    </nav>
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

function buildBreadcrumbSnippet(opts: {
  breakpoint: BreadcrumbBreakpoint;
  segments: BreadcrumbSegment[];
  linkHex: string;
  currentHex: string;
}): { html: string; css: string } {
  const { breakpoint, segments, linkHex, currentHex } = opts;

  const parts: string[] = [];
  segments.forEach((segment, index) => {
    if (index > 0) {
      parts.push('  <span class="ds-breadcrumb__sep" aria-hidden>/</span>');
    }
    if (segment.kind === "home") {
      parts.push(
        '  <a class="ds-breadcrumb__home" href="/" aria-label="Home"><span class="material-symbols-rounded">home</span></a>',
      );
    } else if (segment.kind === "link") {
      parts.push(`  <a class="ds-breadcrumb__link" href="#">${segment.label}</a>`);
    } else if (segment.kind === "ellipsis") {
      parts.push('  <span class="ds-breadcrumb__ellipsis" aria-hidden>...</span>');
    } else if (segment.kind === "current") {
      parts.push(
        `  <span class="ds-breadcrumb__current" aria-current="page">${segment.label}</span>`,
      );
    }
  });
  const css = `/* Breadcrumbs — Figma 981:286037 */
.ds-breadcrumb {
  --ds-bc-link: ${linkHex};
  --ds-bc-current: ${currentHex};
  display: flex;
  align-items: center;
  gap: ${breakpoint === "mobile" ? "8px" : "12px"};
  flex-wrap: wrap;
  font-family: var(--ds-typography-font-family);
}

.ds-breadcrumb__slot {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.ds-breadcrumb__link {
  font-size: 14px;
  line-height: 20px;
  color: var(--ds-bc-link);
  text-decoration: none;
}

.ds-breadcrumb__current {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--ds-bc-current);
}

.ds-breadcrumb__sep {
  width: 20px;
  text-align: center;
  color: var(--ds-bc-link);
  font-size: 14px;
}`;

  return {
    html: `<nav class="ds-breadcrumb" aria-label="Breadcrumb">\n${parts.join("\n")}\n</nav>`,
    css,
  };
}

export function BreadcrumbsView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [breakpoint, setBreakpoint] = useState<BreadcrumbBreakpoint>("desktop");
  const [showHome, setShowHome] = useState(true);
  const [linkCount, setLinkCount] = useState<BreadcrumbLinkCount>(3);
  const [linkLabels, setLinkLabels] = useState(DEFAULT_LINK_LABELS);
  const [currentLabel, setCurrentLabel] = useState("Team");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => breadcrumbThemeVars(mode), [mode]);

  const visibleLinkLabels = linkLabels.slice(0, linkCount);
  const activeLinks = useMemo(
    () => activeLinkLabels(linkCount, linkLabels),
    [linkCount, linkLabels],
  );
  const collapseTrail = shouldCollapseTrail(showHome, activeLinks);

  const segments = useMemo(
    () =>
      buildSegments({
        showHome,
        linkCount,
        linkLabels,
        currentLabel,
      }),
    [showHome, linkCount, linkLabels, currentLabel],
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

  const codeSnippet = useMemo(
    () =>
      buildBreadcrumbSnippet({
        breakpoint,
        segments,
        linkHex: stateColors[0].hex,
        currentHex: stateColors[2].hex,
      }),
    [breakpoint, segments, stateColors],
  );

  return (
    <div
      className={`${styles.root} flex gap-8`}
      style={themeVars}
      data-breakpoint={breakpoint}
    >
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Breadcrumbs (Figma 981:286037): trail con icono{" "}
          <span className="material-symbols-rounded text-[length:inherit] align-middle text-base">
            home
          </span>
          , separador <strong>/</strong>, enlaces intermedios y página actual en{" "}
          <strong>text-primary-brand</strong>. El elipsis (<strong>…</strong>)
          solo aparece si el trail supera 5 ítems (home + links + current).
          Variantes Desktop (gap 12px) y Mobile (gap 8px).
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
              <BreadcrumbTrail
                breakpoint={breakpoint}
                segments={segments}
                interactive
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Outer gap"
                value="var(--ds-bc-gap-outer) · 12px desktop / 8px mobile"
              />
              <SpecRow label="Inner gap" value="var(--ds-bc-gap-inner)" />
              <SpecRow label="Icon / sep size" value="20px" />
              <SpecRow label="Divider" value="Slash (/) " />
              <SpecRow label="Breakpoint" value={BREAKPOINT_LABELS[breakpoint]} />
              <SpecRow label="Intermediate links" value={String(linkCount)} />
              <SpecRow
                label="Ellipsis"
                value={
                  collapseTrail
                    ? "visible (> 5 items)"
                    : "hidden (≤ 5 items)"
                }
              />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Link" value="14px / 400 / 20px lh" />
              <SpecRow label="Current" value="14px / 500 / 20px lh" />
              <SpecRow label="Ellipsis" value="14px / 500 / 20px lh" />
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
            <h3 className={shell.specHeading}>Breakpoints</h3>
            <div className={styles.variantGallery}>
              {(["desktop", "mobile"] as BreadcrumbBreakpoint[]).map((bp) => (
                <div key={bp} className={styles.variantRow}>
                  <span className={styles.variantLabel}>
                    {BREAKPOINT_LABELS[bp]}
                  </span>
                  <BreadcrumbTrail
                    breakpoint={bp}
                    segments={buildSegments({
                      showHome: true,
                      linkCount: 4,
                      linkLabels: DEFAULT_LINK_LABELS,
                      currentLabel: "Team",
                    })}
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
            <p className={shell.panelHint}>
              Breakpoint, segmentos y etiquetas del trail
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Breakpoint"
            value={breakpoint}
            options={(
              ["desktop", "mobile"] as BreadcrumbBreakpoint[]
            ).map((bp) => ({
              value: bp,
              label: BREAKPOINT_LABELS[bp],
            }))}
            onChange={(v) => setBreakpoint(v as BreadcrumbBreakpoint)}
          />

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Home icon</span>
              <Switch
                checked={showHome}
                onCheckedChange={setShowHome}
                aria-label="Mostrar icono home"
                style={showHome ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <SegmentedControl
            label="Links"
            value={String(linkCount)}
            options={(["2", "3", "4", "5", "6", "7"] as const).map((n) => ({
              value: n,
              label: n,
            }))}
            onChange={(v) => setLinkCount(Number(v) as BreadcrumbLinkCount)}
          />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Link labels
            </label>
            <div className="space-y-2">
              {visibleLinkLabels.map((lbl, i) => (
                <input
                  key={i}
                  type="text"
                  value={lbl}
                  onChange={(e) => {
                    const next = [...linkLabels];
                    next[i] = e.target.value;
                    setLinkLabels(next);
                  }}
                  className={shell.panelInput}
                  placeholder={`Link ${i + 1}`}
                  aria-label={`Link ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              Current page
            </label>
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => setCurrentLabel(e.target.value)}
              className={shell.panelInput}
              placeholder="Team"
            />
          </div>

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Tokens (resolved)
            </label>
            <div className={shell.configBox}>
              {stateColors.map((sc) => (
                <div key={sc.jsonPath} className={shell.configRow}>
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
                <span className={shell.configKey}>Trail</span>
                <span className={shell.configVal}>
                  {segments
                    .map((s) => {
                      if (s.kind === "home") return "Home";
                      if (s.kind === "ellipsis") return "…";
                      if (s.kind === "link") return s.label;
                      return s.label;
                    })
                    .join(" / ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Breadcrumbs — ${BREAKPOINT_LABELS[breakpoint]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
