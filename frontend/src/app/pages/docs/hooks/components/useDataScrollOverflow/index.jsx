import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useDataScrollOverflow" },
];

const markdownPath = "docs/hooks/useDataScrollOverflow";

const demos = [
  {
    title: "Basic",
    description: "Explore the basic implementation and usage of the <code>useDataScrollOverflow</code> hook. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseDataScrollOverflow() {
  return (
    <DemoLayout
      title="useDataScrollOverflow"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
      params={params}
    />
  );
}
