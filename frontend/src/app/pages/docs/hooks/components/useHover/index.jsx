import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useHover" },
];

const markdownPath = "docs/hooks/useHover";

const demos = [
  {
    title: "Basic",
    description:
      "Detects if given element is hovered. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseHover() {
  return (
    <DemoLayout
      title="useHover"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
    />
  );
}
