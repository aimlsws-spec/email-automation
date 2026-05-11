import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useBoxPosition" },
];

const markdownPath = "docs/hooks/useBoxPosition";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useBoxPosition</code> is a hook to observe the position of a DOM element relative to the viewport. Check out the code for detailed implementation instructions.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseBoxPosition() {
  return (
    <DemoLayout
      title="useBoxPosition"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
    />
  );
}
