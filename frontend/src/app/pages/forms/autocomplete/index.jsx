// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Styled } from "./Styled";
import { StyledHighlight } from "./StyledHighlight";
import { StyledError } from "./StyledError";
import { StyledMultiple } from "./StyledMultiple";
import { WithIcon } from "./WithIcon";
import { SelectUsers } from "./SelectUsers";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/forms" },
  { title: "Autocomplete" },
];

const markdownPath = "forms/autocomplete";

const demos = [
  {
    title: "Styled Exapmle",
    description:
      "With styled example, you can create comboboxes more easily and quickly.",
    Component: Styled,
  
    markdownName: "Styled",
  },
  {
    title: "Styled Multiple",
    description:
      "With Styled Multiple example, you can select <code>multiple</code> values in your autocomplete.",
    Component: StyledMultiple,
  
    markdownName: "StyledMultiple",
  },
  {
    title: "Styled Error",
    description:
      "You can set error state in your autocomplete with <code>error</code> prop.",
    Component: StyledError,
  
    markdownName: "StyledError",
  },
  {
    title: "Styled Highlight Query",
    description:
      "You highlight the query in your autocomplete dropdownwith <code>highlight</code> prop.",
    Component: StyledHighlight,
  
    markdownName: "StyledHighlight",
  },
  {
    title: "With Icon",
    description: "You can add an icon to a autocomplete for more readability.",
    Component: WithIcon,
  
    markdownName: "WithIcon",
  },
  {
    title: "Select Users",
    description:
      "To allow selecting multiple values in your autocomplete, use the <code>multiple</code> prop and pass an array to value instead of a single option.",
    Component: SelectUsers,
  
    markdownName: "SelectUsers",
  },
];

export default function Autocomplete() {
  return (
    <DemoLayout
      title="Autocomplete"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
