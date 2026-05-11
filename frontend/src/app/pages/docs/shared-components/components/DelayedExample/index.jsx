import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { componentProps } from "./props";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "Delayed" },
];

const markdownPath = "docs/shared-components/DelayedExample";

const demos = [
  {
    title: "Basic",
    description:
      "This demo showcases the basic usage of the Delayed component, which renders its child after a specified delay. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
];

export default function ApplyWrapperExamples() {
  return (
    <DemoLayout
      title="Delayed"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
