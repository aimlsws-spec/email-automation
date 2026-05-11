import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "isRouteActive" },
];

const demos = [
  {
    title: "Usage",
    description: "Checks if the given path matches the current pathname/tree.",
    Component: Usage,
  },
];

export default function IsRouteActive() {
  return (
    <DemoLayout
      title="isRouteActive"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
