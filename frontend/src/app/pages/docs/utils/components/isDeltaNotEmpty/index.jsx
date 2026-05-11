import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "isDeltaNotEmpty" },
];

const demos = [
  {
    title: "Usage",
    description: "Checks if a Quill Delta object is not empty.",
    Component: Usage,
  },
];

export default function IsDeltaNotEmpty() {
  return (
    <DemoLayout
      title="isDeltaNotEmpty"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
