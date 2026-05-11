// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Duration } from "./Duration";
import { TimingFunction } from "./TimingFunction";
import { MinWidth } from "./MinWidth";
import { Polymorphic } from "./Polymorphic";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Collapse" },
];

const markdownPath = "components/collapse";

const demos = [
  {
    title: "Basic",
    description:
      "The <code>Collapse</code> component is useful for reducing vertical space with large amounts of information.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Transition Duration",
    description:
      "To set a custom transition duration use <code>transitionDuration</code> prop. Check out code for detail of usage.",
    Component: Duration,
  
    markdownName: "Duration",
  },
  {
    title: "Transition Timing Function",
    description:
      "To set a custom transition timing function use <code>transitionTimingFunction</code> prop. Check out code for detail of usage.",
    Component: TimingFunction,
  
    markdownName: "Duration",
  },
  {
    title: "Min Width",
    description:
      "To set the minimum width of the content, use the <code>min</code> prop. Check out code for detail of usage.",
    Component: MinWidth,
  
    markdownName: "MinWidth",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>  Collapse </code> is a polymorphic component, you can change root element. Check out code for detail of usage.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
];

export default function Collapse() {
  return (
    <DemoLayout
      title="Collapse"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
