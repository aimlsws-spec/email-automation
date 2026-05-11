import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useIsomorphicEffect" },
];

const markdownPath = "docs/hooks/use-isomorphic-effect";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useIsomorphicEffect</code> is a replacement for <code>useEffect</code> hook that works in both browser and server environments.",
    Component: Basic,
  },
];

export default function UseIsomorphicEffect() {
  return (
    <DemoLayout
      title="useIsomorphicEffect"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
    />
  );
}
