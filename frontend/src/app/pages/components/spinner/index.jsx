// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Elastic } from "./Elastic";
import { SoftColor } from "./SoftColor";
import { SoftColorElastic } from "./SoftColorElastic";
import { WithDot } from "./WithDot";
import { SpinnerSizes } from "./SpinnerSizes";
import { NoAnimation } from "./NoAnimation";
import { Disabled } from "./Disabled";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Spinner" },
];

const markdownPath = "components/spinner";

const demos = [
  {
    title: "Default Spinner",
    description:
      "A <code>Spinner</code> component is used to show the user a timely process is currently taking place. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Spinner",
    description:
      "<code>Spinner</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Elastic Spinner",
    description:
      "A Timing function describes how an animation will progress, allowing it to change speed during its course. Check out code for detail of usage.",
    Component: Elastic,
  
    markdownName: "Elastic",
  },
  {
    title: "Soft Color Spinner",
    description: `<code>Spinner</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
  
    markdownName: "SoftColor",
  },
  {
    title: "Soft Color Elastic Spinner",
    description:
      "A Timing function describes how an animation will progress, allowing it to change speed during its course. Check out code for detail of usage.",
    Component: SoftColorElastic,
  
    markdownName: "SoftColorElastic",
  },
  {
    title: "With Inner Dot Spinner",
    description: `<code>Spinner</code> can have a inner dot variant. To do this, set <code>variant="innerDot"</code>. Check out code for detail of usage.`,
    Component: WithDot,
  
    markdownName: "WithDot",
  },
  {
    title: "Spinner Sizes",
    description:
      "<code>Spinner</code> components can have various sizes. Check out code for detail of usage.",
    Component: SpinnerSizes,
  
    markdownName: "SpinnerSizes",
  },
  {
    title: "Stopped Spinner",
    description:
      "Also you can disable animation. Check out code for detail of usage.",
    Component: NoAnimation,
  
    markdownName: "NoAnimation",
  },
  {
    title: "Disabled Spinner",
    description:
      "<code>Spinner</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
];

export default function Spinner() {
  return (
    <DemoLayout
      title="Spinner"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
