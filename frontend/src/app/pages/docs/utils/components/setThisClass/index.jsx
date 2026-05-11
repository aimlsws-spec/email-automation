import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "setThisClass" },
];

const demos = [
  {
    title: "Usage",
    description: "Returns the class name for the specified color. <code>(primary, secondary, info, success, warning, error)</code>",
    Component: Usage,
  },
];

export default function SetThisClass() {
  return (
    <DemoLayout
      title="setThisClass"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
