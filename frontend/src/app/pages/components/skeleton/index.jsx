// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { CustomColor } from "./CustomColor";
import { Default } from "./Default";
import { NoAnimation } from "./NoAnimation";
import { PulseAnimation } from "./PulseAnimation";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Skeleton" },
];

const markdownPath = "components/skeleton";

const demos = [
  {
    title: "Default Skeleton",
    description:
      "<code>Skeleton</code> component provide a placeholder while you wait for content to load, or to visualize content that doesn't exist yet.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Skeleton",
    description:
      "Various shapes can be made using the <code>Skeleton</code> component. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Custom Wave Color Skeleton",
    description:
      "The color of <code>Skeleton</code> and wave can be customized. Check out code for detail of usage.",
    Component: CustomColor,
  
    markdownName: "CustomColor",
  },
  {
    title: "Disable Animation",
    description:
      "Set <code>animate={false}</code> to disable animation. Check out code for detail of usage.",
    Component: NoAnimation,
  
    markdownName: "NoAnimation",
  },
  {
    title: "Pulse Animation Skeleton",
    description:
      "<code>animate-pulse</code> tailwind utility class can be used to make <code>Skeleton</code> Check out code for detail of usage.",
    Component: PulseAnimation,
  
    markdownName: "PulseAnimation",
  },
];

export default function Legend() {
  return (
    <DemoLayout
      title="Skeleton"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
