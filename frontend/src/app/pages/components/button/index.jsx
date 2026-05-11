// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Rounded } from "./Rounded";
import { SoftColor } from "./SoftColor";
import { Outlined } from "./Outlined";
import { Flat } from "./Flat";
import { Polymorphic } from "./Polymorphic";
import { GlowButton } from "./GlowButton";
import { Gradient } from "./Gradient";
import { OutlinedGradient } from "./OutlinedGradient";
import { WithIcon } from "./WithIcon";
import { OnlyIcon } from "./OnlyIcon";
import { ButtonSize } from "./ButtonSize";
import { ButtonGroup } from "./ButtonGroup";
import { Disabled } from "./Disabled";
import { SoftBordered } from "./SoftBordered";
import { Segment } from "./Segment";
import { Loading } from "./Loading";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Button" },
];

const markdownPath = "components/button";

const demos = [
  {
    title: "Default Button",
    description:
      "A <code>button</code> means an operation (or a series of operations). Clicking a button will trigger corresponding business logic. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Button",
    description:
      "<code>Buttons</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Rounded Button",
    description:
      "<code>Button</code> can have a rounded-sm shape. To do this, you should use the <code>rounded-full</code> utility class. Check out code for detail of usage.",
    Component: Rounded,
  
    markdownName: "Rounded",
  },
  {
    title: "Soft Color Button",
    description: `<code>Button</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
  
    markdownName: "SoftColor",
  },
  {
    title: "Outlined Button",
    description: `<code>Button</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Flat Button",
    description: `<code>Button</code> can be flat. To do this, set <code>variant="flat"</code>. Check out code for detail of usage.`,
    Component: Flat,
  
    markdownName: "Flat",
  },
  {
    title: "Soft Bordered Button",
    description: `<code>Button</code> can have a soft colors and bordered. Check out code for detail of usage.`,
    Component: SoftBordered,
  
    markdownName: "SoftBordered",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Button</code> is a polymorphic component, you can change root element. Check out code for detail of usage.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "Glow Button",
    description: `<code>Button</code> have glow option. To do this, add <code>isGlow</code> prop. Check out code for detail of usage.`,
    Component: GlowButton,
  
    markdownName: "GlowButton",
  },
  {
    title: "Custom Gradient Button",
    description:
      "<code>Buttons</code> can be gradient. Check out code for detail of usage.",
    Component: Gradient,
  
    markdownName: "Gradient",
  },
  {
    title: "Outlined Gradient Button",
    description:
      "<code>Buttons</code> can be outlined gradient. Check out code for detail of usage.",
    Component: OutlinedGradient,
  
    markdownName: "OutlinedGradient",
  },
  {
    title: "Loading Button",
    description:
      "Loading <code>Buttons</code> are buttons that indicate the loading state of a component or page with spinners. Check out code for detail of usage.",
    Component: Loading,
  
    markdownName: "Loading",
  },
  {
    title: "Button with Icon",
    description:
      "<code>Buttons</code> can have an icon. Buttons components work well with <a href='https://react-icons.github.io/react-icons/' class='text-primary-600 dark:text-primary-400 hover:underline'>react-icons</a> and <a href='https://heroicons.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Heroicon</a> Icons. Check out code for detail of usage.",
    Component: WithIcon,
  
    markdownName: "WithIcon",
  },
  {
    title: "Only Icon Button",
    description:
      "<code>Buttons</code> can have only icon. Buttons components work well with <a href='https://react-icons.github.io/react-icons/' class='text-primary-600 dark:text-primary-400 hover:underline'>react-icons</a> and <a href='https://heroicons.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Heroicon</a> Icons. Check out code for detail of usage.",
    Component: OnlyIcon,
  
    markdownName: "OnlyIcon",
  },
  {
    title: "Button Sizes",
    description:
      "<code>Button</code> components can have various sizes. Check out code for detail of usage.",
    Component: ButtonSize,
  
    markdownName: "ButtonSize",
  },
  {
    title: "Button Group",
    description: "Group a series of buttons together on a single line",
    Component: ButtonGroup,
  
    markdownName: "ButtonGroup",
  },
  {
    title: "Segment Buttons",
    description:
      "Segment buttons are groups of related buttons inside of a segment. They are displayed in a horizontal row. A segment button can be selected by default by setting the value of the segment to the value of the segment button. Only one segment button can be selected at a time.",
    Component: Segment,
  
    markdownName: "Segment",
  },
  {
    title: "Disabled Button",
    description:
      "<code>Buttons</code> have their own style when disabled. Check out code for detail of usage.",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
];

export default function Button() {
  return (
    <DemoLayout
      title="Button"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
