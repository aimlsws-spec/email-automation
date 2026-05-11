// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Advanced } from "./Advanced";
import { Links } from "./Links";
import { Forms } from "./Forms";
import { Filter } from "./Filter";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Popover" },
];

const markdownPath = "components/popover";

const demos = [
  {
    title: "Basic Popover",
    description:
      "<a href='https://headlessui.com/react/popover' class='text-primary-600 dark:text-primary-400 hover:underline'>Headless UI</a> Popovers are perfect for floating panels with arbitrary content like navigation menus, mobile menus and flyout menus.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Advanced Popover",
    description:
      "Advanced popover example. Check out code for detail of usage.",
    Component: Advanced,
  
    markdownName: "Advanced",
  },
  {
    title: "Links Popover",
    description:
      "Custom onboarding links example. Check out code for detail of usage.",
    Component: Links,
  
    markdownName: "Links",
  },
  {
    title: "Form Popover",
    description: "Form contain example. Check out code for detail of usage.",
    Component: Forms,
  
    markdownName: "Forms",
  },
  {
    title: "Filter Popover",
    description: "Filter contain example. Check out code for detail of usage.",
    Component: Filter,
  
    markdownName: "Filter",
  },
];

export default function Popovers() {
  return (
    <DemoLayout
      title="Popover"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
