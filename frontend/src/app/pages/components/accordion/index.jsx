// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Bordered } from "./Bordered";
import { FullBordered } from "./FullBordered";
import { Separated } from "./Separated";
import { Primary } from "./Primary";
import { Custom } from "./Custom";
import { Advanced } from "./Advanced";
import { Multiple } from "./Multiple";
import { Controlled } from "./Controlled";
import { NoAnimation } from "./NoAnimation";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Accordion" },
];

const markdownPath = "components/accordion";

const demos = [
  {
    title: "Basic Accordion",
    description:
      "The <code>Accordion</code> component allows the user to show and hide sections of related content on a page. Check out code for detail of usage.",
    Component: Basic,

    markdownName: "Basic",
  },
  {
    title: "Bordered Accordion",
    description:
      "<code>Accordion</code> can be bordered. Check out code for detail of usage.",
    Component: Bordered,

    markdownName: "Bordered",
  },
  {
    title: "Full Bordered Accordion",
    description:
      "You can wrap <code>Accordion</code> with border. Check out code for detail of usage.",
    Component: FullBordered,

    markdownName: "FullBordered",
  },
  {
    title: "Separated Accordion",
    description:
      "<code>Accordion</code> can be separated. Check out code for detail of usage.",
    Component: Separated,

    markdownName: "Separated",
  },
  {
    title: "Primary Accordion",
    description:
      "Primary color <code>Accordion</code>.  Check out code for detail of usage.",
    Component: Primary,

    markdownName: "Primary",
  },
  {
    title: "Custom Accordion",
    description:
      "You can also give <code>Accordion</code>  custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,

    markdownName: "Custom",
  },
  {
    title: "Advanced Accordion",
    description:
      "Advanced example <code>Accordion</code> component. Check out code for detail of usage.",
    Component: Advanced,

    markdownName: "Advanced",
  },
  {
    title: "Multiple",
    description:
      "You can open multiple items from the accordion at once. The <code>multiple</code> prop in an accordion component allows you to open multiple items at once instead of just one. Check out code for detail of usage.",
    Component: Multiple,

    markdownName: "Multiple",
  },
  {
    title: "Controlled",
    description:
      "<code>Accordion</code> can be controlled component. Check out code for detail of usage.",
    Component: Controlled,

    markdownName: "Controlled",
  },
  {
    title: "No Transition",
    description:
      "Set <code>transitionDuration={0}</code> to disable transition. Check out code for detail of usage.",
    Component: NoAnimation,

    markdownName: "NoAnimation",
  },
];

export default function Accordion() {
  return (
    <DemoLayout
      title="Accordion"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
