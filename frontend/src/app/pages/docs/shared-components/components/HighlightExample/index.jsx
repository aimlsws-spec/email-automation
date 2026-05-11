import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { componentProps } from "./props";
import { Custom } from "./Custom";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "Highlight" },
];

const markdownPath = "docs/shared-components/HighlightExample";

const demos = [
  {
    title: "Basic",
    description:
      "This demo shows the basic implementation of the Highlight component, demonstrating how to highlight specific text within content. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Custom",
    description:
      "This demo showcases how to customize the Highlight component for more flexible and tailored text highlighting. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
];

export default function HighlightExamples() {
  return (
    <DemoLayout
      title="Highlight"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
