import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "randomId" },
];

const demos = [
  {
    title: "Usage",
    description: "Generates a random identifier string.",
    Component: Usage,  
    markdownName: "Usage",
  },
];

export default function RandomId() {
  return (
    <DemoLayout
      title="randomId"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      returns={returns}
    />
  );
}
