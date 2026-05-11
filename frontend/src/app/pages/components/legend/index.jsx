// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { SoftColor } from "./SoftColor";
import { Outlined } from "./Outlined";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Legend" },
];

const markdownPath = "components/legend";

const demos = [
  {
    title: "Basic Legend",
    description:
      "Legend Indicator to enhance clarity and explain the meaning of colors for charts, graphs, maps, dashboards, calendar events and statuses.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Outlined Legend",
    description: "Legends can be styled with a border",
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Soft Color Legend",
    description:
      "Legends can be styled with a soft color for a more subtle and refined appearance",
    Component: SoftColor,
  
    markdownName: "SoftColor",
  },
];

export default function Legend() {
  return (
    <DemoLayout
      title="Legend"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
