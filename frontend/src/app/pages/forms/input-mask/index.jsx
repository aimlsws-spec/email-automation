// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { CreditCard } from "./CreditCard";
import { Prefix } from "./Prefix";
import { CustomBlock } from "./CustomBlock";
import { DateTime } from "./DateTime";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Forms", path: "/forms" }, { title: "Input" }];

const markdownPath = "forms/input-mask";

const demos = [
  {
    title: "Credit Card",
    description:
      "An input mask is a string of characters that indicates the format of valid input values. Check out code for detail of usage.",
    Component: CreditCard,
  
    markdownName: "CreditCard",
  },
  {
    title: "Prefix",
    description:
      "An input mask is a string of characters that indicates the format of valid input values. Check out code for detail of usage.",
    Component: Prefix,
  
    markdownName: "Prefix",
  },
  {
    title: "Custom Blocks",
    description:
      "An input mask is a string of characters that indicates the format of valid input values. Check out code for detail of usage.",
    Component: CustomBlock,
  
    markdownName: "CustomBlock",
  },
  {
    title: "Date & Time",
    description:
      "An input mask is a string of characters that indicates the format of valid input values. Check out code for detail of usage.",
    Component: DateTime,
  
    markdownName: "DateTime",
  },
];

export default function InputMask() {
  return (
    <DemoLayout
      title="Input Mask"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
