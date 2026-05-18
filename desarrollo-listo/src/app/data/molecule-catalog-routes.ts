/**
 * Feature 05 / task_01 — mapa molécula → ruta → sidenav (ola 1).
 * Fuente única: importar en `nav/categories.ts` y `routes.tsx`.
 */

export type MoleculeCatalogStatus = "placeholder" | "review";

export interface MoleculeCatalogRoute {
  id: string;
  label: string;
  /** Ruta absoluta del catálogo (ej. `/molecules/snackbar`). */
  path: string;
  status: MoleculeCatalogStatus;
  viewComponent: string;
  taskFile: string;
}

/** Orden = tasks 02–05 del charter Feature 05 (ola 1). */
export const MOLECULE_CATALOG_ROUTES: MoleculeCatalogRoute[] = [
  {
    id: "date-picker-menu",
    label: "Date picker menu",
    path: "/molecules/date-picker-menu",
    status: "review",
    viewComponent: "date-picker-menu-view.tsx",
    taskFile: "task_02_date_picker_menu.md",
  },
  {
    id: "file-upload-item-base",
    label: "File upload item base",
    path: "/molecules/file-upload-item-base",
    status: "review",
    viewComponent: "file-upload-item-base-view.tsx",
    taskFile: "task_03_file_upload_item_base.md",
  },
  {
    id: "snackbar",
    label: "Snackbar",
    path: "/molecules/snackbar",
    status: "placeholder",
    viewComponent: "snackbar-view.tsx",
    taskFile: "task_04_snackbar.md",
  },
  {
    id: "button-toggle",
    label: "Button toggle",
    path: "/molecules/button-toggle",
    status: "placeholder",
    viewComponent: "button-toggle-view.tsx",
    taskFile: "task_05_button_toggle.md",
  },
];

/** Ruta índice del módulo Molecules (redirige al primer ítem del catálogo). */
export const MOLECULES_INDEX_PATH = "/molecules";

export function getMoleculeCatalogByPath(
  pathname: string,
): MoleculeCatalogRoute | undefined {
  const normalized =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return MOLECULE_CATALOG_ROUTES.find((r) => r.path === normalized);
}

/** Segmento de ruta para React Router (sin leading slash). */
export function moleculeRouterPath(catalogPath: string): string {
  return catalogPath.replace(/^\//, "");
}
