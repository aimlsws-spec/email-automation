import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { componentProps } from "./props";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Shared Components", path: "/docs/shared-components" },
  { title: "PreviewImage" },
];

const markdownPath = "docs/shared-components/PreviewImageExample";

const demos = [
  {
    title: "Basic",
    description:
      "A demonstration of the basic implementation of the <code>PreviewImage</code> component. It display an image preview with a fallback source if no file is provided. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function PreviewImageExamples() {
  return (
    <DemoLayout
      title="PreviewImage"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      componentProps={componentProps}
    />
  );
}
