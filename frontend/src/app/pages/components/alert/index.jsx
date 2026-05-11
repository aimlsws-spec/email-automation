// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Dismissible } from "./Dismissible";
import { Extended } from "./Extended";
import { Loop } from "./Loop";
import { Outlined } from "./Outlined";
import { SoftColor } from "./SoftColor";
import { WithIcon } from "./WithIcon";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Alert" },
];

const markdownPath = "components/alert";

const demos = [
  {
    title: "Basic Alert",
    description:
      "The alert component is used to convey important information to the user through the use of contextual types, icons, and colors",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Soft Color Alert",
    description:
      "Alerts can have a soft colors. To do this, you should use some opacity. Check out code for detail of usage.",
    Component: SoftColor,
    markdownName: "SoftColor",
  },
  {
    title: "Outlined Alert",
    description: "Alerts can be outlied. Check out code for detail of usage.",
    Component: Outlined,
    markdownName: "Outlined",
  },
  {
    title: "Alert With Icon",
    description:
      "Icons can also be added to the alert. Check out code for detail of usage.",
    Component: WithIcon,
    markdownName: "WithIcon",
  },
  {
    title: "Extended Alert",
    description:
      "Extended Alert (Callout) examples. Check out code for detail of usage.",
    Component: Extended,
    markdownName: "Extended",
  },
  {
    title: "Dismissible Alert",
    description:
      "Alerts can be dismissable. Check out code for detail of usage.",
    Component: Dismissible,
    markdownName: "Dismissible",
  },
  {
    title: "Loop Text Alert",
    description:
      "Show a loop banner by using with <a href='https://npmjs.com/package/react-fast-marquee' class='text-primary-600 dark:text-primary-400 hover:underline'> react-fast-marquee <a>. Check out code for detail of usage.",
    Component: Loop,
    markdownName: "Loop",
  },
];

export default function Alert() {
  return (
    <DemoLayout
      title="Alert"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
