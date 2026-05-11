import { DemoLayout } from "components/docs/demo/DemoLayout";
import { componentProps } from "./props";
import { Basic } from "./Basic";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "Basic" },
];

const demos = [
  {
    title: "Basic",
    description:
      "A demonstration of the basic usage of the Page component, showcasing how to set up the component with a title and content. Check out code for detail of usage.",
    Component: Basic,
  },
];

export default function PageExamples() {
  return (
    <DemoLayout
      title="Page"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
