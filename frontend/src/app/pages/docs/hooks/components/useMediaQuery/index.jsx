import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useMediaQuery" },
];

const markdownPath = "docs/hooks/useMediaQuery";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useMediaQuery</code> subscribes to media queries. It receives a media query as an argument and returns true if the given media query matches the current state. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
];

export default function UseMediaQuery() {
  return (
    <DemoLayout
      title="useMediaQuery"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
