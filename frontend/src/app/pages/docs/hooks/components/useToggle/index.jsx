import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";
import { CustomValue } from "./CustomValue";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useToggle" },
];

const markdownPath = "docs/hooks/useToggle";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useToggle</code> implements a common state pattern - it switches state between given values. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Custom Value",
    description:
      "Also can add custom values to the hook. Check out code for detail of usage.",
    Component: CustomValue,
    markdownName: "CustomValue",
  },
];

export default function UseToggle() {
  return (
    <DemoLayout
      title="useToggle"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
