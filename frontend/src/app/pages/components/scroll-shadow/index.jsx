// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Horizontal } from "./Horizontal";
import { HideScrollbar } from "./HideScrollbar";
import { Offset } from "./Offset";
import { ShadowSize } from "./ShadowSize";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Scroll Shadow" },
];

const markdownPath = "components/scroll-shadow";

const demos = [
  {
    title: "Basic Usage",
    description: `<code> ScrollShadow </code> Component applies top and bottom shadows when content overflows on scroll.`,
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Horizontal",
    description: `If you want to apply the shadow-sm on the horizontal scroll, you can set the <code>orientation="horizontal"</code>.`,
    Component: Horizontal,
    markdownName: "Horizontal",
  },
  {
    title: "Shadow Size",
    description:
      "By default, the shadow-sm size is 10 tailwind space (2.5rem), but you can change it using the <code>size</code> prop. Check out code for detail of usage.",
    Component: ShadowSize,
    markdownName: "ShadowSize",
  },
  {
    title: "Offset",
    description:
      "Shadow offset allows you to apply the shadow-sm on a specific position. Default size of the shadow-sm offset is 0px, but you can change it using the <code>offset</code>  prop. Check out code for detail of usage.",
    Component: Offset,
    markdownName: "Offset",
  },
  {
    title: "Hide Scrollbar",
    description:
      "You can use the <code>hide-scrollbar</code> classname to hide scrollbars. Check out code for detail of usage.",
    Component: HideScrollbar,
    markdownName: "HideScrollbar",
  },
];

export default function ScrollShadow() {
  return (
    <DemoLayout
      title="Progress"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
