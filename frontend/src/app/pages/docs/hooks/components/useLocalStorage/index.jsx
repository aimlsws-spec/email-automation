import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useLocalStorage" },
];

const markdownPath = "docs/hooks/useLocalStorage";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useLocalStorage</code> allows using value from the localStorage as react state. The hook works the same way as <code>useState</code>, but also writes the value to the localStorage",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseLocalStorage() {
  return (
    <DemoLayout
      title="useLocalStorage"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
