/**
 * Feature 04 / task_01 — mapa átomo → ruta → sidenav.
 * Fuente única: importar en `nav/categories.ts` y `routes.tsx`.
 */

export type AtomCatalogStatus = "review" | "placeholder";

export interface AtomCatalogRoute {
  id: string;
  label: string;
  /** Ruta absoluta del catálogo (ej. `/atoms/inputs`). */
  path: string;
  status: AtomCatalogStatus;
  viewComponent: string;
  taskFile: string;
}

/** Orden = tasks 02–23 del charter Feature 04. */
export const ATOM_CATALOG_ROUTES: AtomCatalogRoute[] = [
  {
    id: "radio-buttons",
    label: "Radio Buttons",
    path: "/atoms/radio-buttons",
    status: "review",
    viewComponent: "radio-button-view.tsx",
    taskFile: "task_02_radio_buttons.md",
  },
  {
    id: "checkboxes",
    label: "Checkbox",
    path: "/atoms/checkboxes",
    status: "review",
    viewComponent: "checkbox-view.tsx",
    taskFile: "task_03_checkbox.md",
  },
  {
    id: "inputs",
    label: "Inputs",
    path: "/atoms/inputs",
    status: "review",
    viewComponent: "inputs-view.tsx",
    taskFile: "task_04_inputs.md",
  },
  {
    id: "badges",
    label: "Badges",
    path: "/atoms/badges",
    status: "review",
    viewComponent: "badges-view.tsx",
    taskFile: "task_05_badges.md",
  },
  {
    id: "buttons",
    label: "Buttons",
    path: "/atoms",
    status: "review",
    viewComponent: "buttons-view.tsx",
    taskFile: "task_06_buttons.md",
  },
  {
    id: "motion-dividers",
    label: "Dividers",
    path: "/atoms/dividers",
    status: "review",
    viewComponent: "dividers-view.tsx",
    taskFile: "task_07_motion_dividers.md",
  },
  {
    id: "tabs",
    label: "Tabs",
    path: "/atoms/tabs",
    status: "review",
    viewComponent: "tabs-view.tsx",
    taskFile: "task_08_tabs.md",
  },
  {
    id: "bar-progress",
    label: "Bar progress",
    path: "/atoms/bar-progress",
    status: "review",
    viewComponent: "bar-progress-view.tsx",
    taskFile: "task_09_bar_progress.md",
  },
  {
    id: "circle-progress",
    label: "Circle progress",
    path: "/atoms/circle-progress",
    status: "review",
    viewComponent: "circle-progress-view.tsx",
    taskFile: "task_10_circle_progress.md",
  },
  {
    id: "steppers",
    label: "Steppers",
    path: "/atoms/steppers",
    status: "review",
    viewComponent: "steppers-view.tsx",
    taskFile: "task_11_steppers.md",
  },
  {
    id: "switch",
    label: "Switch",
    path: "/atoms/switch",
    status: "review",
    viewComponent: "switch-view.tsx",
    taskFile: "task_12_switch.md",
  },
  {
    id: "slider",
    label: "Slider",
    path: "/atoms/slider",
    status: "review",
    viewComponent: "slider-view.tsx",
    taskFile: "task_13_slider.md",
  },
  {
    id: "search",
    label: "Search",
    path: "/atoms/search",
    status: "review",
    viewComponent: "search-view.tsx",
    taskFile: "task_14_search.md",
  },
  {
    id: "side-tabs",
    label: "Side tabs",
    path: "/atoms/side-tabs",
    status: "review",
    viewComponent: "side-tabs-view.tsx",
    taskFile: "task_15_side_tabs.md",
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    path: "/atoms/breadcrumbs",
    status: "review",
    viewComponent: "breadcrumbs-view.tsx",
    taskFile: "task_16_breadcrumbs.md",
  },
  {
    id: "table-item",
    label: "Table item",
    path: "/atoms/table-item",
    status: "review",
    viewComponent: "table-item-view.tsx",
    taskFile: "task_17_table_item.md",
  },
  {
    id: "calendar-cell",
    label: "Calendar cell",
    path: "/atoms/calendar-cell",
    status: "review",
    viewComponent: "calendar-cell-view.tsx",
    taskFile: "task_18_calendar_cell.md",
  },
  {
    id: "drop-input",
    label: "Drop input",
    path: "/atoms/drop-input",
    status: "review",
    viewComponent: "drop-input-view.tsx",
    taskFile: "task_19_drop_input.md",
  },
  {
    id: "drop-items",
    label: "Drop items",
    path: "/atoms/drop-items",
    status: "review",
    viewComponent: "drop-items-view.tsx",
    taskFile: "task_20_drop_items.md",
  },
  {
    id: "date-picker",
    label: "Date picker",
    path: "/atoms/date-picker",
    status: "review",
    viewComponent: "date-picker-view.tsx",
    taskFile: "task_21_date_picker.md",
  },
  {
    id: "file-upload",
    label: "File upload",
    path: "/atoms/file-upload",
    status: "review",
    viewComponent: "file-upload-view.tsx",
    taskFile: "task_22_file_upload.md",
  },
  {
    id: "chart-mini",
    label: "Chart mini",
    path: "/atoms/chart-mini",
    status: "review",
    viewComponent: "chart-mini-view.tsx",
    taskFile: "task_23_chart_mini.md",
  },
];

export function getAtomCatalogByPath(pathname: string): AtomCatalogRoute | undefined {
  const normalized =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return ATOM_CATALOG_ROUTES.find((r) => r.path === normalized);
}

/** Segmento de ruta hijo bajo `/atoms` (sin leading slash). */
export function atomRouterPath(catalogPath: string): string {
  if (catalogPath === "/atoms") return "atoms";
  return catalogPath.replace(/^\//, "");
}
