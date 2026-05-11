import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "createScopedKeydownHandler" },
];

const markdownPath = "docs/utils/createScopedKeydownHandler";

const demos = [
  {
    title: "Usage",
    description:
      "The <code>createScopedKeydownHandler</code> function is a utility designed to streamline keyboard navigation within a defined scope. It facilitates handling <code>keydown</code> events in a way that ensures intuitive navigation between elements while supporting configurable behaviors such as looping, direction handling, and activation on focus. Check out code for detail of usage.",
    Component: Usage,
    markdownName: "Usage",
  },
];

export default function CreateScopedKeydownHandler() {
  return (
    <DemoLayout
      title="createScopedKeydownHandler"
      breadcrumbs={breadcrumbs}
      demos={demos}
      markdownPath={markdownPath}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
