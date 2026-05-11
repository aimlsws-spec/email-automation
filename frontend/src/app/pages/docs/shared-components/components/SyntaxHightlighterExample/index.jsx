import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "SyntaxHightlighter" },
];

const markdownPath = "docs/shared-components/SyntaxHightlighterExample";

const demos = [
  {
    title: "Syntax Hightlighter",
    description:
      "Syntax Hightlighter component for highlight code. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
];

export default function SyntaxHightlighterExample() {
  return (
    <DemoLayout
      title="SyntaxHightlighter"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
    />
  );
}
