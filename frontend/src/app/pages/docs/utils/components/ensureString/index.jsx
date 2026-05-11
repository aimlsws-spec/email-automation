import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "ensureString" },
];

const demos = [
  {
    title: "Usage",
    description:
      "Ensures the input is a string. If the input is <code>null</code> or <code>undefined</code>, returns an empty string.",
    Component: Usage,
  },
];

export default function EnsureString() {
  return (
    <DemoLayout
      title="ensureString"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
