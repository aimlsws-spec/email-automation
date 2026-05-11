// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Bordered } from "./Bordered";
import { Hoverable } from "./Hoverable";
import { Zebra } from "./Zebra";
import { Dense } from "./Dense";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Tables", path: "/tables" },
  { title: "Basic Table" },
];

const markdownPath = "tables/basic-table";

const demos = [
  {
    title: "Basic Table",
    description:
      "A simple table layout that displays data in an easily scannable format. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Bordered",
    description:
      "Customize the table with borders using utility classes. Check out code for detail of usage.",
    Component: Bordered,
    markdownName: "Bordered",
  },
  {
    title: "Hoverable",
    description:
      "Enable row hover effects by adding the <code>hoverable</code> prop. Check out code for detail of usage.",
    Component: Hoverable,
    markdownName: "Hoverable",
  },
  {
    title: "Zebra",
    description:
      "Apply alternating row colors (zebra striping) with the <code>zebra</code> prop. Check out code for detail of usage.",
    Component: Zebra,
    markdownName: "Zebra",
  },
  {
    title: "Dense",
    description:
      "Create a compact table layout by using the <code>dense</code> prop. RCheck out code for detail of usage.",
    Component: Dense,
    markdownName: "Dense",
  },
];

export default function BasicTable() {
  return (
    <DemoLayout
      title="Basic Table"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
