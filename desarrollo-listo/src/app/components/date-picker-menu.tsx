import { useMemo } from "react";
import {
  CalendarCellPreview,
  calendarCellThemeVars,
} from "./calendar-cell-view";
import { CatalogButton, resolveButtonAppearance } from "./buttons-view";
import { CatalogInput } from "./inputs-view";
import { useTheme } from "./theme-provider";
import { resolveJsonBackgroundColor } from "../utils/token-parser";
import buttonStyles from "./buttons.module.css";
import calCellStyles from "./calendar-cell.module.css";
import inputStyles from "./inputs.module.css";
import styles from "./date-picker-menu.module.css";

/** Máscara del campo fecha (átomo Date picker: dd/mm/aa → menú 00/00/00). */
export const DATE_PICKER_MENU_INPUT_MASK = "00/00/00";

export function formatDatePickerMenuValue(
  day: number,
  month: number,
  year: number,
): string {
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const yy = String(year % 100).padStart(2, "0");
  return `${dd}/${mm}/${yy}`;
}

/** Props del átomo Input (Figma 2:8432) — valor tipo date picker. */
const MENU_INPUT_ATOM_PROPS = {
  inputType: "Label text" as const,
  inputState: "Default" as const,
  placeholderText: DATE_PICKER_MENU_INPUT_MASK,
  labelText: "",
  showIcon: false,
  iconName: "",
  helperText: "",
  showHelper: false,
  showRequired: false,
  numberPrefix: "+57",
};

/** Props compartidos del átomo Button (Figma 2:7813) — size md en todo el menú. */
const MENU_BUTTON_ATOM_PROPS = {
  buttonState: "Enabled" as const,
  size: "md" as const,
  showText: true,
  iconPosition: "none" as const,
  leftIcon: "",
  rightIcon: "",
} as const;

/** «Hoy» — Outlined · Gray · md (mismo átomo que `/atoms/buttons`). */
const MENU_TODAY_BUTTON_PROPS = {
  ...MENU_BUTTON_ATOM_PROPS,
  buttonStyle: "Outlined" as const,
  buttonColor: "Gray" as const,
  text: "Hoy",
} as const;

export type DatePickerMenuType = "single" | "dual";
export type DatePickerMenuBreakpoint = "desktop" | "mobile";
export type DatePickerCalendarView = "days" | "months" | "years";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"] as const;

const MONTH_NAMES_FULL = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

const MONTH_NAMES_SHORT = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

const PRESET_LABELS = [
  "Última semana",
  "Último mes",
  "Último año",
] as const;

type CalendarCellType = "inactive" | "today" | "active" | "selected";
type CalendarCellState = "default" | "hover" | "disabled";
type CalendarRangePosition = "none" | "start" | "middle" | "end" | "single";

interface GridCell {
  key: string;
  day: number | string;
  cellType: CalendarCellType;
  cellState: CalendarCellState;
  rangePosition: CalendarRangePosition;
  showDot: boolean;
  cellRole?: "day" | "weekday";
  interactive?: boolean;
}

export function getCalendarHeaderLabel(
  view: DatePickerCalendarView,
  viewMonth: number,
  viewYear: number,
  yearAnchor: number,
): string {
  if (view === "days") {
    const name = MONTH_NAMES_FULL[viewMonth - 1] ?? MONTH_NAMES_FULL[0];
    return `${name} ${viewYear}`;
  }
  if (view === "months") {
    return String(viewYear);
  }
  return `${yearAnchor} – ${yearAnchor + 11}`;
}

function shiftMonth(viewMonth: number, viewYear: number, delta: number) {
  let m = viewMonth + delta;
  let y = viewYear;
  while (m < 1) {
    m += 12;
    y -= 1;
  }
  while (m > 12) {
    m -= 12;
    y += 1;
  }
  return { month: m, year: y };
}

export function yearAnchorFor(viewYear: number) {
  return Math.floor(viewYear / 12) * 12;
}

function buildDaysGrid(selectedDay: number): GridCell[] {
  const headers: GridCell[] = WEEKDAYS.map((d) => ({
    key: `h-${d}`,
    day: d,
    cellType: "inactive",
    cellState: "default",
    rangePosition: "none",
    showDot: false,
    cellRole: "weekday",
  }));

  const days: GridCell[] = [];
  for (let d = 1; d <= 31; d++) {
    days.push({
      key: `d-${d}`,
      day: d,
      cellType: d === selectedDay ? "selected" : "inactive",
      cellState: "default",
      rangePosition: "none",
      showDot: d === 1 || d === 30,
      cellRole: "day",
      interactive: true,
    });
  }

  for (let d = 1; d <= 11; d++) {
    days.push({
      key: `next-${d}`,
      day: d,
      cellType: "inactive",
      cellState: "disabled",
      rangePosition: "none",
      showDot: d === 4,
      cellRole: "day",
    });
  }

  return [...headers, ...days];
}

function buildMonthsGrid(selectedMonth: number): GridCell[] {
  return MONTH_NAMES_SHORT.map((name, index) => {
    const month = index + 1;
    return {
      key: `m-${month}`,
      day: name,
      cellType: month === selectedMonth ? "selected" : "inactive",
      cellState: "default",
      rangePosition: "none",
      showDot: false,
      cellRole: "day",
      interactive: true,
    };
  });
}

function buildYearsGrid(yearAnchor: number, selectedYear: number): GridCell[] {
  return Array.from({ length: 12 }, (_, i) => {
    const year = yearAnchor + i;
    return {
      key: `y-${year}`,
      day: String(year),
      cellType: year === selectedYear ? "selected" : "inactive",
      cellState: "default",
      rangePosition: "none",
      showDot: false,
      cellRole: "day",
      interactive: true,
    };
  });
}

function CalendarPickerGrid({
  cells,
  ariaLabel,
  onCellActivate,
}: {
  cells: GridCell[];
  ariaLabel: string;
  onCellActivate?: (cell: GridCell) => void;
}) {
  return (
    <div className={styles.grid} role="grid" aria-label={ariaLabel}>
      {cells.map((cell) => (
        <CalendarCellPreview
          key={cell.key}
          day={cell.day}
          cellRole={cell.cellRole ?? "day"}
          cellType={cell.cellType}
          cellState={cell.cellState}
          rangePosition={cell.rangePosition}
          showDot={cell.showDot}
          interactive={Boolean(cell.interactive && onCellActivate)}
          onClick={
            cell.interactive && onCellActivate
              ? () => onCellActivate(cell)
              : undefined
          }
        />
      ))}
    </div>
  );
}

export function DatePickerMenu({
  menuType = "single",
  breakpoint = "desktop",
  showPresetRanges = true,
  showActions = true,
  calendarView = "days",
  onCalendarViewChange,
  viewMonth = 1,
  viewYear = 2024,
  onViewMonthChange,
  onViewYearChange,
  yearAnchor: yearAnchorProp,
  onYearAnchorChange,
  selectedDay = 12,
  onSelectDay,
  className,
}: {
  menuType?: DatePickerMenuType;
  breakpoint?: DatePickerMenuBreakpoint;
  showPresetRanges?: boolean;
  showActions?: boolean;
  calendarView?: DatePickerCalendarView;
  onCalendarViewChange?: (view: DatePickerCalendarView) => void;
  viewMonth?: number;
  viewYear?: number;
  onViewMonthChange?: (month: number) => void;
  onViewYearChange?: (year: number) => void;
  yearAnchor?: number;
  onYearAnchorChange?: (anchor: number) => void;
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "dark" : "light";

  const yearAnchor = yearAnchorProp ?? yearAnchorFor(viewYear);

  const themeVars = useMemo(() => {
    const cal = calendarCellThemeVars(mode);
    return {
      ...cal,
      ["--ds-dpm-surface" as string]: resolveJsonBackgroundColor(
        "bg-container",
        mode,
      ),
      ["--ds-dpm-hover" as string]: resolveJsonBackgroundColor(
        "bg-primary",
        mode,
      ),
    };
  }, [mode]);

  const headerLabel = getCalendarHeaderLabel(
    calendarView,
    viewMonth,
    viewYear,
    yearAnchor,
  );

  const dateInputValue = formatDatePickerMenuValue(
    selectedDay,
    viewMonth,
    viewYear,
  );

  const gridConfig = useMemo(() => {
    if (calendarView === "months") {
      return {
        cells: buildMonthsGrid(viewMonth),
        ariaLabel: "Seleccionar mes",
      };
    }
    if (calendarView === "years") {
      return {
        cells: buildYearsGrid(yearAnchor, viewYear),
        ariaLabel: "Seleccionar año",
      };
    }
    return {
      cells: buildDaysGrid(selectedDay),
      ariaLabel: "Calendario",
    };
  }, [calendarView, selectedDay, viewMonth, viewYear, yearAnchor]);

  const todayAppearance = resolveButtonAppearance(
    mode,
    "Outlined",
    "Enabled",
    "Gray",
  );
  const cancelAppearance = resolveButtonAppearance(
    mode,
    "Outlined",
    "Enabled",
    "Blue",
  );
  const applyAppearance = resolveButtonAppearance(
    mode,
    "Primary",
    "Enabled",
    "Blue",
  );

  const showPresetCol =
    menuType === "dual" && showPresetRanges && breakpoint === "desktop";
  const showPresetRow =
    menuType === "dual" && showPresetRanges && breakpoint === "mobile";

  const handlePrev = () => {
    if (calendarView === "days") {
      const next = shiftMonth(viewMonth, viewYear, -1);
      onViewMonthChange?.(next.month);
      onViewYearChange?.(next.year);
      return;
    }
    if (calendarView === "months") {
      onViewYearChange?.(viewYear - 1);
      return;
    }
    onYearAnchorChange?.(yearAnchor - 12);
  };

  const handleNext = () => {
    if (calendarView === "days") {
      const next = shiftMonth(viewMonth, viewYear, 1);
      onViewMonthChange?.(next.month);
      onViewYearChange?.(next.year);
      return;
    }
    if (calendarView === "months") {
      onViewYearChange?.(viewYear + 1);
      return;
    }
    onYearAnchorChange?.(yearAnchor + 12);
  };

  const handleHeaderClick = () => {
    if (calendarView === "days") {
      onCalendarViewChange?.("months");
    } else if (calendarView === "months") {
      onYearAnchorChange?.(yearAnchorFor(viewYear));
      onCalendarViewChange?.("years");
    }
  };

  const handleCellActivate = (cell: GridCell) => {
    if (calendarView === "days" && typeof cell.day === "number") {
      if (cell.key.startsWith("d-")) {
        onSelectDay?.(cell.day);
      }
      return;
    }
    if (calendarView === "months" && cell.key.startsWith("m-")) {
      const month = Number(cell.key.slice(2));
      onViewMonthChange?.(month);
      onCalendarViewChange?.("days");
      return;
    }
    if (calendarView === "years" && cell.key.startsWith("y-")) {
      const year = Number(cell.key.slice(2));
      onViewYearChange?.(year);
      onYearAnchorChange?.(yearAnchorFor(year));
      onCalendarViewChange?.("months");
    }
  };

  const prevAria =
    calendarView === "days"
      ? "Mes anterior"
      : calendarView === "months"
        ? "Año anterior"
        : "Período anterior";
  const nextAria =
    calendarView === "days"
      ? "Mes siguiente"
      : calendarView === "months"
        ? "Año siguiente"
        : "Período siguiente";

  const headerCanDrill =
    calendarView === "days" || calendarView === "months";

  return (
    <div
      className={`${styles.root} ${calCellStyles.root} ${inputStyles.root} ${buttonStyles.root} ${className ?? ""}`}
      style={themeVars}
    >
      <div
        className={styles.panel}
        data-type={menuType}
        data-breakpoint={breakpoint}
        data-calendar-view={calendarView}
      >
        {showPresetCol ? (
          <aside className={styles.presetCol} aria-label="Rangos predefinidos">
            {PRESET_LABELS.map((label) => (
              <button key={label} type="button" className={styles.presetLink}>
                {label}
              </button>
            ))}
          </aside>
        ) : null}

        <div className={styles.mainCol}>
          <div className={styles.content}>
            <div className={styles.monthRow}>
              <button
                type="button"
                className={styles.monthNav}
                aria-label={prevAria}
                onClick={handlePrev}
              >
                <span
                  className={`material-symbols-rounded ${styles.monthNavIcon}`}
                  aria-hidden
                >
                  navigate_before
                </span>
              </button>
              {headerCanDrill ? (
                <button
                  type="button"
                  className={styles.monthLabelBtn}
                  onClick={handleHeaderClick}
                  aria-label={
                    calendarView === "days"
                      ? "Elegir mes y año"
                      : "Elegir año"
                  }
                >
                  {headerLabel}
                </button>
              ) : (
                <p className={styles.monthLabel}>{headerLabel}</p>
              )}
              <button
                type="button"
                className={styles.monthNav}
                aria-label={nextAria}
                onClick={handleNext}
              >
                <span
                  className={`material-symbols-rounded ${styles.monthNavIcon}`}
                  aria-hidden
                >
                  navigate_next
                </span>
              </button>
            </div>

            {menuType === "single" ? (
              <div
                className={styles.actionsRow}
                data-breakpoint={breakpoint}
              >
                <div className={styles.inputGrow}>
                  <CatalogInput
                    {...MENU_INPUT_ATOM_PROPS}
                    inputId="dpm-input-single"
                    valueText={dateInputValue}
                  />
                </div>
                <div className={styles.todayBtn}>
                  <CatalogButton
                    {...MENU_TODAY_BUTTON_PROPS}
                    appearance={todayAppearance}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.dualInputs}>
                <div className={styles.inputGrow}>
                  <CatalogInput
                    {...MENU_INPUT_ATOM_PROPS}
                    inputId="dpm-input-start"
                    valueText={dateInputValue}
                  />
                </div>
                <span className={styles.dualSep} aria-hidden>
                  –
                </span>
                <div className={styles.inputGrow}>
                  <CatalogInput
                    {...MENU_INPUT_ATOM_PROPS}
                    inputId="dpm-input-end"
                    valueText={dateInputValue}
                  />
                </div>
              </div>
            )}

            {showPresetRow ? (
              <div className={styles.presetRow}>
                {PRESET_LABELS.map((label) => (
                  <button key={label} type="button" className={styles.presetLink}>
                    {label}
                  </button>
                ))}
              </div>
            ) : null}

            <CalendarPickerGrid
              cells={gridConfig.cells}
              ariaLabel={gridConfig.ariaLabel}
              onCellActivate={handleCellActivate}
            />
          </div>

          {showActions ? (
            <footer className={styles.footer}>
              <div className={styles.footerBtn}>
                <CatalogButton
                  {...MENU_BUTTON_ATOM_PROPS}
                  buttonStyle="Outlined"
                  buttonColor="Blue"
                  text="Cancelar"
                  appearance={cancelAppearance}
                />
              </div>
              <div className={styles.footerBtn}>
                <CatalogButton
                  {...MENU_BUTTON_ATOM_PROPS}
                  buttonStyle="Primary"
                  buttonColor="Blue"
                  text="Aplicar"
                  appearance={applyAppearance}
                />
              </div>
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
