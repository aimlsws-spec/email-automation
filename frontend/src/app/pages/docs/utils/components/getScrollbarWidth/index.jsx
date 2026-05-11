import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "getScrollbarWidth" },
];

const markdownPath = "docs/utils/getScrollbarWidth";

const demos = [
  {
    title: "Usage",
    description:
      "Get current width of scrollbar. Check out code for detail of usage.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function GetScrollbarWidth() {
  return (
    <DemoLayout
      title="getScrollbarWidth"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
    />
  );
}
