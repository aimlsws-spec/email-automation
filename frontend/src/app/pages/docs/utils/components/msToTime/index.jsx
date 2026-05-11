import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "msToTime" },
];

const demos = [
  {
    title: "Usage",
    description: "The time in milliseconds to convert.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function MsToTime() {
  return (
    <DemoLayout
      title="msToTime"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
