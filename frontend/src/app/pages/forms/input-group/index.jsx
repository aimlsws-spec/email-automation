// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Prepend } from "./Prepend";
import { Append } from "./Append";
import { Between } from "./Between";
import { Filled } from "./Filled";
import { Advanced } from "./Advanced";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Input" }];

const markdownPath = "forms/input-group";

const demos = [
  {
    title: "Prepend Addon",
    description:
      "<code>Input</code> can have prepend addon. Check out code for detail of usage.",
    Component: Prepend,
    markdownName: "Prepend",
  },
  {
    title: "Append Addon",
    description:
      "<code>Input</code> can have append addon. Check out code for detail of usage.",
    Component: Append,
    markdownName: "Append",
  },
  {
    title: "Input Between Addon",
    description:
      "<code>Input</code> can be in between addons. Check out code for detail of usage.",
    Component: Between,
    markdownName: "Between",
  },
  {
    title: "Filled Addon",
    description: "Addon can be filled. Check out code for detail of usage.",
    Component: Filled,
    markdownName: "Filled",
  },
  {
    title: "Advanced Addon",
    description:
      "More Input Addon examples. Check out code for detail of usage",
    Component: Advanced,
    markdownName: "Advanced",
  },
];

export default function InputGroup() {
  return (
    <DemoLayout
      title="Input Group"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
