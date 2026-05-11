// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { EllipsisDots } from "./EllipsisDots";
import { Primary } from "./Primary";
import { Scrollable } from "./Scrollable";
import { WithIcon } from "./WithIcon";
import { Advanced } from "./Advanced";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Dropdown" },
];

const markdownPath = "components/dropdown";

const demos = [
  {
    title: "Basic Dropdown",
    description:
      "<a href='https://headlessui.com/react/menu' class='text-primary-600 dark:text-primary-400 hover:underline'>Headless UI</a> Dropdown (Menu) offers an easy way to build custom, accessible dropdown components with robust support for keyboard navigation.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Ellipsis Dots",
    description: "Ellipsis button example. Check out code for detail of usage.",
    Component: EllipsisDots,
  
    markdownName: "EllipsisDots",
  },
  {
    title: "Primary",
    description: "Primary color example. Check out code for detail of usage.",
    Component: Primary,
  
    markdownName: "Primary",
  },
  {
    title: "Scrollable",
    description:
      "Scrollabel dropdown example. Check out code for detail of usage.",
    Component: Scrollable,
  
    markdownName: "Scrollable",
  },
  {
    title: "With Icon",
    description:
      "You can add an icon to dropdown items. Check out code for detail of usage.",
    Component: WithIcon,
  
    markdownName: "WithIcon",
  },
  {
    title: "Advanced",
    description:
      "Advanced Dropdown Example. Check out code for detail of usage.",
    Component: Advanced,
  
    markdownName: "Advanced",
  },
];

export default function Dropdown() {
  return (
    <DemoLayout
      title="Dropdown"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
