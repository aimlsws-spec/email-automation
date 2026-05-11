// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { WithLineSpace } from "./WithLineSpace";
import { Vertical } from "./Vertical";
import { VerticalWithLineSpace } from "./VerticalWithLineSpace";
import { Advanced } from "./Advanced";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Steps" },
];

const markdownPath = "components/steps";

const demos = [
  {
    title: "Basic",
    description:
      "The steps displays progress through numbered steps. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "With Line Space",
    description:
      "Steps can have line space. To do this, add <code>.line-space</code> class in root. Check out code for detail of usage.",
    Component: WithLineSpace,
    markdownName: "WithLineSpace",
  },
  {
    title: "Vertical Exmaple",
    description:
      "Steps can be vertical. To do this, add <code>.is-vertical</code> class in root. Check out code for detail of usage.",
    Component: Vertical,
    markdownName: "Vertical",
  },
  {
    title: "Vertical With Line Space",
    description:
      "Vertical & line space example. Check out code for detail of usage.",
    Component: VerticalWithLineSpace,
    markdownName: "VerticalWithLineSpace",
  },
  {
    title: "Advanced",
    description:
      "Integrate with <code>useStep</code> hook. Check out code for detail of usage.",
    Component: Advanced,
    markdownName: "Advanced",
  },
];

export default function Steps() {
  return (
    <DemoLayout
      title="Steps"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
