import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/dashboard-layout";
import { ColorsView } from "./components/colors-view";
import { MoleculesView } from "./components/molecules-view";
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
      { path: "molecules", Component: MoleculesView },
      { path: "molecules/:section", Component: MoleculesView },
      { path: "organisms", Component: OrganismsView },
      { path: "organisms/:section", Component: OrganismsView },
      { path: "*", Component: PlaceholderView },
    ],
  },
]);
