// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Advanced } from "./Advanced";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Treeview" },
];

const markdownPath = "components/treeview";

const demos = [
  {
    title: "Basic",
    description:
      "Treeview component is a widget that presents a hierarchical list of items in a tree-like structure. It is useful for displaying large amounts of nested data.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Advanced",
    description:
      "Treeview component is a widget that presents a hierarchical list of items in a tree-like structure. It is useful for displaying large amounts of nested data.",
    Component: Advanced,
    markdownName: "Advanced",
  },
];

export default function Treeview() {
  return (
    <DemoLayout
      title="Treeview"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
