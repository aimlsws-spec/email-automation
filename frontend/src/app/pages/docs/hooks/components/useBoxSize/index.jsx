import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useBoxSize" },
];

const markdownPath = "docs/hooks/useBoxSize";

const demos = [
  {
    title: "Basic",
    description:
      "Explore the basic implementation and usage of the <code>useBoxSize</code> hook. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseBoxSize() {
  return (
    <DemoLayout
      title="useBoxSize"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
      params={params}
    />
  );
}
