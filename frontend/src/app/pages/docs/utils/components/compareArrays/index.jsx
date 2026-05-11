import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "compareArrays" },
];

const demos = [
  {
    title: "Usage",
    description: "Compares two arrays deeply to check if they are identical.",
    Component: Usage,
  },
];

export default function CompareArrays() {
  return (
    <DemoLayout
      title="compareArrays"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
