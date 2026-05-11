import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useEventListener" },
];

const markdownPath = "docs/hooks/useEventListener";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useEventListener</code> adds a given event listener to an element to which ref is assigned. Hook supports the same options as addEventListener method. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
];

export default function UseEventListener() {
  return (
    <DemoLayout
      title="useEventListener"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
    />
  );
}
