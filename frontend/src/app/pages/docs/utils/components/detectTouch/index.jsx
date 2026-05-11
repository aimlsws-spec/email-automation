import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "detectTouch" },
];

const markdownPath = "docs/utils/detectTouch";

const demos = [
  {
    title: "Usage",
    description:
      "Detects the device is touchable based on the user agent string. Check out code for detail of usage.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function DetectTouch() {
  return (
    <DemoLayout
      title="detectTouch"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
    />
  );
}
