import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "htmlToDelta" },
];

const demos = [
  {
    title: "Usage",
    description: "Converts an HTML string to a Quill Delta object.",
    Component: Usage,
  },
];

export default function HtmlToDelta() {
  return (
    <DemoLayout
      title="htmlToDelta"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
