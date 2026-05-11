// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { WithDescription } from "./WithDescription";
import { Invert } from "./Invert";
import { InfinityExample } from "./Infinity";
import { PromiseExample } from "./Promise";
import { Color } from "./Color";
import { Position } from "./Position";
import { Expand } from "./Expand";
import { Custom } from "./Custom";
import { Message } from "./Message";
import { Blur } from "./Blur";
import { LinkNotification } from "./LinkNotification";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Notification" },
];

const markdownPath = "components/notification";

const demos = [
  {
    title: "Basic Notification",
    description:
      "The notification is used to display a quick message to a user. Notification support positioning, removal delay, and callbacks. <a href='https://github.com/emilkowalski/sonner' class='text-primary-600 dark:text-primary-400 hover:underline'>Sonner</a> is an opinionated notification component for React that is customizable.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "With Description",
    description:
      "To add a description to your notification, you can use the <code>description</code> prop. See the code below for an example of how to use it.",
    Component: WithDescription,
    markdownName: "WithDescription",
  },
  {
    title: "Invert Color",
    description:
      "To invert the color of your notification, set the <code>invert</code> option to true. See the code below for an example of how to use it.",
    Component: Invert,
    markdownName: "Invert",
  },
  {
    title: "Infinity Duration",
    description:
      "To prevent your notification from disappearing, set the <code>duration</code> option to <code>Infinity</code>. See the code below for an example of how to use it.",
    Component: InfinityExample,
    markdownName: "InfinityExample",
  },
  {
    title: "Promise Example",
    description:
      "Promise example of notification. See the code below for an example of how to use it.",
    Component: PromiseExample,
    markdownName: "PromiseExample",
  },
  {
    title: "Colored Notification",
    description:
      "You can customize the colors of your success and error notifications. See the code below for an example of how to use it.",
    Component: Color,
    markdownName: "Color",
  },
  {
    title: "Position Notification",
    description:
      "You can change the position of your notification by using the <code>setNotificationPosition</code> function. The possible values are <code> “top-left”, “top-right”, “top-center”, “bottom-left”, “bottom-center”, “bottom-right” </code>. See the code below for an example of how to use it.",
    Component: Position,
    markdownName: "Position",
  },
  {
    title: "Expanded Notification",
    description:
      "Notification can be expanded and stacked. See the code below for an example of how to use it.",
    Component: Expand,
    markdownName: "Expand",
  },
  {
    title: "Custom Notification",
    description:
      "Custom notification style. See the code below for an example of how to use it.",
    Component: Custom,
    markdownName: "Custom",
  },
  {
    title: "New Message",
    description:
      "Custom notification style. See the code below for an example of how to use it.",
    Component: Message,
    markdownName: "Message",
  },
  {
    title: "Link Notification",
    description:
      "Custom notification style. See the code below for an example of how to use it.",
    Component: LinkNotification,
    markdownName: "LinkNotification",
  },
  {
    title: "Glass Notification",
    description:
      "Custom notification style. See the code below for an example of how to use it.",
    Component: Blur,
    markdownName: "Blur",
  },
];

export default function Notification() {
  return (
    <DemoLayout
      title="Notification"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
