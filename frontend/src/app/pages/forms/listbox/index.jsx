// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Advanced } from "./Advanced";
import { Styled } from "./Styled";
import { StyledError } from "./StyledError";
import { StyledMultiple } from "./StyledMultiple";
import { WithIcon } from "./WithIcon";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Listbox" }];

const markdownPath = "forms/listbox";

const demos = [
  {
    title: "Styled Example",
    description:
      "With styled listbox, you can create selects more easily and quickly.",
    Component: Styled,
  
    markdownName: "Styled",
  },
  {
    title: "Styled Multiple",
    description:
      "With styled listbox, you can create selects more easily and quickly.",
    Component: StyledMultiple,
  
    markdownName: "StyledMultiple",
  },
  {
    title: "Styled Error State",
    description:
      "With styled listbox, you can create selects more easily and quickly.",
    Component: StyledError,
  
    markdownName: "StyledError",
  },
  {
    title: "With Icon",
    description: "You can add an icon to a listbox for more readability.",
    Component: WithIcon,
  
    markdownName: "WithIcon",
  },
  {
    title: "Advanced Example",
    description: "More complex and advanced example.",
    Component: Advanced,
  
    markdownName: "Advanced",
  },
];

export default function Listbox() {
  return (
    <DemoLayout
      title="Listbox"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
