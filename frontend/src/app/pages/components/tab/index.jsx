// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { WithIcon } from "./WithIcon";
import { Boxed } from "./Boxed";
import { BoxedWithIcon } from "./BoxedWithIcon";
import { Controlled } from "./Controlled";
import { ShiftLeftAnimation } from "./ShiftLeftAnimation";
import { ShiftUpAnimation } from "./ShiftUpAnimation";
// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Tab" },
];

const markdownPath = "components/tab";

const demos = [
  {
    title: "Basic",
    description:
      "<a href='https://headlessui.com/react/tabs' class='text-primary-600 dark:text-primary-400 hover:underline'>Headless UI</a> provides a headless Tab component that allows you to easily create accessible, fully customizable tab interfaces with robust focus management and keyboard navigation support.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "With Icon",
    description: "Tabs with icon. Check out code for detail of usage.",
    Component: WithIcon,
    markdownName: "WithIcon",
  },
  {
    title: "Boxed Tabs",
    description: "Tabs can be boxed. Check out code for detail of usage.",
    Component: Boxed,
    markdownName: "Boxed",
  },
  {
    title: "Boxed With Icon",
    description:
      "Boxed tabs with icon exapmle. Check out code for detail of usage.",
    Component: BoxedWithIcon,
    markdownName: "BoxedWithIcon",
  },
  {
    title: "Controlled",
    description: "Tabs can be controlled. Check out code for detail of usage.",
    Component: Controlled,
    markdownName: "Controlled",
  },
  {
    title: "Shift To Left Animation",
    description:
      "Custom Shift to left animation. Check out code for detail of usage.",
    Component: ShiftLeftAnimation,
    markdownName: "ShiftLeftAnimation",
  },
  {
    title: "Shift To Up Animation",
    description:
      "Custom Shift to Up animation. Check out code for detail of usage.",
    Component: ShiftUpAnimation,
    markdownName: "ShiftUpAnimation",
  },
];

export default function Tabs() {
  return (
    <DemoLayout
      title="Tab"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
