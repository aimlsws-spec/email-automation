import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "triggerPostMoveFlash" },
];

const demos = [
  {
    title: "Usage",
    description: "Adding visual flourish to drag and drop experiences.",
    Component: Usage,
  },
];

export default function TriggerPostMoveFlash() {
  return (
    <DemoLayout
      title="triggerPostMoveFlash"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
    />
  );
}
