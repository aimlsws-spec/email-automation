import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useUnmount" },
];

const demos = [
  {
    title: "Basic",
    description:
      "Custom hook that runs a cleanup function when the component is unmounted.",
    Component: Basic,
  },
];

export default function UseUnmount() {
  return (
    <DemoLayout
      title="useUnmount"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
    />
  );
}
