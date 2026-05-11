// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { WithLabel } from "./WithLabel";
import { WithDescription } from "./WithDescription";
import { SelectSizes } from "./SelectSizes";
import { SelectError } from "./SelectError";
import { Disabled } from "./Disabled";
import { Custom } from "./Custom";
import { DataProp } from "./DataProp";
import { SuffixPrefix } from "./SuffixPrefix";
import { Multiple } from "./Multiple";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Select" }];

const markdownPath = "forms/select";

const demos = [
  {
    title: "Default Select",
    description:
      "The <code>select</code> HTML element represents a control that provides a menu of options. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Data Prop",
    description:
      "Pass options as <code>data</code> prop. Check out code for detail of usage.",
    Component: DataProp,
  
    markdownName: "DataProp",
  },
  {
    title: "With Label",
    description:
      "<code>Select</code> can have a label. Check out code for detail of usage.",
    Component: WithLabel,
  
    markdownName: "WithLabel",
  },
  {
    title: "With Description",
    description:
      "<code>Select</code> can have a description. Check out code for detail of usage.",
    Component: WithDescription,
  
    markdownName: "WithDescription",
  },
  {
    title: "Suffix & Prefix",
    description:
      "<code>Select</code> components can have prefix and suffix. Check out code for detail of usage.",
    Component: SuffixPrefix,
  
    markdownName: "SuffixPrefix",
  },
  {
    title: "Multiple Sizes",
    description:
      "The <code>multiple</code> prop indicates that multiple options can be selected in the list. Check out code for detail of usage.",
    Component: Multiple,
  
    markdownName: "Multiple",
  },
  {
    title: "Select Sizes",
    description:
      "<code>Select</code> components can have various sizes. Check out code for detail of usage.",
    Component: SelectSizes,
  
    markdownName: "SelectSizes",
  },
  {
    title: "Select Error",
    description:
      "<code>Select</code> have their own style when have error state. Check out code for detail of usage. ",
    Component: SelectError,
  
    markdownName: "SelectError",
  },
  {
    title: "Disabled Select",
    description:
      "<code>Select</code> have their own style when disabled. Check out code for detail of usage. ",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
  {
    title: "Custom Select",
    description:
      "You can also give <code>Select</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
];

export default function Select() {
  return (
    <DemoLayout
      title="Select"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
