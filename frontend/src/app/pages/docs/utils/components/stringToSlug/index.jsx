import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "stringToSlug" },
];

const demos = [
  {
    title: "Usage",
    description: "Converts a string into a URL-friendly slug.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function StringToSlug() {
  return (
    <DemoLayout
      title="stringToSlug"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
