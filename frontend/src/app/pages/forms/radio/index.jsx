// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Outlined } from "./Outlined";
import { Disabled } from "./Disabled";
import { Square } from "./Square";
import { RadioSizes } from "./RadioSizes";
import { Controlled } from "./Controlled";
import { RadioGroups } from "./RadioGroups";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Radio" }];

const markdownPath = "forms/radio";

const demos = [
  {
    title: "Default Radio",
    description:
      "<code>Radio</code> are generally used in radio groups collections of radio buttons describing a set of related options. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Radio",
    description:
      "<code>Radio</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Square Radio",
    description:
      "<code>Radio</code> can have a square shape. To do this, you should use the <code>rounded-lg</code> utility class. Check out code for detail of usage.",
    Component: Square,
  
    markdownName: "Square",
  },
  {
    title: "Outlined Radio",
    description: `<code>Radio</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Disabled Radio",
    description:
      "<code>Radio</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
  {
    title: "Radio Sizes",
    description:
      "<code>Radio</code> components can have various sizes. Check out code for detail of usage.",
    Component: RadioSizes,
  
    markdownName: "RadioSizes",
  },
  {
    title: "Controlled",
    description:
      "<code>Radio</code> can be controlled. Check out code for detail of usage.",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Radio Group",
    description:
      "The <code>Radio Group</code> is used for the grouping of radios and provides the feature of selecting only one radio from the set. Check out code for detail of usage.",
    Component: RadioGroups,
  
    markdownName: "RadioGroups",
  },
];

export default function Radio() {
  return (
    <DemoLayout
      title="Input Radio"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
