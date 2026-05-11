// Local Imports
import { DemoLayout } from "components/docs/demo/DemoLayout";
import { Basic } from "./Basic";
import { Disabled } from "./Disabled";
import { Multiple } from "./Multiple";
import { Range } from "./Range";
import { Datetimepicker } from "./Datetimepicker";
import { Timepicker } from "./Timepicker";
import { Calendar } from "./Calendar";

// ----------------------------------------------------------------------

const breadcrumbs = [
  { title: "Forms", path: "/datepicker" },
  { title: "Datepicker" },
];

const markdownPath = "forms/datepicker";

const demos = [
  {
    title: "Basic Datepicker",
    description:
      "<a href='https://github.com/haoxins/react-flatpickr' class='text-primary-600 dark:text-primary-400 hover:underline'>react-flatpickr</a> is a lightweight and powerful date and time picker. Check out code for detail of usage.",
    Component: Basic,
    markdownName: "Basic",
  },
  {
    title: "Disabled Date",
    description: `<div class="space-y-2">
       <p>If you’d like to make certain dates unavailable for selection, there are multiple methods of doing so.</p>
       <p class="font-medium">Disabling specific date</p>
       <p class="font-medium">Disabling a date range</p>
       <p class="font-medium">Disabling dates using a function</p>
       <p>All of those are possible with the disable option.</p>
      </div>`,
    Component: Disabled,
    markdownName: "Disabled",
  },
  {
    title: "Multiple Date",
    description:
      "It is possible to select multiple dates. Check out code for detail of usage.",
    Component: Multiple,
    markdownName: "Multiple",
  },
  {
    title: "Range",
    description:
      "Select a range of dates using the range calendar. Check out code for detail of usage.",
    Component: Range,
    markdownName: "Range",
  },
  {
    title: "Date and Timepicker",
    description:
      "Enable time for select date and time. Check out code for detail of usage.",
    Component: Datetimepicker,
    markdownName: "Datetimepicker",
  },
  {
    title: "Timepicker",
    description: "Select only time. Check out code for detail of usage.",
    Component: Timepicker,
    markdownName: "Timepicker",
  },
  {
    title: "Calendar",
    description:
      "Calendar mode, set <code>isCalendar={true}</code> prop. Check out code for detail of usage.",
    Component: Calendar,
    markdownName: "Calendar",
  },
];

export default function Datepicker() {
  return (
    <DemoLayout
      title="Datepicker"
      breadcrumbs={breadcrumbs}
      markdownPath={markdownPath}
      demos={demos}
    />
  );
}
