// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { SoftColor } from "./SoftColor";
import { ProgressSizes } from "./ProgressSizes";
import { Active } from "./Active";
import { Indeterminate } from "./Indeterminate";
import { Customizer } from "./Customizer";
import { Custom } from "./Custom";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Progress" },
];

const markdownPath = "components/progress";

const demos = [
  {
    title: "Default Progress",
    description:
      "The <code>Progress</code> component displays a colored loading bar. Check out code for detail of usage.",
    Component: Default,
    markdownName: "Default",
  },
  {
    title: "Basic Progress",
    description:
      "<code>Progress</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Soft Color Progress",
    description: `<code>Progress</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
    markdownName: "SoftColor",
  },
  {
    title: "Progress Sizes",
    description:
      "<code>Progress</code> components can have various sizes. Check out code for detail of usage.",
    Component: ProgressSizes,
    markdownName: "ProgressSizes",
  },
  {
    title: "Active Progress",
    description: `<code>Progress</code> can be active. To do this, set <code>isActive={true}</code>. Check out code for detail of usage.`,
    Component: Active,
    markdownName: "Active",
  },
  {
    title: "Indeterminate Progress",
    description: `<code>Progress</code> can be indeterminate. To do this, set <code>isIndeterminate={true}</code>. Check out code for detail of usage.`,
    Component: Indeterminate,
    markdownName: "Indeterminate",
  },
  {
    title: "Customizer",
    Component: Customizer,
    markdownName: "Customizer",
  },
  {
    title: "Custom Progress",
    description:
      "You can also give <code>Progress</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
    markdownName: "Custom",
  },
];

export default function Progress() {
  return (
    <DemoLayout
      title="Progress"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
