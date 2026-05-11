// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { WithLabel } from "./WithLabel";
import { WithDescription } from "./WithDescription";
import { InputSizes } from "./InputSizes";
import { InputError } from "./InputError";
import { Disabled } from "./Disabled";
import { Polymorphic } from "./Polymorphic";
import { Prefix } from "./Prefix";
import { Suffix } from "./Suffix";
import { Password } from "./Password";
import { Search } from "./Search";
import { Custom } from "./Custom";
import { Controlled } from "./Controlled";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Input" }];

const markdownPath = "forms/input";

const demos = [
  {
    title: "Default Input",
    description:
      "<code>Input</code> is a basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "With Label",
    description:
      "<code>Input</code> can have a label. Check out code for detail of usage.",
    Component: WithLabel,
  
    markdownName: "WithLabel",
  },
  {
    title: "With Description",
    description:
      "<code>Input</code> can have a description. Check out code for detail of usage.",
    Component: WithDescription,
  
    markdownName: "WithDescription",
  },
  {
    title: "Input Sizes",
    description:
      "<code>Input</code> components can have various sizes. Check out code for detail of usage.",
    Component: InputSizes,
  
    markdownName: "InputSizes",
  },
  {
    title: "Input Error",
    description:
      "<code>Input</code> have their own style when have error state. Check out code for detail of usage. ",
    Component: InputError,
  
    markdownName: "InputError",
  },
  {
    title: "Disabled Input",
    description:
      "<code>Input</code> have their own style when disabled. Check out code for detail of usage. ",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Input</code> is a polymorphic component, you can change the main element with <code>component</code> prop.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "Controlled",
    description:
      "<code>Input</code> can be controlled. Check out code for detail of usage. ",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Prefix Input",
    description:
      "<code>Input</code> can have a prefix, you can add the prefix with <code>preifx</code> prop. Check out code for detail of usage.",
    Component: Prefix,
  
    markdownName: "Prefix",
  },
  {
    title: "Suffix Input",
    description:
      "<code>Input</code> can have a suffix, you can add the suffix with <code>suffix</code> prop. Check out code for detail of usage.",
    Component: Suffix,
  
    markdownName: "Suffix",
  },
  {
    title: "Password Input",
    description:
      "Use Password Input when you need to capture password from user. Component provides option to toggle password visibility. Check out code for detail of usage.",
    Component: Password,
  
    markdownName: "Password",
  },
  {
    title: "Search Input",
    description:
      "Search Input of type search are text fields designed for the user to enter search queries into. Check out code for detail of usage.",
    Component: Search,
  
    markdownName: "Search",
  },
  {
    title: "Custom Input",
    description:
      "You can also give <code>Input</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
];

export default function Input() {
  return (
    <DemoLayout
      title="Input"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
