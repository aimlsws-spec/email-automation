import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useDisclosure" },
];

const markdownPath = "docs/hooks/useDisclosure";

const demos = [
  {
    title: "Basic",
    description:
      "<code>useDisclosure</code> hook manages boolean state. It provides open, close and toggle handlers and accepts optional onOpen and onClose callbacks. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
];

export default function UseDisclosure() {
  return (
    <DemoLayout
      title="useDisclosure"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      returns={returns}
      params={params}
    />
  );
}
