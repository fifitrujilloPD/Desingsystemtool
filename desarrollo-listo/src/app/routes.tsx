import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/dashboard-layout";
import { ColorsView } from "./components/colors-view";
import { Navigate } from "react-router";
import { OrganismsView } from "./components/organisms-view";
import { PlaceholderView } from "./components/placeholder-view";
import { IconsView } from "./components/icons-view";
import { TypographyView } from "./components/typography-view";
import { SpacingView } from "./components/spacing-view";
import { BordersView } from "./components/borders-view";
import { InputsView } from "./components/inputs-view";
import { BadgesView } from "./components/badges-view";
import { RadioButtonView } from "./components/radio-button-view";
import { CheckboxView } from "./components/checkbox-view";
import { TabsView } from "./components/tabs-view";
import { SwitchView } from "./components/switch-view";
import { ButtonsView } from "./components/buttons-view";
import { DividersView } from "./components/dividers-view";
import { BarProgressView } from "./components/bar-progress-view";
import { CircleProgressView } from "./components/circle-progress-view";
import { SteppersView } from "./components/steppers-view";
import { SliderView } from "./components/slider-view";
import { SearchView } from "./components/search-view";
import { SideTabsView } from "./components/side-tabs-view";
import { BreadcrumbsView } from "./components/breadcrumbs-view";
import { TableItemView } from "./components/table-item-view";
import { CalendarCellView } from "./components/calendar-cell-view";
import { DropInputView } from "./components/drop-input-view";
import { DropItemsView } from "./components/drop-items-view";
import { DatePickerView } from "./components/date-picker-view";
import { FileUploadView } from "./components/file-upload-view";
import { ChartMiniView } from "./components/chart-mini-view";
import {
  ATOM_CATALOG_ROUTES,
  atomRouterPath,
  type AtomCatalogRoute,
} from "./data/atom-catalog-routes";
import {
  MOLECULE_CATALOG_ROUTES,
  moleculeRouterPath,
} from "./data/molecule-catalog-routes";
import { MoleculePlaceholderView } from "./components/molecule-placeholder-view";
import { DatePickerMenuView } from "./components/date-picker-menu-view";
import { FileUploadItemBaseView } from "./components/file-upload-item-base-view";
import type { MoleculeCatalogRoute } from "./data/molecule-catalog-routes";

const ATOM_VIEW_BY_ID: Record<
  AtomCatalogRoute["id"],
  ComponentType | undefined
> = {
  "radio-buttons": RadioButtonView,
  checkboxes: CheckboxView,
  inputs: InputsView,
  badges: BadgesView,
  buttons: ButtonsView,
  "motion-dividers": DividersView,
  tabs: TabsView,
  switch: SwitchView,
  "bar-progress": BarProgressView,
  "circle-progress": CircleProgressView,
  steppers: SteppersView,
  slider: SliderView,
  search: SearchView,
  "side-tabs": SideTabsView,
  breadcrumbs: BreadcrumbsView,
  "table-item": TableItemView,
  "calendar-cell": CalendarCellView,
  "drop-input": DropInputView,
  "drop-items": DropItemsView,
  "date-picker": DatePickerView,
  "file-upload": FileUploadView,
  "chart-mini": ChartMiniView,
};

function atomRouteObjects(): RouteObject[] {
  return ATOM_CATALOG_ROUTES.map((entry) => {
    const Component =
      entry.status === "review"
        ? ATOM_VIEW_BY_ID[entry.id]
        : PlaceholderView;
    if (!Component) {
      throw new Error(`Missing view for atom route: ${entry.id}`);
    }
    return {
      path: atomRouterPath(entry.path),
      Component,
    };
  });
}

const MOLECULE_VIEW_BY_ID: Record<
  MoleculeCatalogRoute["id"],
  ComponentType | undefined
> = {
  "date-picker-menu": DatePickerMenuView,
  "file-upload-item-base": FileUploadItemBaseView,
  snackbar: undefined,
  "button-toggle": undefined,
};

function moleculeRouteObjects(): RouteObject[] {
  return MOLECULE_CATALOG_ROUTES.map((entry) => {
    const Component =
      entry.status === "review"
        ? MOLECULE_VIEW_BY_ID[entry.id]
        : MoleculePlaceholderView;
    if (!Component) {
      throw new Error(`Missing view for molecule route: ${entry.id}`);
    }
    return {
      path: moleculeRouterPath(entry.path),
      Component,
    };
  });
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: ColorsView },
      { path: "colors", Component: ColorsView },
      { path: "icons", Component: IconsView },
      { path: "typography", Component: TypographyView },
      { path: "spacing", Component: SpacingView },
      { path: "borders", Component: BordersView },
      { path: "shadows", Component: PlaceholderView },
      ...atomRouteObjects(),
      ...moleculeRouteObjects(),
      {
        path: "molecules",
        Component: () => (
          <Navigate
            to={MOLECULE_CATALOG_ROUTES[0]?.path ?? "/molecules/date-picker-menu"}
            replace
          />
        ),
      },
      { path: "organisms", Component: OrganismsView },
      { path: "organisms/:section", Component: OrganismsView },
      { path: "*", Component: PlaceholderView },
    ],
  },
]);
