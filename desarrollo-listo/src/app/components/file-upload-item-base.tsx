import { useMemo } from "react";
import { BarProgressPreview, barThemeVars } from "./bar-progress-view";
import { CircleProgressRing, circleThemeVars } from "./circle-progress-view";
import { CheckboxPreview } from "./checkbox-view";
import { FileIcon } from "./file-icons-tab";
import { EXTENSION_BRAND_HEX } from "../data/file-icons-catalog";
import { useTheme } from "./theme-provider";
import {
  resolveJsonBackgroundColor,
  resolveJsonBorderColor,
  resolveJsonButtonColor,
  resolveJsonTextColor,
} from "../utils/token-parser";
import barStyles from "./bar-progress.module.css";
import circleStyles from "./circle-progress.module.css";
import checkboxStyles from "./checkbox.module.css";
import styles from "./file-upload-item-base.module.css";

export type FileUploadItemProgressType = "bar" | "fill";
export type FileUploadItemIconType = "file-type" | "simple";
export type FileUploadItemState = "in-progress" | "complete" | "error";
export type FileUploadItemLocale = "es" | "en";

const COPY = {
  es: {
    uploaded: (pct: number) => `${pct}% subido`,
    uploadedFull: "100% subido",
    error: "Subida fallida, por favor intente de nuevo",
    retry: "Intente de nuevo",
    delete: "Eliminar archivo",
    complete: "Archivo subido",
  },
  en: {
    uploaded: (pct: number) => `${pct}% uploaded`,
    uploadedFull: "100% uploaded",
    error: "Upload failed, please try again",
    retry: "Try again",
    delete: "Remove file",
    complete: "File uploaded",
  },
} as const;

export function fileUploadItemThemeVars(
  mode: "light" | "dark",
): React.CSSProperties {
  return {
    ["--ds-fui-surface" as string]: resolveJsonBackgroundColor(
      "bg-container",
      mode,
    ),
    ["--ds-fui-border" as string]: resolveJsonBorderColor(
      "border-primary",
      mode,
    ),
    ["--ds-fui-error-border" as string]: resolveJsonBorderColor(
      "border-error",
      mode,
    ),
    ["--ds-fui-error-text" as string]: resolveJsonTextColor("text-error", mode),
    ["--ds-fui-title" as string]: resolveJsonTextColor("text-primary", mode),
    ["--ds-fui-meta" as string]: resolveJsonTextColor("text-secondary", mode),
    ["--ds-fui-link" as string]: resolveJsonTextColor(
      "text-primary-brand",
      mode,
    ),
    ["--ds-fui-fill-bg" as string]: resolveJsonBackgroundColor(
      "bg-brand-ships",
      mode,
    ),
    ["--ds-fui-hover" as string]: resolveJsonBackgroundColor(
      "bg-primary",
      mode,
    ),
    ["--ds-fui-success-bg" as string]: resolveJsonButtonColor(
      "button-color",
      mode,
    ),
    ["--ds-fui-success-fg" as string]: resolveJsonTextColor(
      "text-primary-white",
      mode,
    ),
    ["--ds-fui-action-icon" as string]: resolveJsonTextColor(
      "text-secondary",
      mode,
    ),
  };
}

function formatSize(kb: number): string {
  return `${kb} KB`;
}

export function FileUploadItemBase({
  progressType = "bar",
  iconType = "file-type",
  state = "in-progress",
  fileName = "Tech design requirements.pdf",
  fileSizeKb = 200,
  progress = 40,
  showCheckbox = false,
  checkboxSelected = false,
  locale = "es",
  className,
}: {
  progressType?: FileUploadItemProgressType;
  iconType?: FileUploadItemIconType;
  state?: FileUploadItemState;
  fileName?: string;
  fileSizeKb?: number;
  progress?: number;
  showCheckbox?: boolean;
  checkboxSelected?: boolean;
  locale?: FileUploadItemLocale;
  className?: string;
}) {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";
  const copy = COPY[locale];
  const clamped = Math.min(100, Math.max(0, progress));

  const themeVars = useMemo(() => {
    const bar = barThemeVars({ mode, previewWidth: "100%" });
    const circle = circleThemeVars(mode);
    const item = fileUploadItemThemeVars(mode);
    return { ...bar, ...circle, ...item };
  }, [mode]);

  const extension = fileName.split(".").pop()?.toUpperCase() ?? "PDF";
  const brandHex =
    EXTENSION_BRAND_HEX[extension as keyof typeof EXTENSION_BRAND_HEX] ??
    EXTENSION_BRAND_HEX.PDF;

  const metaInProgress =
    progressType === "fill"
      ? `${formatSize(fileSizeKb)} — ${copy.uploaded(clamped)}`
      : formatSize(fileSizeKb);

  const metaComplete =
    progressType === "fill"
      ? `${formatSize(fileSizeKb)} — ${copy.uploadedFull}`
      : formatSize(fileSizeKb);

  const fillWidth = state === "complete" ? 100 : clamped;

  return (
    <div
      className={`${styles.root} ${barStyles.root} ${circleStyles.root} ${checkboxStyles.root} ${className ?? ""}`}
      style={themeVars}
    >
      <article
        className={styles.item}
        data-progress-type={progressType}
        data-state={state}
        aria-label={fileName}
      >
        <div className={styles.row}>
          {showCheckbox ? (
            <div className={styles.checkboxSlot}>
              <CheckboxPreview
                checkboxState="Enabled"
                checkboxType={checkboxSelected ? "Selected" : "Unselected"}
                labelText=""
              />
            </div>
          ) : null}

          <div className={styles.iconSlot}>
            {iconType === "file-type" ? (
              <FileIcon
                variant="solid"
                fileType={extension === "PDF" ? "PDF" : "DOC"}
                brandHex={brandHex}
                size={40}
              />
            ) : (
              <FileIcon
                variant="iconOutline"
                fileType="Documents"
                glyph="draft"
                size={40}
              />
            )}
          </div>

          {progressType === "fill" ? (
            <div className={styles.fillBody}>
              <div className={styles.textCol}>
                <p className={styles.fileName}>{fileName}</p>
                {state === "error" ? (
                  <>
                    <p className={styles.errorText}>{copy.error}</p>
                    <button type="button" className={styles.retryBtn}>
                      {copy.retry}
                    </button>
                  </>
                ) : (
                  <div className={styles.metaRow}>
                    <span>
                      {state === "complete" ? metaComplete : metaInProgress}
                    </span>
                  </div>
                )}
              </div>
              {state === "in-progress" ? (
                <div
                  className={styles.fillPane}
                  style={{ width: `${Math.max(fillWidth, 18)}%` }}
                  aria-hidden
                >
                  <CircleProgressRing size="sm" animate />
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.body}>
              <p className={styles.fileName}>{fileName}</p>
              {state === "error" ? (
                <>
                  <p className={styles.errorText}>{copy.error}</p>
                  <button type="button" className={styles.retryBtn}>
                    {copy.retry}
                  </button>
                </>
              ) : (
                <div className={styles.metaRow}>
                  <span>
                    {state === "complete" ? metaComplete : metaInProgress}
                  </span>
                  {state === "in-progress" ? (
                    <>
                      <span className={styles.metaSep} aria-hidden>
                        ·
                      </span>
                      <span>{clamped}%</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {progressType === "bar" && state !== "error" ? (
          <div className={styles.progressSlot}>
            <BarProgressPreview
              style="none"
              value={state === "complete" ? 100 : clamped}
            />
          </div>
        ) : null}

        <div className={styles.actionTop}>
          {state === "complete" ? (
            <div
              className={styles.successBadge}
              role="img"
              aria-label={copy.complete}
            >
              <span
                className={`material-symbols-rounded ${styles.iconBtnSymbol}`}
                aria-hidden
              >
                check
              </span>
            </div>
          ) : (
            <button
              type="button"
              className={styles.iconBtn}
              data-tone={state === "error" ? "error" : "default"}
              aria-label={copy.delete}
            >
              <span
                className={`material-symbols-rounded ${styles.iconBtnSymbol}`}
                aria-hidden
              >
                delete
              </span>
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
