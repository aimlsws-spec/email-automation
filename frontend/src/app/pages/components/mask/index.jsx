// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Diamond } from "./Diamond";
import { Heart } from "./Heart";
import { Hexagon } from "./Hexagon";
import { Octagon } from "./Octagon";
import { ReuleauxTriangle } from "./ReuleauxTriangle";
import { Squircle } from "./Squircle";
import { Star } from "./Star";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Mask" },
];

const markdownPath = "components/mask";

const demos = [
  {
    title: "Squircle Shape",
    description:
      "Mask crops the content of the element to common shapes. The mask can crop the shape of squircle. Check out code for detail of usage.",
    Component: Squircle,
  
    markdownName: "Squircle",
  },
  {
    title: "Reuleaux Triangle Shape",
    description:
      "The mask can crop the shape of triangle. Check out code for detail of usage.",
    Component: ReuleauxTriangle,
  
    markdownName: "ReuleauxTriangle",
  },
  {
    title: "Diamond Shape",
    description:
      "The mask can crop the shape of diamond. Check out code for detail of usage.",
    Component: Diamond,
  
    markdownName: "Diamond",
  },
  {
    title: "Hexagon Shape",
    description:
      "The mask can crop the shape of hexagon. Check out code for detail of usage.",
    Component: Hexagon,
  
    markdownName: "Hexagon",
  },
  {
    title: "Octagon Shape",
    description:
      "The mask can crop the shape of octagon. Check out code for detail of usage.",
    Component: Octagon,
  
    markdownName: "Octagon",
  },
  {
    title: "Star Shape",
    description:
      "The mask can crop the shape of star. Check out code for detail of usage.",
    Component: Star,
  
    markdownName: "Star",
  },
  {
    title: "Heart Shape",
    description:
      "The mask can crop the shape of heart. Check out code for detail of usage.",
    Component: Heart,
  
    markdownName: "Heart",
  },
];

export default function Legend() {
  return (
    <DemoLayout
      title="Mask"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
