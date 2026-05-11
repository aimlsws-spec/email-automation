// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Default } from "./Default";
import { Basic } from "./Basic";
import { Rounded } from "./Rounded";
import { Glow } from "./Glow";
import { SoftColor } from "./SoftColor";
import { SoftColorBordered } from "./SoftColorBordered";
import { Outlined } from "./Outlined";
import { Custom } from "./Custom";
import { componentProps } from "./props";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Badge" },
];

const markdownPath = "components/badge";

const demos = [
  {
    title: "Default Badge",
    description:
      "Badges are used to inform user of the status of specific data. Check out code for detail of usage.",
    Component: Default,
  
    markdownName: "Default",
  },
  {
    title: "Basic Badge",
    description:
      "<code>Badge</code> component can have different colors <code> (neutral, primary, secondary, info, success, warning, error) </code>. Check out code for detail of usage.",
    Component: Basic,
  
    markdownName: "Basic",
  },
  {
    title: "Rounded Badge",
    description:
      "<code>Badge</code> can have a rounded-sm shape. To do this, you should use the <code>rounded-full</code> utility class. Check out code for detail of usage.",
    Component: Rounded,
  
    markdownName: "Rounded",
  },
  {
    title: "Glow Badge",
    description:
      "<code>Badge</code> have glow option. To do this, add <code>isGlow</code> prop. Check out code for detail of usage.",
    Component: Glow,
  
    markdownName: "Glow",
  },
  {
    title: "Soft Color Badge",
    description: `<code>Badge</code> can have a soft colors. To do this, set <code>variant="soft"</code>. Check out code for detail of usage.`,
    Component: SoftColor,
  
    markdownName: "SoftColor",
  },
  {
    title: "Soft Color Bordered Badge",
    description: `<code>Badge</code> can have a soft colors and bordered. Check out code for detail of usage.`,
    Component: SoftColorBordered,
  
    markdownName: "SoftColorBordered",
  },
  {
    title: "Outlined Badge",
    description: `<code>Button</code> can be outlied. To do this, set <code>variant="outlined"</code>. Check out code for detail of usage.`,
    Component: Outlined,
  
    markdownName: "Outlined",
  },
  {
    title: "Custom Badge",
    description:
      "You can also give <code>Badge</code> custom styles using Tailwind CSS utility classes. Check out code for detail of usage.",
    Component: Custom,
  
    markdownName: "Custom",
  },
];

export default function Badge() {
  return (
    <DemoLayout
      title="Badge"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
      componentProps={componentProps}
    />
  );
}
