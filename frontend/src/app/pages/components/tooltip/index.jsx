// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Placement } from "./Placement";
import { JSXContent } from "./JSXContent";
import { Controlled } from "./Controlled";
import { Delay } from "./Delay";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Tooltip" },
];

const markdownPath = "components/tooltip";

const demos = [
  {
    title: "Default Tooltip",
    description:
      "A <code>Tooltip</code> is often used to specify extra information about something when the user moves the mouse pointer over an element. There are <a href='https://react-tooltip.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>react-tooltip</a> library is used for tooltips. Check out code for detail of usage.",
    Component: Default,
    markdownName: "Default",
  },
  {
    title: "Basic Tooltip",
    description:
      "<code>Tooltip</code> component can have different colors <code> (info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Placement Tooltip",
    description:
      "<code>Tooltip</code> can be placed in four base ways in relation to the reference element. Check out code for detail of usage.",
    Component: Placement,
    markdownName: "Placement",
  },
  {
    title: "JSX Content",
    description:
      "The <code>Tooltip</code> can contain JSX content. Check out code for detail of usage.",
    Component: JSXContent,
    markdownName: "JSXContent",
  },
  {
    title: "Controlled",
    description:
      "The <code>Tooltip</code> can be controlled. Check out code for detail of usage.",
    Component: Controlled,
    markdownName: "Controlled",
  },
  {
    title: "Delay",
    description:
      "Set delay for tooltip to show and hide. Check out code for detail of usage.",
    Component: Delay,
    markdownName: "Delay",
  },
];

export default function Tooltip() {
  return (
    <DemoLayout
      title="Tooltip"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
