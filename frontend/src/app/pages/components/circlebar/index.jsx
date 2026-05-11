// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Default } from "./Default";
import { SoftColor } from "./SoftColor";
import { SquareLinecap } from "./SquareLinecap";
import { Active } from "./Active";
import { Indeterminate } from "./Indeterminate";
import { OffsetDegree } from "./OffsetDegree";
import { GapDegree } from "./GapDegree";
import { CirclebarSize } from "./CirclebarSize";
import { StrokeSize } from "./StrokeSize";
import { Customizer } from "./Customizer";
import { Custom } from "./Custom";
import { componentProps } from "./props";
import { Gradient } from "./Gradient";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Circlebar" },
];

const markdownPath = "components/circlebar";

const demos = [
  {
    title: "Default Circlebar",
    description:
      "The <code>Circlebar</code> component is used to convey data circularly to users. It also can be put into an indeterminate state to portray loading.",
    Component: Default,
    markdownName: "Default",
  },
  {
    title: "Basic Circlebar",
    description:
      "<code>Circlebar</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Square Linecap",
    description:
      "<code>Circlebar</code> can have square linecap stroke. Check out code for detail of usage.",
    Component: SquareLinecap,
    markdownName: "SquareLinecap",
  },
  {
    title: "Soft Color Circlebar",
    description: `<code>Circlebar</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
    markdownName: "SoftColor",
  },
  {
    title: "Gradient Color Circlebar",
    description: `<code>Circlebar</code> can have a gradient colors. To do this, set <code>variant="gradient"</code>. Check out code for detail of usage.`,
    Component: Gradient,
    markdownName: "Gradient",
  },
  {
    title: "Active State",
    description: `<code>Circlebar</code> can be active. To do this, set <code>isActive={true}</code>. Check out code for detail of usage.`,
    Component: Active,
    markdownName: "Active",
  },
  {
    title: "Indeterminate State",
    description: `<code>Circlebar</code> can be indeterminate. To do this, set <code>isIndeterminate={true}</code>. Check out code for detail of usage.`,
    Component: Indeterminate,
    markdownName: "Indeterminate",
  },
  {
    title: "Custom OffsetDegree",
    description:
      "<code>Circlebar</code> progress can have <code>offsetDegree</code>. Check out code for detail of usage.",
    Component: OffsetDegree,
    markdownName: "OffsetDegree",
  },
  {
    title: "Custom GapDegree",
    description:
      "<code>Circlebar</code> progress can have <code> gapDegree</code>. Check out code for detail of usage.",
    Component: GapDegree,
    markdownName: "OffsetDegree",
  },
  {
    title: "Circlebar Size",
    description:
      "<code>Circlebar</code> components can have various sizes. Check out code for detail of usage.",
    Component: CirclebarSize,
    markdownName: "CirclebarSize",
  },
  {
    title: "Stroke Size",
    description:
      "<code>Circlebar</code> components can have custom <code>strokeWidth</code> sizes. Check out code for detail of usage.",
    Component: StrokeSize,
    markdownName: "StrokeSize",
  },
  {
    title: "Customizer",
    Component: Customizer,
    markdownName: "Customizer",
  },
  {
    title: "Custom",
    description:
      "You can also give <code>Circlebar</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
    markdownName: "Custom",
  },
];

export default function Circlebar() {
  return (
    <DemoLayout
      title="Circlebar"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
