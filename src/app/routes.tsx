import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/dashboard-layout";
import { ColorsView } from "./components/colors-view";
import { AtomsView } from "./components/atoms-view";
import { ButtonsView } from "./components/buttons-view";
import { MoleculesView } from "./components/molecules-view";
import { OrganismsView } from "./components/organisms-view";
import { PlaceholderView } from "./components/placeholder-view";
import { IconsView } from "./components/icons-view";
import { TypographyView } from "./components/typography-view";
import { SpacingView } from "./components/spacing-view";
import { InputsView } from "./components/inputs-view";
import { BadgesView } from "./components/badges-view";
import { RadioButtonView } from "./components/radio-button-view";
import { CheckboxView } from "./components/checkbox-view";
import { TabsView } from "./components/tabs-view";
import { SwitchView } from "./components/switch-view";

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
      { path: "shadows", Component: PlaceholderView },
      { path: "atoms", Component: ButtonsView },
      { path: "atoms/inputs", Component: InputsView },
      { path: "atoms/badges", Component: BadgesView },
      { path: "atoms/radio-buttons", Component: RadioButtonView },
      { path: "atoms/checkboxes", Component: CheckboxView },
      { path: "atoms/tabs", Component: TabsView },
      { path: "atoms/switch", Component: SwitchView },
      { path: "atoms/icons", Component: AtomsView },
      { path: "atoms/:section", Component: AtomsView },
      { path: "molecules", Component: MoleculesView },
      { path: "molecules/:section", Component: MoleculesView },
      { path: "organisms", Component: OrganismsView },
      { path: "organisms/:section", Component: OrganismsView },
      { path: "*", Component: PlaceholderView },
    ],
  },
]);