// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Icon } from "./Icon";
import { Rotate } from "./Rotate";
import { Flip } from "./Flip";
import { Polymorphic } from "./Polymorphic";
import { Controlled } from "./Controlled";
import { Disabled } from "./Disabled";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Swap" }];

const markdownPath = "forms/swap";

const demos = [
  {
    title: "Basic Swap",
    description:
      "<code>Swap</code> is a component that allows you to toggle between two states with a smooth transition effect. See the code for detailed usage instructions.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Icon Swap",
    description:
      "Use icons to swap between two states with a transition effect. Check the code for detailed usage instructions.",
    Component: Icon,
  
    markdownName: "Icon",
  },
  {
    title: "Rotate Effect",
    description:
      "Set the <code>effect</code> prop to <code>rotate</code> for a rotating transition effect. Check the code for detailed usage instructions.",
    Component: Rotate,
  
    markdownName: "Rotate",
  },
  {
    title: "Flip Effect",
    description:
      "Set the <code>effect</code> prop to <code>flip</code> for a flipping transition effect. Check the code for detailed usage instructions.",
    Component: Flip,
  
    markdownName: "Flip",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Swap</code> is a polymorphic component, allowing flexible rendering. See the code for detailed usage instructions.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "Controlled",
    description:
      "The <code>Swap</code> component can be controlled programmatically. Check the code for detailed usage instructions.",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Disabled",
    description:
      "You can disable the <code>Swap</code> component. Check the code for detailed usage instructions.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
];

export default function Swap() {
  return (
    <DemoLayout
      title="Swap"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
