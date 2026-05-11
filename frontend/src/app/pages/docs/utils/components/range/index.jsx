import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "range" },
];

const demos = [
  {
    title: "Usage",
    description: "Generates an array of numbers from start to end (inclusive).",
    Component: Usage,
  },
];

export default function Range() {
  return (
    <DemoLayout
      title="range"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
