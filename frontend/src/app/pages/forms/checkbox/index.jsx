// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Rounded } from "./Rounded";
import { Outlined } from "./Outlined";
import { OutlinedRouned } from "./OutlinedRouned";
import { Disabled } from "./Disabled";
import { CheckboxSizes } from "./CheckboxSizes";
import { CheckboxGroup } from "./CheckboxGroup";
import { Custom } from "./Custom";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Checkbox" }];

const markdownPath = "forms/checkbox";

const demos = [
  {
    title: "Default Checkbox",
    description:
      "<code>Checkboxes</code> are for selecting one or several options in a list, while radios are for selecting one option from many Check out code for detail of usage.",
    Component: Default,
    markdownName: "Default",
  },
  {
    title: "Basic Checkbox",
    description:
      "<code>Checkbox</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Rounded Checkbox",
    description:
      "<code>Checkbox</code> can have a rounded-sm shape. To do this, you should use the <code>rounded-full</code> utility class. Check out code for detail of usage.",
    Component: Rounded,
    markdownName: "Rounded",
  },
  {
    title: "Outlined Checkbox",
    description: `<code>Checkbox</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
    markdownName: "Outlined",
  },
  {
    title: "Outlined Rouned",
    description:
      "<code>Checkbox</code> can have a rounded-sm shape. To do this, you should use the <code>rounded-full</code> utility class. Check out code for detail of usage.",
    Component: OutlinedRouned,
    markdownName: "OutlinedRouned",
  },

  {
    title: "Disabled Checkbox",
    description:
      "<code>Checkbox</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
    markdownName: "Disabled",
  },
  {
    title: "Checkbox Sizes",
    description:
      "<code>Checkbox</code> components can have various sizes. Check out code for detail of usage.",
    Component: CheckboxSizes,
    markdownName: "CheckboxSizes",
  },
  {
    title: "Checkbox Group",
    description:
      "Use <code>Checkbox</code> group to allow users to select multiple items from a list of individual items, or to mark one individual item as selected. Check out code for detail of usage.",
    Component: CheckboxGroup,
    markdownName: "CheckboxGroup",
  },
  {
    title: "Custom Checkbox",
    description:
      "You can create custom <code>Checkbox</code> components. Check out code for detail of usage.",
    Component: Custom,
    markdownName: "Custom",
  },
];

export default function Checkbox() {
  return (
    <DemoLayout
      title="Input Checkbox"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
