import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "isServer" },
];

const demos = [
  {
    title: "Usage",
    description: "Checks if the code is running on the server side.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function IsServer() {
  return (
    <DemoLayout
      title="isServer"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      returns={returns}
    />
  );
}
