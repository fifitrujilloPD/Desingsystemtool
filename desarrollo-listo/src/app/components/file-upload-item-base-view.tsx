import { useMemo, useState } from "react";
import { CodeXml } from "lucide-react";
import { ControlSelect, SegmentedControl } from "./design-system-controls";
import { Switch } from "./ui/switch";
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
import {
  FileUploadItemBase,
  type FileUploadItemIconType,
  type FileUploadItemLocale,
  type FileUploadItemProgressType,
  type FileUploadItemState,
} from "./file-upload-item-base";
import shell from "./radio-button.module.css";
import styles from "./file-upload-item-base.module.css";

const COLOR_DEFS = [
  {
    label: "Surface",
    cssVar: "--ds-fui-surface",
    jsonPath: "Background.bg-container",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", m),
  },
  {
    label: "Border",
    cssVar: "--ds-fui-border",
    jsonPath: "Border color.border-primary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", m),
  },
  {
    label: "Error border",
    cssVar: "--ds-fui-error-border",
    jsonPath: "Border color.border-error",
    resolve: (m: "light" | "dark") => resolveJsonBorderColor("border-error", m),
  },
  {
    label: "Progress fill",
    cssVar: "--ds-bar-fill-bg",
    jsonPath: "Button color.button-color",
    resolve: (m: "light" | "dark") =>
      resolveJsonButtonColor("button-color", m),
  },
  {
    label: "Meta text",
    cssVar: "--ds-fui-meta",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", m),
  },
] as const;

const PROGRESS_TYPE_OPTIONS = [
  { value: "bar", label: "Progress bar" },
  { value: "fill", label: "Progress fill" },
] as const;

const ICON_TYPE_OPTIONS = [
  { value: "file-type", label: "File type" },
  { value: "simple", label: "Simple" },
] as const;

const STATE_OPTIONS = [
  { value: "in-progress", label: "In progress" },
  { value: "complete", label: "Complete" },
  { value: "error", label: "Error" },
] as const;

const LOCALE_OPTIONS = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
] as const;

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

function buildSnippet(): { html: string; css: string } {
  return {
    html: `<article class="ds-file-upload-item" data-progress-type="bar" data-state="in-progress">
  <div class="ds-file-upload-item__row">
    <div class="ds-file-upload-item__icon"><!-- File icon --></div>
    <div class="ds-file-upload-item__body"><!-- name + meta --></div>
    <button type="button" aria-label="Eliminar"><!-- delete --></button>
  </div>
  <div class="ds-file-upload-item__progress"><!-- Bar progress atom --></div>
</article>`,
    css: `/* File upload item base — Figma 978:299288 */
.ds-file-upload-item {
  max-width: 512px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--ds-color-border-default);
  background: var(--ds-color-surface-container);
  font-family: var(--ds-typography-font-family);
}`,
  };
}

export function FileUploadItemBaseView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [progressType, setProgressType] =
    useState<FileUploadItemProgressType>("bar");
  const [iconType, setIconType] = useState<FileUploadItemIconType>("file-type");
  const [itemState, setItemState] = useState<FileUploadItemState>("in-progress");
  const [progress, setProgress] = useState(40);
  const [fileName, setFileName] = useState("Tech design requirements.pdf");
  const [fileSizeKb, setFileSizeKb] = useState(200);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxSelected, setCheckboxSelected] = useState(true);
  const [locale, setLocale] = useState<FileUploadItemLocale>("es");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const switchOnStyle = { backgroundColor: "var(--ds-color-brand)" } as const;

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

  const codeSnippet = useMemo(() => buildSnippet(), []);

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Molécula <strong>File upload item base</strong> (Figma 978:299288).
          Compone <strong>Bar progress</strong>, <strong>Circle progress</strong>,{" "}
          <strong>File icons</strong>, <strong>Checkbox</strong> (opcional) y
          acciones con iconos Material. No incluye la drop zone del átomo{" "}
          <code>/atoms/file-upload</code>.
        </p>

        <div className="mb-4">
          <div className={`${shell.previewCard} ${styles.previewCardFit}`}>
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
            <div className={`${shell.previewStage} ${styles.previewStageFit}`}>
              <div className={styles.previewWrap}>
                <FileUploadItemBase
                  progressType={progressType}
                  iconType={iconType}
                  state={itemState}
                  progress={progress}
                  fileName={fileName}
                  fileSizeKb={fileSizeKb}
                  showCheckbox={showCheckbox}
                  checkboxSelected={checkboxSelected}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Composition</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Bar progress"
                value="BarProgressPreview → bar-progress.module.css"
              />
              <SpecRow
                label="Circle progress"
                value="CircleProgressRing → circle-progress.module.css"
              />
              <SpecRow label="File icon" value="FileIcon (Foundations)" />
              <SpecRow label="Checkbox" value="CheckboxPreview (opcional)" />
              <SpecRow label="Item width" value="512px max" />
              <SpecRow label="Radius" value="12px" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="File name"
                value="var(--ds-typography-body-sm-font-size) / 500"
              />
              <SpecRow
                label="Meta / error"
                value="var(--ds-typography-body-sm-font-size) / 400"
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
            <p className={shell.panelHint}>Variantes Figma 978:299288</p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Progress type"
            value={progressType}
            options={[...PROGRESS_TYPE_OPTIONS]}
            onChange={(v) =>
              setProgressType(v as FileUploadItemProgressType)
            }
          />

          <SegmentedControl
            label="Icon type"
            value={iconType}
            options={[...ICON_TYPE_OPTIONS]}
            onChange={(v) => setIconType(v as FileUploadItemIconType)}
          />

          <SegmentedControl
            label="State"
            value={itemState}
            options={[...STATE_OPTIONS]}
            onChange={(v) => setItemState(v as FileUploadItemState)}
          />

          <SegmentedControl
            label="Locale"
            value={locale}
            options={[...LOCALE_OPTIONS]}
            onChange={(v) => setLocale(v as FileUploadItemLocale)}
          />

          <label className="flex items-center justify-between gap-4">
            <span className={shell.panelLabel}>Checkbox</span>
            <Switch
              checked={showCheckbox}
              onCheckedChange={setShowCheckbox}
              aria-label="Mostrar checkbox"
              style={showCheckbox ? switchOnStyle : undefined}
            />
          </label>

          {showCheckbox ? (
            <label className="flex items-center justify-between gap-4">
              <span className={shell.panelLabel}>Checkbox selected</span>
              <Switch
                checked={checkboxSelected}
                onCheckedChange={setCheckboxSelected}
                aria-label="Checkbox seleccionado"
                style={checkboxSelected ? switchOnStyle : undefined}
              />
            </label>
          ) : null}

          <div>
            <label className={`${shell.panelLabel} block mb-1.5`}>
              File name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={shell.panelInput}
            />
          </div>

          <ControlSelect
            label="Progress"
            value={String(progress)}
            options={[0, 10, 20, 40, 70, 100].map((n) => ({
              value: String(n),
              label: `${n}%`,
            }))}
            onChange={(v) => setProgress(Number(v))}
          />

          <ControlSelect
            label="File size (KB)"
            value={String(fileSizeKb)}
            options={[200, 512, 1024].map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            onChange={(v) => setFileSizeKb(Number(v))}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current Config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Type</span>
                <span className={shell.configVal}>{progressType}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>State</span>
                <span className={shell.configVal}>{itemState}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Progress</span>
                <span className={shell.configVal}>{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal ? (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title="File upload item base"
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      ) : null}
    </div>
  );
}
