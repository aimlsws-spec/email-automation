// Local Imports
import { DatePicker } from "components/shared/form/Datepicker";
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Calendar() {
  return (
    <Card className="flex items-center justify-center overflow-hidden p-2 [&_.flatpickr-calendar]:min-w-full">
      <DatePicker isCalendar />
    </Card>
  );
}
