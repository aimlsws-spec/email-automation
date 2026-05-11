// Import Dependencies
import {
  ClockIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Menu() {
  return (
    <ul className="space-y-1.5 px-2 font-medium">
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <ReceiptPercentIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Top Deals</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <Cog6ToothIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Setting</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <ClockIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>History</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <DocumentChartBarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Report</span>
        </Button>
      </li>
    </ul>
  );
}
