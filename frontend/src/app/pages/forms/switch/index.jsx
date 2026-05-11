// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Outlined } from "./Outlined";
import { Disabled } from "./Disabled";
import { Square } from "./Square";
import { SwitchSizes } from "./SwitchSizes";
import { Controlled } from "./Controlled";
import { SwitchThumbSizes } from "./SwitchThumbSizes";
import { HeadlessUIExamples } from "./HeadlessUIExamples";
import { Loading } from "./Loading";
import { HeadlessUiCustom } from "./HeadlessUiCustom";
import { Custom } from "./Custom";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Switch" }];

const markdownPath = "forms/switch";

const demos = [
  {
    title: "Default Switch",
    description:
      "<code>Switch</code> is a simple component used for activating one of two predefined options. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Switch",
    description:
      "<code>Switch</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Square Switch",
    description:
      "<code>Switch</code> can have a square shape. To do this, you should use the <code>rounded-lg before:rounded-md</code> utility class. Check out code for detail of usage.",
    Component: Square,
  
    markdownName: "Square",
  },
  {
    title: "Outlined Switch",
    description: `<code>Switch</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Disabled Switch",
    description:
      "<code>Switch</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
  {
    title: "Switch Sizes",
    description:
      "<code>Switch</code> components can have various sizes. Check out code for detail of usage.",
    Component: SwitchSizes,
  
    markdownName: "SwitchSizes",
  },
  {
    title: "Switch Thumb Sizes",
    description:
      "<code>Switch</code> Thumb can have various sizes. Check out code for detail of usage.",
    Component: SwitchThumbSizes,
  
    markdownName: "SwitchThumbSizes",
  },
  {
    title: "Controlled",
    description:
      "<code>Switch</code> can be controlled. Check out code for detail of usage.",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Headless UI Examples",
    description:
      "Styled Headless UI switches. Check out code for detail of usage.",
    Component: HeadlessUIExamples,
  
    markdownName: "HeadlessUIExamples",
  },
  {
    title: "Loading State",
    description: "Loading state switch. Check out code for detail of usage.",
    Component: Loading,
  
    markdownName: "Loading",
  },
  {
    title: "Custom",
    description:
      "You can also give <code>Switch</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
  {
    title: "Headless UI Examples",
    description:
      "Styled Headless UI switches. Check out code for detail of usage.",
    Component: HeadlessUiCustom,
  
    markdownName: "HeadlessUiCustom",
  },
];

export default function Switch() {
  return (
    <DemoLayout
      title="Switch"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
