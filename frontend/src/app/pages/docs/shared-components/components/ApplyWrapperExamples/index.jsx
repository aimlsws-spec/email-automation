import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { componentProps } from "./props";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "ApplyWrapper" },
];

const markdownPath = "docs/shared-components/ApplyWrapperExamples";

const demos = [
  {
    title: "Basic",
    description:
      "Conditionally wraps an element with a specified wrapper component. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function ApplyWrapperExamples() {
  return (
    <DemoLayout
      title="ApplyWrapper"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
