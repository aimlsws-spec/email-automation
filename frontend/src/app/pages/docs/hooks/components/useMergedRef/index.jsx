import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { returns } from "./returns";
import { params } from "./params";
import { MergeRefs } from "./MergeRefs";
import { AssignRef } from "./AssignRef";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useMergedRef" },
];

const demos = [
  {
    title: "Basic",
    description:
      "<code>useMergedRef</code> accepts any number of refs and returns a function that should be passed to the ref prop.",
    Component: Basic,
  },
  {
    title: "mergeRefs",
    description:
      "<code>mergeRefs</code> works the same way as <code>useMergedRef</code>, but does not use hooks internally. Use it only when you cannot use <code>useMergedRef</code>",
    Component: MergeRefs,
  },
  {
    title: "assignRef",
    description:
      "<code>assignRef</code> function can be used to assign refs that are not memoized with useCallback. It is usually used to assign refs that do not reference elements",
    Component: AssignRef,
  },
];

export default function UseMergedRef() {
  return (
    <DemoLayout
      title="useMergedRef"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      returns={returns}
      params={params}
    />
  );
}
