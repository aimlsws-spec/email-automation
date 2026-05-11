// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Horizontal } from "./Horizontal";
import { HorizontalWithoutText } from "./HorizontalWithoutText";
import { Vertical } from "./Vertical";
import { VerticalWithoutText } from "./VerticalWithoutText";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Components", path: "/components" },
  { title: "Divider" },
];

const markdownPath = "components/divider";

const demos = [
  {
    title: "Vertical Divider",
    Component: Vertical,
  
    markdownName: "Vertical",
  },
  {
    title: "Vertical Divider Without Text",
    Component: VerticalWithoutText,
  
    markdownName: "VerticalWithoutText",
  },
  {
    title: "Horizontal Divider",
    Component: Horizontal,
  
    markdownName: "Horizontal",
  },
  {
    title: "Horizontal Divider Without Text",
    Component: HorizontalWithoutText,
  
    markdownName: "HorizontalWithoutText",
  },
];

export default function Divider() {
  return (
    <DemoLayout
      title="Divider"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
