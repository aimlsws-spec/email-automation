// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Filled } from "./Filled";
import { NotBordered } from "./NotBordered";
import { Twogrid } from "./Twogrid";
import { ResponsiveGrid } from "./ResponsiveGrid";
import { Circle } from "./Circle";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Filepond" }];

const markdownPath = "forms/filepond";

const demos = [
  {
    title: "Basic Filepond",
    description:
      "<a href='https://github.com/pqina/react-filepond' class='text-primary-600 dark:text-primary-400 hover:underline'>React FilePond</a> is a handy wrapper component for FilePond, a JavaScript library that can upload anything you throw at it, optimizes images for faster uploads, and offers a great, accessible, silky smooth user experience.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Filled Filepond",
    description:
      "<code>Filepond</code> can be filled. Check out code for detail of usage.",
    Component: Filled,
  
    markdownName: "Filled",
  },
  {
    title: "Filepond Without Border",
    description:
      "<code>Filepond</code> can be without border. Check out code for detail of usage.",
    Component: NotBordered,
  
    markdownName: "NotBordered",
  },
  {
    title: "Two Grid",
    description:
      "Use the <code>grid</code> prop to set the file count in one row. Check out code for detail of usage.",
    Component: Twogrid,
  
    markdownName: "Twogrid",
  },
  {
    title: "Responsive Grid",
    description:
      "<code>grid</code> can be dynamic count. Check out code for detail of usage.",
    Component: ResponsiveGrid,
  
    markdownName: "ResponsiveGrid",
  },
  {
    title: "Circle Filepond",
    description:
      "<code>Filepond</code> can have circle shape. Check out code for detail of usage.",
    Component: Circle,
  
    markdownName: "Circle",
  },
];

export default function Filepond() {
  return (
    <DemoLayout
      title="Filepond"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
