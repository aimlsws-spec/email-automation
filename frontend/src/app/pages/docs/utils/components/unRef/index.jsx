import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "unRef" },
];

const demos = [
  {
    title: "Usage",
    description: "Get resolved value ref.",
    Component: Usage,
  },
];

export default function UnRef() {
  return (
    <DemoLayout
      title="unRef"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
