// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Reset } from "./Reset";
import { InputView } from "./InputView";
import { Preview } from "./Preview";
import { Multiple } from "./Multiple";
import { Dropzone } from "./Dropzone";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/forms" },
  { title: "File Upload" },
];

const markdownPath = "forms/file-upload";

const demos = [
  {
    title: "Basic File Upload",
    description:
      "<code>Upload</code> component allow you to capture files from user.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Reset File Upload",
    description:
      "You can clear files from the upload component. Check out code for detail of usage.",
    Component: Reset,
  
    markdownName: "Reset",
  },
  {
    title: "Input View Upload",
    description:
      "You can mix an <code>Input</code> component with <code>Upload</code> component. Check out code for detail of usage.",
    Component: InputView,
  
    markdownName: "InputView",
  },
  {
    title: "File Preview",
    description: "File preview upload.",
    Component: Preview,
  
    markdownName: "Preview",
  },
  {
    title: "Multiple Upload",
    description: "Multiple file preview upload",
    Component: Multiple,
  
    markdownName: "Multiple",
  },
  {
    title: "Dropzone",
    description:
      "You can make a dropzone component by using <code>Upload</code> component and <code>useDropzone</code> hook",
    Component: Dropzone,
  
    markdownName: "Dropzone",
  },
];

export default function FileUpload() {
  return (
    <DemoLayout
      title="File Upload"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
