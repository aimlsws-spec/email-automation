// Import Dependencies
import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { FaCoins, FaDollarSign } from "react-icons/fa";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Statistics() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:gap-6">
      <Card className="p-4 sm:p-5">
        <div className="this:primary flex size-12 items-center justify-center rounded-xl bg-this shadow-xl shadow-this/50 dark:bg-this-light dark:shadow-this-light/50">
          <FaDollarSign className="size-5 text-white" />
        </div>
        <p className="mt-16">Income</p>
        <p className="mt-2 font-medium text-gray-800 dark:text-dark-100">
          <span className="text-2xl">$35</span>
          <span className="text-base">.3k</span>
        </p>
        <div className="this:success mt-1.5 flex items-center gap-0.5 text-xs text-this dark:text-this-lighter">
          <ArrowUpIcon className="size-3.5 stroke-2" />
          <span>+2.5%</span>
        </div>
      </Card>
      <Card className="p-4 sm:p-5">
        <div className="this:warning flex size-12 items-center justify-center rounded-xl bg-this shadow-xl shadow-this/50 dark:bg-this-light dark:shadow-this-light/50">
          <ArrowTopRightOnSquareIcon className="size-5 stroke-2 text-white" />
        </div>
        <p className="mt-16">Income</p>
        <p className="mt-2 font-medium text-gray-800 dark:text-dark-100">
          <span className="text-2xl">$35</span>
          <span className="text-base">.3k</span>
        </p>
        <div className="this:success mt-1.5 flex items-center gap-0.5 text-xs text-this dark:text-this-lighter">
          <ArrowUpIcon className="size-3.5 stroke-2" />
          <span>+2.5%</span>
        </div>
      </Card>
      <Card className="p-4 sm:p-5">
        <div className="this:info flex size-12 items-center justify-center rounded-xl bg-this shadow-xl shadow-this/50 dark:bg-this-light dark:shadow-this-light/50">
          <FaCoins className="size-5 text-white" />
        </div>
        <p className="mt-16">Income</p>
        <p className="mt-2 font-medium text-gray-800 dark:text-dark-100">
          <span className="text-2xl">$35</span>
          <span className="text-base">.3k</span>
        </p>
        <div className="this:success mt-1.5 flex items-center gap-0.5 text-xs text-this dark:text-this-lighter">
          <ArrowUpIcon className="size-3.5 stroke-2" />
          <span>+2.5%</span>
        </div>
      </Card>
      <Card className="p-4 sm:p-5">
        <div className="this:secondary flex size-12 items-center justify-center rounded-xl bg-this shadow-xl shadow-this/50 dark:bg-this-light dark:shadow-this-light/50">
          <ArrowDownTrayIcon className="size-5 stroke-2 text-white" />
        </div>
        <p className="mt-16">Income</p>
        <p className="mt-2 font-medium text-gray-800 dark:text-dark-100">
          <span className="text-2xl">$35</span>
          <span className="text-base">.3k</span>
        </p>
        <div className="this:success mt-1.5 flex items-center gap-0.5 text-xs text-this dark:text-this-lighter">
          <ArrowUpIcon className="size-3.5 stroke-2" />
          <span>+2.5%</span>
        </div>
      </Card>
    </div>
  );
}
