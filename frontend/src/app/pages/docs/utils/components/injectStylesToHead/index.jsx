import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "injectStylesToHead" },
];

const markdownPath = "docs/utils/injectStylesToHead";

const demos = [
  {
    title: "Usage",
    description:
      "Inject custom styles to head. Check out code for detail of usage.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function InjectStylesToHead() {
  return (
    <DemoLayout
      title="injectStylesToHead"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
    />
  );
}
