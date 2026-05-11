// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { WithLabel } from "./WithLabel";
import { WithDescription } from "./WithDescription";
import { TextareaError } from "./TextareaError";
import { Disabled } from "./Disabled";
import { Polymorphic } from "./Polymorphic";
import { Controlled } from "./Controlled";
import { Append } from "./Append";
import { Prepend } from "./Prepend";
import { AppendPrepend } from "./AppendPrepend";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Textarea" }];

const markdownPath = "forms/textarea";

const demos = [
  {
    title: "Default Textarea",
    description:
      "The <code>Textarea</code> defines a multi-line text input control. The Textarea is often used in a form, to collect user inputs like comments or reviews.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "With Label",
    description:
      "<code>Textarea</code> can have a label. Check out code for detail of usage.",
    Component: WithLabel,
  
    markdownName: "WithLabel",
  },
  {
    title: "With Description",
    description:
      "<code>Textarea</code> can have a description. Check out code for detail of usage.",
    Component: WithDescription,
  
    markdownName: "WithDescription",
  },
  {
    title: "Textarea Error",
    description:
      "<code>Textarea</code> have their own style when have error state. Check out code for detail of usage. ",
    Component: TextareaError,
  
    markdownName: "TextareaError",
  },
  {
    title: "Disabled Textarea",
    description:
      "<code>Textarea</code> have their own style when disabled. Check out code for detail of usage. ",
    Component: Disabled,
  
    markdownName: "Disabled",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Textarea</code> is a polymorphic component, you can change the main element with <code>component</code> prop.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
  {
    title: "Controlled",
    description:
      "<code>Textarea</code> can be controlled. Check out code for detail of usage. ",
    Component: Controlled,
  
    markdownName: "Controlled",
  },
  {
    title: "Prepend Content",
    description:
      "You can add content before <code>Textarea</code>. Check out code for detail of usage. ",
    Component: Prepend,
  
    markdownName: "Prepend",
  },
  {
    title: "Append Content",
    description:
      "You can add content after <code>Textarea</code>. Check out code for detail of usage. ",
    Component: Append,
  
    markdownName: "Append",
  },
  {
    title: "Prepend & Append Content",
    description:
      "You can add content before and after <code>Textarea</code>. Check out code for detail of usage. ",
    Component: AppendPrepend,
  
    markdownName: "AppendPrepend",
  },
];

export default function Textarea() {
  return (
    <DemoLayout
      title="Textarea"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
