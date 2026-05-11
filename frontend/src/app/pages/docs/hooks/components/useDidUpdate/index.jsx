import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useDidUpdate" },
];

const demos = [
  {
    title: "Basic",
    description:
      "Calls given function in useEffect when value changes, but not when the component mounts",
    Component: Basic,
  },
];

export default function UseDidUpdate() {
  return (
    <DemoLayout
      title="useDidUpdate"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
    />
  );
}
