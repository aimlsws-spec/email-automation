// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { WithEdges } from "./WithEdges";
import { Siblings } from "./Siblings";
import { Boundaries } from "./Boundaries";
import { Rounded } from "./Rounded";
import { Controlled } from "./Controlled";
import { Sizes } from "./Sizes";
import { Polymorphic } from "./Polymorphic";
import { Disabled } from "./Disabled";
import { Custom } from "./Custom";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Pagination" },
];

const markdownPath = "components/pagination";

const demos = [
  {
    title: "Pagination",
    description:
      "The <code>Pagintaion</code> component is used to separate long sets of data so that it is easier for a user to consume information. Depending on the length provided, the pagination component will automatically scale.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "With Edges",
    description:
      "<code>Pagintaion</code> can have ‘go to first page’ and ‘go to last page’ buttons. Check out code for detail of usage.",
    Component: WithEdges,
  
    markdownName: "WithEdges",
  },
  {
    title: "Sibling Count",
    description:
      "To set a custom count of sibling acitve item use <code>siblings</code> prop. Check out code for detail of usage.",
    Component: Siblings,
  
    markdownName: "Siblings",
  },
  {
    title: "Boundaries Count",
    description:
      "To set the number of items displayed after previous and before next buttons use <code>boundaries</code> prop",
    Component: Boundaries,
  
    markdownName: "Boundaries",
  },
  {
    title: "Rounded Pagination",
    description:
      "<code>Pagintaion</code> items can have rounded-sm shape. Check out code for detail of usage.",
    Component: Rounded,
  
    markdownName: "Rounded",
  },
  {
    title: "Controlled Pagination",
    description:
      "<code>Pagintaion</code> can be controlled. Check out code for detail of usage.",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Sizes Pagination",
    description:
      "<code>Pagintaion</code> components can have various sizes. Check out code for detail of usage.",
    Component: Sizes,
  
    markdownName: "Sizes",
  },
  {
    title: "Customize",
    description:
      "You can also give <code>Pagintaion</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Pagintaion</code> is a polymorphic component, you can change root element. Check out code for detail of usage.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "Disabled",
    description:
      "<code>Pagintaion</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
];

export default function Pagination() {
  return (
    <DemoLayout
      title="Pagination"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
