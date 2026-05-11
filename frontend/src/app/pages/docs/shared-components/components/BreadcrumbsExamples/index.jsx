import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { componentProps } from "./props";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "Breadcrumbs" },
];

const markdownPath = "docs/shared-components/BreadcrumbsExamples";

const demos = [
  {
    title: "Breadcrumbs",
    description:
      "Explore the custom breadcrumb component and view the code for detailed implementation and usage instructions.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function BreadcrumbsExamples() {
  return (
    <DemoLayout
      title="Breadcrumbs"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
