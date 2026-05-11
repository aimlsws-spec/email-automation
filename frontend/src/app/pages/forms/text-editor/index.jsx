// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Controlled } from "./Controlled";
import { Modules } from "./Modules";
import { MinMaxHeight } from "./MinMaxHeight";
import { Error } from "./Error";
import { Instance } from "./Instance";
import { ConvertHtmlToDelta } from "./ConvertHtmlToDelta";
import { WithLabel } from "./WithLabel";
import { ExternalModule } from "./ExternalModule";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/forms" },
  { title: "Text Editor" },
];

const markdownPath = "forms/text-editor";

const demos = [
  {
    title: "Basic Texteditor",
    description:
      "<a href='https://quilljs.com/' class='text-primary-600 dark:text-primary-400 hover:underline'>Quill.js</a> is a free, open source WYSIWYG editor built for the modern web. It is a rich text editor designed for compatibility and extensibility.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "With Label Texteditor",
    description:
      "Can set a label for the text editor using the <code>label</code> prop. Check out code for detail of usage.",
    Component: WithLabel,
    markdownName: "WithLabel",
  },
  {
    title: "Controlled Texteditor",
    description:
      "Quill manages changes internally and does not allow preventing edits. The TextEditor uses a hybrid approach between controlled and uncontrolled mode, where it overrides content whenever the value differs from the current state. Check out code for detail of usage.",
    Component: Controlled,
    markdownName: "Controlled",
  },
  {
    title: "Custom Modules",
    description:
      "Cusomize the modules available in the toolbar using the <code>modules</code> prop. Check out code for detail of usage.",
    Component: Modules,
    markdownName: "Modules",
  },
  {
    title: "With Min & Max Height",
    description:
      "Set maximum and minimum height for the text editor using Tailwind CSS utility class names. Check out code for detail of usage.",
    Component: MinMaxHeight,
    markdownName: "MinMaxHeight",
  },
  {
    title: "Error State",
    description:
      "Add <code>error</code> prop to set error state. Check out code for detail of usage.",
    Component: Error,
    markdownName: "Error",
  },
  {
    title: "Access Quill Instance",
    description:
      "Access the Quill instance using the <code>getQuillInstance</code> method in a ref. Check out code for detail of usage.",
    Component: Instance,
    markdownName: "Instance",
  },
  {
    title: "External Module",
    description:
      "Add third-party Quill plugins and modules. Check out code for detail of usage.",
    Component: ExternalModule,
    markdownName: "ExternalModule",
  },
  {
    title: "Convert HTML to Quill Delta",
    description:
      "Convert HTML to a Quill delta object using <code>htmlToDelta</code>. Check out code for detail of usage.",
    Component: ConvertHtmlToDelta,
    markdownName: "ConvertHtmlToDelta",
  },
];

export default function TextEditor() {
  return (
    <DemoLayout
      title="Text Editor"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
