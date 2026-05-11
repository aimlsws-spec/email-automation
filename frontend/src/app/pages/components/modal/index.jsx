// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Blur } from "./Blur";
import { ConfirmModalExample } from "./ConfirmModalExample";
import { ScaleDown } from "./ScaleDown";
import { ScaleUp } from "./ScaleUp";
import { ShiftDown } from "./ShiftDown";
import { ShiftUp } from "./ShiftUp";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Modal" },
];

const markdownPath = "components/modal";

const demos = [
  {
    title: "Basic",
    description:
      "<a href='https://headlessui.com/react/dialog' class='text-primary-600 dark:text-primary-400 hover:underline'>Headless UI</a> A fully-managed, renderless dialog component jam-packed with accessibility and keyboard features, perfect for building completely custom modal and dialog windows.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Blur Backdrop",
    description:
      "Set backdrop blur-sm with Tailwind CSS. Check out code for detail of usage.",
    Component: Blur,
    markdownName: "Blur",
  },
  {
    title: "Shift Up Animation",
    description:
      "Shift Up animation with Tailwind CSS. Check out code for detail of usage.",
    Component: ShiftUp,
    markdownName: "ShiftUp",
  },
  {
    title: "Shift Down Animation",
    description:
      "Shift Down animation with Tailwind CSS. Check out code for detail of usage.",
    Component: ShiftDown,
    markdownName: "ShiftDown",
  },
  {
    title: "Scale Up Animation",
    description:
      "Scale Up animation with Tailwind CSS. Check out code for detail of usage.",
    Component: ScaleUp,
    markdownName: "ScaleUp",
  },
  {
    title: "Scale Down Animation",
    description:
      "Scale Down animation with Tailwind CSS. Check out code for detail of usage.",
    Component: ScaleDown,
    markdownName: "ScaleDown",
  },
  {
    title: "Confirm Modal",
    description:
      "Scale Down animation with Tailwind CSS. Check out code for detail of usage.",
    Component: ConfirmModalExample,
    markdownName: "ConfirmModalExample",
  },
];

export default function Modal() {
  return (
    <DemoLayout
      title="Modal"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
