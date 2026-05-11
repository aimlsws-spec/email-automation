import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "formatBytes" },
];

const demos = [
  {
    title: "Usage",
    description: "Converts a number of bytes into a human-readable format (e.g., KB, MB, GB).",
    Component: Usage,
  },
];

export default function FormatBytes() {
  return (
    <DemoLayout
      title="formatBytes"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
