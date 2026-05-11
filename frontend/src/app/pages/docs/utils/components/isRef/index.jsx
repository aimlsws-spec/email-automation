import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "isRef" },
];

const demos = [
  {
    title: "Usage",
    description: "Check is variable the ref object or not.",
    Component: Usage,
  },
];

export default function IsRef() {
  return (
    <DemoLayout
      title="isRef"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
