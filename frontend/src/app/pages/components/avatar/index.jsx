// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { ActiveIndicator } from "./ActiveIndicator";
import { AutoColor } from "./AutoColor";
import { AvatarGroup } from "./AvatarGroup";
import { Basic } from "./Basic";
import { BasicInitial } from "./BasicInitial";
import { ColoredIndicator } from "./ColoredIndicator";
import { CustomStyles } from "./CustomStyles";
import { Default } from "./Default";
import { GradientBorder } from "./GradientBorder";
import { IndicatorPosition } from "./IndicatorPosition";
import { InitialSoft } from "./InitialSoft";
import { InitialSoftBordered } from "./InitialSoftBordered";
import { Polymorphic } from "./Polymorphic";
import { Skeleton } from "./Skeleton";
import { Square } from "./Square";
import { Squircle } from "./Squircle";
import { WithIndicator } from "./WithIndicator";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Avatar" },
];

const markdownPath = "components/avatar";

const demos = [
  {
    title: "Default Avatar",
    description:
      "The <code>Avatar</code> component creates a scalable, colorable element that can have text, icon or image within its shape. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Avatar",
    description:
      "<code>Avatar</code> can come in different sizes depending on the platform or application. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Square Avatar",
    description:
      "<code>Avatar</code> can have a square shape. To do this, you should use the <code>rounded-lg</code/> utility class. Check out code for detail of usage.      ",
    Component: Square,
  
    markdownName: "Square",
  },
  {
    title: "Squircle Avatar (Mask)",
    description:
      "<code>Avatar</code> can have a squircle shape. To do this, you should use the <code>mask is-squircle</code> classes. Check out code for detail of usage.",
    Component: Squircle,
  
    markdownName: "Squircle",
  },
  {
    title: "Basic Initial",
    description:
      "In the absence of a image, you can use the initial. Initials can be used in various variants. Check out code for detail of usage.",
    Component: BasicInitial,
  
    markdownName: "BasicInitial",
  },
  {
    title: "Initial Soft",
    description: `Initial <code>Avatar</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: InitialSoft,
  
    markdownName: "InitialSoft",
  },
  {
    title: "Initial Soft Bordered",
    description:
      "Initial <code>Avatar</code> can have a border. Check out code for detail of usage.",
    Component: InitialSoftBordered,
  
    markdownName: "InitialSoftBordered",
  },
  {
    title: "Avatar With Indicator",
    description:
      "<code>Avatar</code> can be a dot indicator attached to it. It can be used to indicate the user status. Check out code for detail of usage.",
    Component: WithIndicator,
  
    markdownName: "WithIndicator",
  },
  {
    title: "Colored Indicators",
    description:
      "<code>Avatar</code> dots can be used in various colors. It can be used to indicate the user status. Check out code for detail of usage.",
    Component: ColoredIndicator,
  
    markdownName: "ColoredIndicator",
  },
  {
    title: "Active Indicator",
    description:
      "<code>Avatar</code> dots can have the ping animation. This can be used to indicate an important message. Check out code for detail of usage.",
    Component: ActiveIndicator,
  
    markdownName: "ActiveIndicator",
  },
  {
    title: "Indicator Position",
    description:
      "<code>Avatar</code> dot position can be up, down, left and right. Check out code for detail of usage.",
    Component: IndicatorPosition,
  
    markdownName: "IndicatorPosition",
  },
  {
    title: "Avatar Group",
    description:
      "The <code>Avatar</code> group renders its children as a stack. Check out code for detail of usage.",
    Component: AvatarGroup,
  
    markdownName: "AvatarGroup",
  },
  {
    title: "Gradient Border",
    description:
      "Border <code>Avatar</code> can be gradient colors. Check out code for detail of usage.",
    Component: GradientBorder,
  
    markdownName: "GradientBorder",
  },
  {
    title: "Custom Styles",
    description:
      "You can also give <code>Avatar</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: CustomStyles,
  
    markdownName: "CustomStyles",
  },
  {
    title: "Avatar Skeleton Group",
    description:
      "It can also be created using skeleton <code>Avatar</code> component. Check out code for detail of usage.",
    Component: Skeleton,
  
    markdownName: "Skeleton",
  },
  {
    title: "Polymorphic Rendering ",
    description:
      "<code>Avatar</code> is a polymorphic component, you can change root element. Check out code for detail of usage.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "AutoColor Avatar",
    description:
      "<code>Avatar</code> component can get auto color for inital avatars. Check out code for detail of usage.",
    Component: AutoColor,
  
    markdownName: "AutoColor",
  },
];

export default function Avatar() {
  return (
    <DemoLayout
      title="Avatar"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
