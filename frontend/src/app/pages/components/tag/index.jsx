// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Rounded } from "./Rounded";
import { Glow } from "./Glow";
import { SoftColor } from "./SoftColor";
import { Polymorphic } from "./Polymorphic";
import { Outlined } from "./Outlined";
import { TagGroup } from "./TagGroup";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/Components" },
  { title: "Tag" },
];

const markdownPath = "components/tag";

const demos = [
  {
    title: "Default Tag",
    description:
      "<code>Tags</code> are compact elements that represent an input, attribute, or action. tags allow users to enter information, make selections, filter content, or trigger actions. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Badge",
    description:
      "<code>Tag</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Rounded Badge",
    description:
      "<code>Tag</code> can have a rounded-sm shape. To do this, you should use the <code>rounded-full</code> utility class. Check out code for detail of usage.",
    Component: Rounded,
  
    markdownName: "Rounded",
  },
  {
    title: "Glow Badge",
    description:
      "<code>Tag</code> have glow option. To do this, add <code>isGlow</code> prop. Check out code for detail of usage.",
    Component: Glow,
  
    markdownName: "Glow",
  },
  {
    title: "Soft Color Badge",
    description: `<code>Tag</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
  
    markdownName: "SoftColor",
  },
  {
    title: "Outlined Badge",
    description: `<code>Tag</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Tag Group",
    description: "Group a series of tags together on a single line",
    Component: TagGroup,
  
    markdownName: "TagGroup",
  },
  {
    title: "Polymorphic Rendering",
    description:
      "<code>Tag</code> is a polymorphic component, you can change root element. Check out code for detail of usage.",
    Component: Polymorphic,
  
    markdownName: "Polymorphic",
  },
];

export default function Badge() {
  return (
    <DemoLayout
      title="Tag"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
