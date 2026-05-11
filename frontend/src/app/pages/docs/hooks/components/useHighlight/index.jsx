import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useHighlight" },
];

const markdownPath = "docs/hooks/useHighlight";

const demos = [
  {
    title: "Basic",
    description:
      "Used to highlight substrings of a text. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
];

export default function UseHighlight() {
  return (
    <DemoLayout
      title="useHighlight"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
