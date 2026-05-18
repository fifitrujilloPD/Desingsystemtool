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
  DatePickerMenu,
  DATE_PICKER_MENU_INPUT_MASK,
  yearAnchorFor,
  type DatePickerCalendarView,
  type DatePickerMenuBreakpoint,
  type DatePickerMenuType,
} from "./date-picker-menu";
import shell from "./radio-button.module.css";
import styles from "./date-picker-menu.module.css";

const COLOR_DEFS = [
  {
    label: "Surface",
    cssVar: "--ds-dpm-surface",
    jsonPath: "Background.bg-container",
    resolve: (m: "light" | "dark") =>
      resolveJsonBackgroundColor("bg-container", m),
  },
  {
    label: "Border",
    cssVar: "--ds-color-border-default",
    jsonPath: "Border color.border-primary",
    resolve: (m: "light" | "dark") =>
      resolveJsonBorderColor("border-primary", m),
  },
  {
    label: "Selected day",
    cssVar: "--ds-cal-cell-selected-bg",
    jsonPath: "Button color.button-color",
    resolve: (m: "light" | "dark") =>
      resolveJsonButtonColor("button-color", m),
  },
  {
    label: "Month label",
    cssVar: "--ds-color-control-ink-muted",
    jsonPath: "Text colors.text-secondary",
    resolve: (m: "light" | "dark") =>
      resolveJsonTextColor("text-secondary", m),
  },
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

function buildMenuSnippet(): { html: string; css: string } {
  return {
    html: `<div class="ds-date-picker-menu" role="dialog" aria-label="Date picker menu">
  <div class="ds-date-picker-menu__header">…</div>
  <div class="ds-date-picker-menu__inputs"><!-- Input + Button atoms --></div>
  <div class="ds-date-picker-menu__grid" role="grid"><!-- Calendar cells --></div>
  <footer class="ds-date-picker-menu__footer"><!-- Cancelar / Aplicar --></footer>
</div>`,
    css: `/* Date picker menu — Figma 981:283052 */
.ds-date-picker-menu {
  border-radius: 12px;
  border: 1px solid var(--ds-color-border-default);
  background: var(--ds-color-surface-container);
  box-shadow: var(--ds-dpm-shadow, 0 20px 24px -4px rgba(16, 24, 40, 0.08));
  font-family: var(--ds-typography-font-family);
}`,
  };
}

const TYPE_OPTIONS = [
  { value: "single", label: "Single date" },
  { value: "dual", label: "Dual dates" },
] as const;

const BREAKPOINT_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
] as const;

const CALENDAR_VIEW_OPTIONS = [
  { value: "days", label: "Días" },
  { value: "months", label: "Meses" },
  { value: "years", label: "Años" },
] as const;

export function DatePickerMenuView() {
  const { contentPaddingClass } = useControlsPanel();
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const [menuType, setMenuType] = useState<DatePickerMenuType>("single");
  const [breakpoint, setBreakpoint] =
    useState<DatePickerMenuBreakpoint>("desktop");
  const [showPresetRanges, setShowPresetRanges] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [calendarView, setCalendarView] =
    useState<DatePickerCalendarView>("days");
  const [viewMonth, setViewMonth] = useState(1);
  const [viewYear, setViewYear] = useState(2024);
  const [yearAnchor, setYearAnchor] = useState(() => yearAnchorFor(2024));
  const [selectedDay, setSelectedDay] = useState(12);
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

  const codeSnippet = useMemo(() => buildMenuSnippet(), []);

  return (
    <div className={`${styles.root} flex gap-8`}>
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Molécula <strong>Date picker menu</strong> (Figma 981:283052). Compone
          átomos <strong>Input</strong> (<code>CatalogInput</code>, máscara{" "}
          <code>{DATE_PICKER_MENU_INPUT_MASK}</code>), <strong>Button</strong> y{" "}
          <strong>Calendar cell</strong>. Navegación en tres vistas: días, meses
          (clic en el encabezado del mes) y años (clic en el año). Flechas cambian
          mes, año o bloque de 12 años según la vista activa.
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
                <DatePickerMenu
                  menuType={menuType}
                  breakpoint={breakpoint}
                  showPresetRanges={showPresetRanges}
                  showActions={showActions}
                  calendarView={calendarView}
                  onCalendarViewChange={setCalendarView}
                  viewMonth={viewMonth}
                  viewYear={viewYear}
                  onViewMonthChange={setViewMonth}
                  onViewYearChange={setViewYear}
                  yearAnchor={yearAnchor}
                  onYearAnchorChange={setYearAnchor}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Composition</h3>
            <div className={shell.specDivider}>
              <SpecRow label="Input atom" value="CatalogInput → inputs.module.css" />
              <SpecRow label="Button atom" value="CatalogButton → buttons.module.css" />
              <SpecRow
                label="«Hoy»"
                value="md · Outlined · Gray · Enabled (sin icono)"
              />
              <SpecRow
                label="Footer"
                value="md · Outlined Blue / Primary Blue"
              />
              <SpecRow
                label="Calendar cell"
                value="CalendarCellPreview → calendar-cell.module.css"
              />
              <SpecRow label="Panel width" value="328px (calendar column)" />
              <SpecRow label="Radius" value="12px (--radius-xl)" />
            </div>
          </div>

          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Typography</h3>
            <div className={shell.specDivider}>
              <SpecRow
                label="Month"
                value="var(--ds-typography-body-md-font-size) / 500"
              />
              <SpecRow
                label="Input (fecha)"
                value={`Máscara ${DATE_PICKER_MENU_INPUT_MASK} · DD/MM/AA`}
              />
              <SpecRow label="Cell day" value="14px / 20px lh" />
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
            <p className={shell.panelHint}>Variantes Figma 981:283052</p>
          </div>

          <div className={shell.panelDivider} />

          <SegmentedControl
            label="Type"
            value={menuType}
            options={[...TYPE_OPTIONS]}
            onChange={(v) => setMenuType(v as DatePickerMenuType)}
          />

          <SegmentedControl
            label="Breakpoint"
            value={breakpoint}
            options={[...BREAKPOINT_OPTIONS]}
            onChange={(v) =>
              setBreakpoint(v as DatePickerMenuBreakpoint)
            }
          />

          <SegmentedControl
            label="Vista calendario"
            value={calendarView}
            options={[...CALENDAR_VIEW_OPTIONS]}
            onChange={(v) => {
              const next = v as DatePickerCalendarView;
              if (next === "years") {
                setYearAnchor(yearAnchorFor(viewYear));
              }
              setCalendarView(next);
            }}
          />

          <label className="flex items-center justify-between gap-4">
            <span className={shell.panelLabel}>Pre-set ranges</span>
            <Switch
              checked={showPresetRanges}
              onCheckedChange={setShowPresetRanges}
              aria-label="Rangos predefinidos"
              style={showPresetRanges ? switchOnStyle : undefined}
            />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className={shell.panelLabel}>Actions (footer)</span>
            <Switch
              checked={showActions}
              onCheckedChange={setShowActions}
              aria-label="Acciones inferior"
              style={showActions ? switchOnStyle : undefined}
            />
          </label>

          <ControlSelect
            label="Mes visible"
            value={String(viewMonth)}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              label: String(i + 1),
            }))}
            onChange={(v) => setViewMonth(Number(v))}
          />

          <ControlSelect
            label="Año visible"
            value={String(viewYear)}
            options={Array.from({ length: 11 }, (_, i) => ({
              value: String(2020 + i),
              label: String(2020 + i),
            }))}
            onChange={(v) => {
              const y = Number(v);
              setViewYear(y);
              setYearAnchor(yearAnchorFor(y));
            }}
          />

          <ControlSelect
            label="Selected day"
            value={String(selectedDay)}
            options={Array.from({ length: 31 }, (_, i) => ({
              value: String(i + 1),
              label: String(i + 1),
            }))}
            onChange={(v) => setSelectedDay(Number(v))}
          />

          <div className={shell.panelDivider} />

          <div>
            <label className={`${shell.panelLabel} block mb-2`}>
              Current Config
            </label>
            <div className={shell.configBox}>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Type</span>
                <span className={shell.configVal}>
                  {menuType === "single" ? "Single date" : "Dual dates"}
                </span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Breakpoint</span>
                <span className={shell.configVal}>{breakpoint}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Calendar</span>
                <span className={shell.configVal}>{calendarView}</span>
              </div>
              <div className={shell.configRow}>
                <span className={shell.configKey}>Selected</span>
                <span className={shell.configVal}>{selectedDay}</span>
              </div>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>

      {showCodeModal ? (
        <CodeModal
          onClose={() => setShowCodeModal(false)}
          title="Date picker menu"
          html={codeSnippet.html}
          css={codeSnippet.css}
        />
      ) : null}
    </div>
  );
}
