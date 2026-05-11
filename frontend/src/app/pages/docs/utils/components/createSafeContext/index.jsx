import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Usage } from "./Usage";
import { returns } from "./returns";
import { params } from "./params";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "createSafeContext" },
];

const demos = [
  {
    title: "Usage",
    description: "The <code>createSafeContext</code> function is a utility to create a context in React that ensures safe access to its value. It simplifies context creation and ensures that the context value is only accessed when the corresponding provider is present in the component tree.",
    Component: Usage,
  },
];

export default function CreateSafeContext() {
  return (
    <DemoLayout
      title="createSafeContext"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
