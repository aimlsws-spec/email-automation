import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "getUserAgentOS" },
];

const markdownPath = "docs/utils/getUserAgentOS";

const demos = [
  {
    title: "Usage",
    description:
      "Detects the type of Operation System based on the user agent string. Check out code for detail of usage.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function GetUserAgentOS() {
  return (
    <DemoLayout
      title="getUserAgentOS"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
