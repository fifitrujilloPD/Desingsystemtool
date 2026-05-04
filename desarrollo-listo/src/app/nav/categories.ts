import type { LucideIcon } from "lucide-react";
import { Palette, Circle, Grid, Boxes } from "lucide-react";

/** Ítem de navegación (hoja). */
export interface NavTreeItem {
  id: string;
  label: string;
  path: string;
}

/** Grupo Atomic Design (orden fijo: Foundations → Atoms → Molecules → Organisms). */
export interface NavCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavTreeItem[];
}

/**
 * Fuente única de verdad para sidenav y título de módulo (Feature 02).
 * Nuevo ítem = solo datos aquí + ruta en `routes.tsx`.
 */
export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "foundations",
    label: "Foundations",
    icon: Palette,
    children: [
      { id: "colors", label: "Colors", path: "/colors" },
      { id: "icons", label: "Icons", path: "/icons" },
      { id: "typography", label: "Typography", path: "/typography" },
      { id: "spacing", label: "Spacing", path: "/spacing" },
      { id: "borders", label: "Borders", path: "/borders" },
      { id: "shadows", label: "Shadows", path: "/shadows" },
    ],
  },
  {
    id: "atoms",
    label: "Atoms",
    icon: Circle,
    children: [
      { id: "buttons", label: "Buttons", path: "/atoms" },
      { id: "inputs", label: "Inputs", path: "/atoms/inputs" },
      { id: "badges", label: "Badges", path: "/atoms/badges" },
      { id: "radio-buttons", label: "Radio Buttons", path: "/atoms/radio-buttons" },
      { id: "checkboxes", label: "Checkboxes", path: "/atoms/checkboxes" },
      { id: "tabs", label: "Tabs", path: "/atoms/tabs" },
      { id: "switch", label: "Switch", path: "/atoms/switch" },
      { id: "icons", label: "Icons", path: "/atoms/icons" },
    ],
  },
  {
    id: "molecules",
    label: "Molecules",
    icon: Grid,
    children: [
      { id: "cards", label: "Cards", path: "/molecules" },
      { id: "forms", label: "Forms", path: "/molecules/forms" },
      { id: "modals", label: "Modals", path: "/molecules/modals" },
      { id: "dropdowns", label: "Dropdowns", path: "/molecules/dropdowns" },
    ],
  },
  {
    id: "organisms",
    label: "Organisms",
    icon: Boxes,
    children: [
      { id: "navbar", label: "Navbar", path: "/organisms" },
      { id: "sidebar", label: "Sidebar", path: "/organisms/sidebar" },
      { id: "tables", label: "Tables", path: "/organisms/tables" },
      { id: "layouts", label: "Layouts", path: "/organisms/layouts" },
    ],
  },
];

export interface NavModuleMeta {
  atomicModule: string;
  pageTitle: string;
}

/** Resuelve título de página + módulo Atomic para el header del área de catálogo. */
export function resolveNavModuleMeta(pathname: string): NavModuleMeta {
  const path = pathname || "/";
  const normalized = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

  if (normalized === "/") {
    return { atomicModule: "Foundations", pageTitle: "Colors" };
  }

  for (const cat of NAV_CATEGORIES) {
    for (const child of cat.children) {
      if (child.path === normalized) {
        return { atomicModule: cat.label, pageTitle: child.label };
      }
    }
  }

  /* Rutas dinámicas /atoms/:section, /molecules/:section, /organisms/:section */
  const atoms = NAV_CATEGORIES.find((c) => c.id === "atoms");
  if (normalized.startsWith("/atoms") && atoms) {
    return { atomicModule: atoms.label, pageTitle: "Atoms" };
  }
  const molecules = NAV_CATEGORIES.find((c) => c.id === "molecules");
  if (normalized.startsWith("/molecules") && molecules) {
    return { atomicModule: molecules.label, pageTitle: "Molecules" };
  }
  const organisms = NAV_CATEGORIES.find((c) => c.id === "organisms");
  if (normalized.startsWith("/organisms") && organisms) {
    return { atomicModule: organisms.label, pageTitle: "Organisms" };
  }

  return { atomicModule: "Catalog", pageTitle: "Design system" };
}

/** Ruta activa del ítem (incluye `/` como home de Colors). */
export function isNavPathActive(pathname: string, childPath: string): boolean {
  const p = pathname || "/";
  if (childPath === p) return true;
  if (childPath === "/colors" && (p === "/" || p === "/colors")) return true;
  return false;
}
