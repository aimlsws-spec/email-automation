// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { WithLineSpace } from "./WithLineSpace";
import { Outlined } from "./Outlined";
import { ActiveItem } from "./ActiveItem";
import { Advanced } from "./Advanced";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Timeline" },
];

const markdownPath = "components/timeline";

const demos = [
  {
    title: "Timeline",
    description:
      "The <code>Timeline</code> component is useful for stylistically displaying chronological information.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "With Line Space",
    description:
      "Steps can have line space. To do this, add <code>lineSpace</code> prop in root. Check out code for detail of usage.",
    Component: WithLineSpace,
  
    markdownName: "WithLineSpace",
  },
  {
    title: "Outlined",
    description: `Steps can be outlined. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "ActiveItem",
    description:
      "Step can have the ping animation. Check out code for detail of usage.",
    Component: ActiveItem,
  
    markdownName: "ActiveItem",
  },
  {
    title: "Advanced",
    description: "Advaned Step Example. Check out code for detail of usage.",
    Component: Advanced,
  
    markdownName: "Advanced",
  },
];

export default function Timeline() {
  return (
    <DemoLayout
      title="Timeline"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
