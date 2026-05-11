// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { RangeSizes } from "./RangeSizes";
import { Controlled } from "./Controlled";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/forms" },
  { title: "Input Range" },
];

const markdownPath = "forms/range";

const demos = [
  {
    title: "Default Range",
    description:
      "Custom <code>Range</code> inputs for consistent cross-browser styling and built-in customization. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Range",
    description:
      "<code>Range</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Range Sizes",
    description:
      "<code>Range</code> components can have various sizes. Check out code for detail of usage.",
    Component: RangeSizes,
  
    markdownName: "RangeSizes",
  },
  {
    title: "Controlled Range",
    description:
      "<code>Range</code> can be controlled. Check out code for detail of usage. ",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
];

export default function Range() {
  return (
    <DemoLayout
      title="Input Range"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
