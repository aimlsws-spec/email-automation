// Import Dependencies
import { FaHistory } from "react-icons/fa";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Time() {
  return (
    <Card className="flex flex-1 flex-col p-4">
      <div className="flex grow flex-col items-center">
        <div className="flex h-16 w-12 items-center justify-center rounded-full bg-warning">
          <FaHistory className="size-5 text-white" />
        </div>
        <p className="mt-2 font-medium">Time</p>
      </div>
      <div className="mt-3 text-center">
        <p className="text-3xl font-semibold text-gray-600 dark:text-dark-100">
          16
        </p>
        <p className="text-xs-plus">minutes</p>
      </div>
    </Card>
  );
}
