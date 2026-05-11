import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "formatNumber" },
];

const demos = [
  {
    title: "Usage",
    description:
      "Converts a number into a simpler format (e.g.10k, 11.1M, 141.1k, 125).",
    Component: Usage,
  },
];

export default function FormatNumber() {
  return (
    <DemoLayout
      title="formatNumber"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
