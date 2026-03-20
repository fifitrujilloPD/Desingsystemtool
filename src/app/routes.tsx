import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/dashboard-layout";
import { ColorsView } from "./components/colors-view";
import { AtomsView } from "./components/atoms-view";
import { MoleculesView } from "./components/molecules-view";
import { OrganismsView } from "./components/organisms-view";
import { PlaceholderView } from "./components/placeholder-view";
import { IconsView } from "./components/icons-view";
import { TypographyView } from "./components/typography-view";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: ColorsView },
      { path: "colors", Component: ColorsView },
      { path: "icons", Component: IconsView },
      { path: "typography", Component: TypographyView },
      { path: "spacing", Component: PlaceholderView },
      { path: "shadows", Component: PlaceholderView },
      { path: "atoms", Component: AtomsView },
      { path: "atoms/:section", Component: AtomsView },
      { path: "molecules", Component: MoleculesView },
      { path: "molecules/:section", Component: MoleculesView },
      { path: "organisms", Component: OrganismsView },
      { path: "organisms/:section", Component: OrganismsView },
      { path: "*", Component: PlaceholderView },
    ],
  },
]);