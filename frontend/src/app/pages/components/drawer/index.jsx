// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Left } from "./Left";
import { Right } from "./Right";
import { Top } from "./Top";
import { Bottom } from "./Bottom";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Drawer" },
];

const markdownPath = "components/drawer";

const demos = [
  {
    title: "Left Drawer",
    description:
      "<code>Drawer</code> is similar to modal, with a bit difference on placement. Check out code for detail of usage.",
    Component: Left,
  
    markdownName: "Left",
  },
  {
    title: "Right Drawer",
    description:
      "Right Position <code>Drawer</code> example. Check out code for detail of usage.",
    Component: Right,
  
    markdownName: "Right",
  },
  {
    title: "Top Drawer",
    description:
      "Top Position <code>Drawer</code> example. Check out code for detail of usage.",
    Component: Top,
  
    markdownName: "Top",
  },
  {
    title: "Bottom Drawer",
    description:
      "Bottom Position <code>Drawer</code> example. Check out code for detail of usage.",
    Component: Bottom,
  
    markdownName: "Bottom",
  },
];

export default function Drawer() {
  return (
    <DemoLayout
      title="Drawer"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
