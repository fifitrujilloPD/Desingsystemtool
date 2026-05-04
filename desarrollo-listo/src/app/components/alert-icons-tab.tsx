import { useMemo } from "react";
import { useTheme } from "./theme-provider";
import { resolveJsonColor } from "../utils/token-parser";

/**
 * Foundations / Icons → Alert (Feature 03 / task_08).
 * Fuente Figma: frame `node-id=556:147108` (Design system / Icons Alert).
 *
 * Tres estados (info / success / error) × dos contenedores
 * (circle = ring del color del estado, badge = card neutral con borde por defecto).
 *
 * Mapeo de variables (todas ya existentes en el sistema, sin tokens nuevos):
 * - icono             → JSON `Text colors.text-{success|error|blue}`        + `var(--ds-color-{success|error|info})` semántico.
 * - circle border     → JSON `Border color.border-{success|error|blue}`.
 * - badge background  → `var(--ds-color-surface-elevated)` (= `--card` en `theme.css`).
 * - badge border      → `var(--ds-color-border-default)` (= `--border` en `theme.css`).
 */

export const ALERT_ICON_SIZES = [16, 20, 24] as const;
export type AlertIconSize = (typeof ALERT_ICON_SIZES)[number];

export type AlertState = "info" | "success" | "error";
export type AlertVariant = "circle" | "badge";

export interface AlertSelection {
  state: AlertState;
  variant: AlertVariant;
}

interface AlertDef {
  state: AlertState;
  label: string;
  /** Material Symbols Rounded glyph usado en el frame Figma. */
  materialIcon: "info" | "check_circle" | "error";
  /** Token JSON Figma para el color del icono. */
  iconJsonToken: string;
  /** Token JSON Figma para el color del borde del circle. */
  borderJsonToken: string;
  /** Variable semántica del DS equivalente al color del icono. */
  iconCssVar: string;
}

const ALERT_DEFS: AlertDef[] = [
  {
    state: "info",
    label: "Info",
    materialIcon: "info",
    iconJsonToken: "text-blue",
    borderJsonToken: "border-blue",
    iconCssVar: "--ds-color-info",
  },
  {
    state: "success",
    label: "Success",
    materialIcon: "check_circle",
    iconJsonToken: "text-success",
    borderJsonToken: "border-success",
    iconCssVar: "--ds-color-success",
  },
  {
    state: "error",
    label: "Error",
    materialIcon: "error",
    iconJsonToken: "text-error",
    borderJsonToken: "border-error",
    iconCssVar: "--ds-color-error",
  },
];

const VARIANTS: { id: AlertVariant; label: string }[] = [
  { id: "circle", label: "Circle" },
  { id: "badge", label: "Badge" },
];

export interface ResolvedAlert extends AlertDef {
  iconHex: string;
  borderHex: string;
}

export function useResolvedAlerts(): ResolvedAlert[] {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";
  return useMemo(
    () =>
      ALERT_DEFS.map((d) => ({
        ...d,
        iconHex: resolveJsonColor("Text colors", d.iconJsonToken, mode),
        borderHex: resolveJsonColor("Border color", d.borderJsonToken, mode),
      })),
    [mode],
  );
}

export function AlertIcon({
  alert,
  variant,
  size,
}: {
  alert: ResolvedAlert;
  variant: AlertVariant;
  size: AlertIconSize;
}) {
  const wrapperStyle: React.CSSProperties =
    variant === "circle"
      ? {
          padding: 6,
          borderRadius: 100,
          border: `1px solid ${alert.borderHex}`,
        }
      : {
          padding: 8,
          borderRadius: 8,
          border: "1px solid var(--ds-color-border-default)",
          backgroundColor: "var(--ds-color-surface-elevated)",
        };

  return (
    <div
      className="inline-flex items-center justify-center"
      style={wrapperStyle}
      data-state={alert.state}
      data-variant={variant}
    >
      <span
        className="material-symbols-rounded"
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          color: alert.iconHex,
          fontVariationSettings:
            "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
        }}
        aria-hidden
      >
        {alert.materialIcon}
      </span>
    </div>
  );
}

export function buildAlertSnippet(
  alert: ResolvedAlert,
  variant: AlertVariant,
  size: AlertIconSize,
) {
  const html =
    variant === "circle"
      ? `<span class="alert-icon alert-icon--${alert.state} alert-icon--circle">\n  <span class="material-symbols-rounded">${alert.materialIcon}</span>\n</span>`
      : `<span class="alert-icon alert-icon--${alert.state} alert-icon--badge">\n  <span class="material-symbols-rounded">${alert.materialIcon}</span>\n</span>`;

  const containerCss =
    variant === "circle"
      ? `/* Circle: borde del color del estado, padding 6px */
.alert-icon--${alert.state}.alert-icon--circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 100px;
  border: 1px solid /* JSON Figma: Border color.${alert.borderJsonToken} */ ${alert.borderHex};
}`
      : `/* Badge: card neutro con borde por defecto del DS */
.alert-icon--${alert.state}.alert-icon--badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  background: var(--ds-color-surface-elevated);
  border: 1px solid var(--ds-color-border-default);
}`;

  const css = `${containerCss}

.alert-icon--${alert.state} .material-symbols-rounded {
  font-size: ${size}px;
  /* Equivalente semántico DS: var(${alert.iconCssVar}) */
  color: /* JSON Figma: Text colors.${alert.iconJsonToken} */ ${alert.iconHex};
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}`;

  return { html, css };
}

interface AlertIconsTabProps {
  size: AlertIconSize;
  selected: AlertSelection | null;
  onSelect: (s: AlertSelection | null) => void;
}

export function AlertIconsTab({ size, selected, onSelect }: AlertIconsTabProps) {
  const alerts = useResolvedAlerts();

  return (
    <div className="space-y-6 max-w-[720px]">
      {alerts.map((alert) => (
        <div key={alert.state} className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {alert.label}
            </h3>
            <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500">
              var({alert.iconCssVar}) · JSON {alert.iconJsonToken}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {VARIANTS.map((v) => {
              const isSelected =
                selected?.state === alert.state && selected.variant === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() =>
                    onSelect(
                      isSelected ? null : { state: alert.state, variant: v.id },
                    )
                  }
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  title={`${alert.label} · ${v.label} · ${size}px`}
                >
                  <div className="flex items-center justify-center w-12 h-12 shrink-0">
                    <AlertIcon alert={alert} variant={v.id} size={size} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {v.label}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                      {size}px ·{" "}
                      {v.id === "circle"
                        ? alert.borderJsonToken
                        : "border-default"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
