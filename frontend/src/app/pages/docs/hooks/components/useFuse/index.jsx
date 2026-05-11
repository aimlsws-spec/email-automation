import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { params } from "./params";
import { returns } from "./returns";

const breadcrumbs = [
  { title: "Docs", path: "/docs" },
  { title: "Hooks", path: "/docs/hooks" },
  { title: "useFuse" },
];

const demos = [
  {
    title: "Basic",
    description:
      "Easily implement fuzzy search using a composable with <a href='https://www.fusejs.io/' class='text-primary-600 dark:text-primary-400 hover:underline'>Fuse.js</a>.",
    Component: Basic,
  },
];

export default function UseFuse() {
  return (
    <DemoLayout
      title="useFuse"
      breadcrumbs={breadcrumbs}
      demos={demos}
      hasPadding={false}
      params={params}
      returns={returns}
    />
  );
}
