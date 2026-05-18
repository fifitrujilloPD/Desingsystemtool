import type { LucideIcon } from "lucide-react";
import { Palette, Circle, Grid, Boxes } from "lucide-react";
import { ATOM_CATALOG_ROUTES } from "../data/atom-catalog-routes";
import { MOLECULE_CATALOG_ROUTES } from "../data/molecule-catalog-routes";

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
    children: ATOM_CATALOG_ROUTES.map((route) => ({
      id: route.id,
      label: route.label,
      path: route.path,
    })),
  },
  {
    id: "molecules",
    label: "Molecules",
    icon: Grid,
    children: MOLECULE_CATALOG_ROUTES.map((route) => ({
      id: route.id,
      label: route.label,
      path: route.path,
    })),
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

  const atomEntry = ATOM_CATALOG_ROUTES.find((r) => r.path === normalized);
  if (atomEntry) {
    return { atomicModule: "Atoms", pageTitle: atomEntry.label };
  }

  if (normalized.startsWith("/atoms")) {
    return { atomicModule: "Atoms", pageTitle: "Atoms" };
  }
  const moleculeEntry = MOLECULE_CATALOG_ROUTES.find(
    (r) => r.path === normalized,
  );
  if (moleculeEntry) {
    return { atomicModule: "Molecules", pageTitle: moleculeEntry.label };
  }

  if (normalized === "/molecules") {
    return {
      atomicModule: "Molecules",
      pageTitle: MOLECULE_CATALOG_ROUTES[0]?.label ?? "Molecules",
    };
  }

  if (normalized.startsWith("/molecules")) {
    return { atomicModule: "Molecules", pageTitle: "Molecules" };
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
