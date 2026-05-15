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
import styles from "./table-item.module.css";

/** Figma: Primary | secondary */
type TableItemType = "primary" | "secondary";

const TYPE_LABELS: Record<TableItemType, string> = {
  primary: "Primary",
  secondary: "Secondary",
};

const DEFAULT_TITLE = "Asignatura";
const DEFAULT_DESCRIPTION = "cristhian.amortegui@utp.edu.co";
const DEFAULT_ICON = "folder";

const COLOR_DEFS = [
  {
    label: "Title (Primary)",
    cssVar: "--ds-table-item-title-primary",
    jsonPath: "Text colors.text-primary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-primary", mode),
  },
  {
    label: "Title (Secondary)",
    cssVar: "--ds-table-item-title-secondary",
    jsonPath: "Text colors.text-secondary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", mode),
  },
  {
    label: "Description",
    cssVar: "--ds-table-item-desc",
    jsonPath: "Text colors.text-tertiary",
    resolve: (mode: "light" | "dark") =>
      resolveJsonTextColor("text-tertiary", mode),
  },
  {
    label: "Icon",
    cssVar: "--ds-table-item-icon",
    jsonPath: "Button color.button-hover",
    resolve: (mode: "light" | "dark") =>
      resolveJsonButtonColor("button-hover", mode),
  },
  {
    label: "Background",
    cssVar: "--ds-table-item-bg",
    jsonPath: "Background.bg-container",
    resolve: (mode: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", mode),
  },
] as const;

function tableItemThemeVars(mode: "light" | "dark"): React.CSSProperties {
  return {
    ["--ds-table-item-title-primary" as string]: resolveJsonTextColor(
      "text-primary",
      mode,
    ),
    ["--ds-table-item-title-secondary" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
    ["--ds-table-item-desc" as string]: resolveJsonTextColor(
      "text-tertiary",
      mode,
    ),
    ["--ds-table-item-icon" as string]: resolveJsonButtonColor(
      "button-hover",
      mode,
    ),
    ["--ds-table-item-bg" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-color-control-ink-muted" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

export function TableItemPreview({
  type,
  title,
  description,
  showDescription,
  showDrop,
  showIcon = true,
  iconName = DEFAULT_ICON,
}: {
  type: TableItemType;
  title: string;
  description?: string;
  showDescription: boolean;
  showDrop: boolean;
  showIcon?: boolean;
  iconName?: string;
}) {
  const chevron = (
    <button type="button" className={styles.chevronBtn} aria-label="Expand row">
      <span className={`material-symbols-rounded ${styles.chevron}`}>
        keyboard_arrow_down
      </span>
    </button>
  );

  return (
    <div className={styles.item} data-type={type}>
      {type === "primary" && showDrop ? chevron : null}
      <div className={styles.content}>
        {showIcon ? (
          <span className={`material-symbols-rounded ${styles.materialIcon}`}>
            {iconName}
          </span>
        ) : null}
        <div className={styles.textBlock}>
          <span className={styles.title}>{title}</span>
          {showDescription && description ? (
            <span className={styles.description}>{description}</span>
          ) : null}
        </div>
      </div>
      {type === "secondary" && showDrop ? chevron : null}
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

function buildTableItemSnippet(opts: {
  type: TableItemType;
  title: string;
  description: string;
  showDescription: boolean;
  showDrop: boolean;
  showIcon: boolean;
  iconName: string;
  titleHex: string;
  iconHex: string;
}): { html: string; css: string } {
  const {
    type,
    title,
    description,
    showDescription,
    showDrop,
    showIcon,
    iconName,
    titleHex,
    iconHex,
  } = opts;

  const chevronHtml =
    showDrop && type === "primary"
      ? '  <button type="button" class="ds-table-item__chevron" aria-label="Expand"><span class="material-symbols-rounded">keyboard_arrow_down</span></button>\n'
      : "";
  const iconHtml = showIcon
    ? `  <span class="material-symbols-rounded ds-table-item__icon">${iconName}</span>\n`
    : "";
  const descHtml =
    showDescription && description
      ? `    <span class="ds-table-item__desc">${description}</span>\n`
      : "";
  const chevronEndHtml =
    showDrop && type === "secondary"
      ? '  <button type="button" class="ds-table-item__chevron" aria-label="Expand"><span class="material-symbols-rounded">keyboard_arrow_down</span></button>\n'
      : "";

  const css = `/* Table item — Figma 340:137006 */
.ds-table-item {
  --ds-table-item-title: ${titleHex};
  --ds-table-item-icon-color: ${iconHex};
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 367px;
  padding: 16px;
  background: var(--ds-table-item-bg, transparent);
  font-family: var(--ds-typography-font-family);
}

.ds-table-item[data-type="primary"] .ds-table-item__title {
  font-weight: 500;
}

.ds-table-item[data-type="secondary"] .ds-table-item__title {
  font-weight: 400;
}

.ds-table-item__title {
  font-size: 14px;
  line-height: 20px;
  color: var(--ds-table-item-title);
}

.ds-table-item__icon {
  font-size: 24px;
  color: var(--ds-table-item-icon-color);
}`;

  return {
    html: `<div class="ds-table-item" data-type="${type}">
${chevronHtml}  <div class="ds-table-item__content">
${iconHtml}    <div class="ds-table-item__text">
      <span class="ds-table-item__title">${title}</span>
${descHtml}    </div>
  </div>
${chevronEndHtml}</div>`,
    css,
  };
}

const GALLERY_ROWS: {
  label: string;
  type: TableItemType;
  showDescription: boolean;
  showDrop: boolean;
}[] = [
  { label: "Primary", type: "primary", showDescription: false, showDrop: false },
  {
    label: "Primary + description",
    type: "primary",
    showDescription: true,
    showDrop: false,
  },
  {
    label: "Primary + drop",
    type: "primary",
    showDescription: false,
    showDrop: true,
  },
  {
    label: "Secondary",
    type: "secondary",
    showDescription: false,
    showDrop: false,
  },
  {
    label: "Secondary + description",
    type: "secondary",
    showDescription: true,
    showDrop: false,
  },
  {
    label: "Secondary + drop",
    type: "secondary",
    showDescription: false,
    showDrop: true,
  },
];

export function TableItemView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [itemType, setItemType] = useState<TableItemType>("primary");
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [showDescription, setShowDescription] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [iconName, setIconName] = useState(DEFAULT_ICON);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

  const themeVars = useMemo(() => tableItemThemeVars(mode), [mode]);

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
      buildTableItemSnippet({
        type: itemType,
        title,
        description,
        showDescription,
        showDrop,
        showIcon,
        iconName,
        titleHex:
          itemType === "primary"
            ? stateColors[0].hex
            : stateColors[1].hex,
        iconHex: stateColors[3].hex,
      }),
    [
      itemType,
      title,
      description,
      showDescription,
      showDrop,
      showIcon,
      iconName,
      stateColors,
    ],
  );

  return (
    <div className={`${styles.root} flex gap-8`} style={themeVars}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Table item / Item tabla (Figma 340:137006): celda atómica con icono{" "}
          <span className="material-symbols-rounded text-[length:inherit] align-middle text-base">
            folder
          </span>
          , título Primary (medium) o Secondary (regular), descripción opcional
          y chevron <strong>keyboard_arrow_down</strong> (izq. en Primary, der.
          en Secondary).
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
              <TableItemPreview
                type={itemType}
                title={title}
                description={description}
                showDescription={showDescription}
                showDrop={showDrop}
                showIcon={showIcon}
                iconName={iconName}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Structure</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Width (Figma)" value="var(--ds-table-item-width)" />
              <SpecRow label="Padding" value="var(--ds-table-item-pad)" />
              <SpecRow label="Gap" value="var(--ds-table-item-gap)" />
              <SpecRow label="Icon size" value="24px" />
              <SpecRow label="Chevron size" value="20px" />
              <SpecRow label="Type" value={TYPE_LABELS[itemType]} />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Title Primary"
                value="14px / 500 / 20px lh"
              />
              <SpecRow
                label="Title Secondary"
                value="14px / 400 / 20px lh"
              />
              <SpecRow label="Description" value="14px / 400 / 20px lh" />
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
            <h3 className={shell.specHeading}>All variants</h3>
            <div className={styles.stateGrid}>
              {GALLERY_ROWS.map((row) => (
                <div key={row.label} className={styles.stateGridItem}>
                  <span className={styles.variantLabel}>{row.label}</span>
                  <TableItemPreview
                    type={row.type}
                    title={DEFAULT_TITLE}
                    description={DEFAULT_DESCRIPTION}
                    showDescription={row.showDescription}
                    showDrop={row.showDrop}
                    showIcon
                    iconName={DEFAULT_ICON}
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
              Type, título, descripción, drop e icono
            </p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Type"
            value={itemType}
            options={(
              ["primary", "secondary"] as TableItemType[]
            ).map((t) => ({
              value: t,
              label: TYPE_LABELS[t],
            }))}
            onChange={(v) => setItemType(v as TableItemType)}
          />

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

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Description</span>
              <Switch
                checked={showDescription}
                onCheckedChange={setShowDescription}
                aria-label="Mostrar descripción"
                style={showDescription ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Drop (chevron)</span>
              <Switch
                checked={showDrop}
                onCheckedChange={setShowDrop}
                aria-label="Mostrar chevron"
                style={showDrop ? switchOnStyle : undefined}
              />
            </label>
          </div>

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          {showDescription ? (
            <div>
              <label className={`${shell.panelLabel} block mb-1.5`}>
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={shell.panelInput}
              />
            </div>
          ) : null}

          {showIcon ? (
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
        </div>
      </ControlsPanelFrame>

      {showCodeModal && (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title={`Table item — ${TYPE_LABELS[itemType]}`}
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      )}
    </div>
  );
}
