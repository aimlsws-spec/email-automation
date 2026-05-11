// Import Dependencies
import { ChartBarIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export function Statistics() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:order-first sm:grid-cols-4 sm:gap-5 lg:gap-6">
      <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
        <div className="flex justify-between gap-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            $5,679
          </p>
          <CpuChipIcon className="this:primary size-5 shrink-0 text-this dark:text-this-light" />
        </div>
        <p className="mt-1 truncate text-xs-plus">Total Mining</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
        <div className="flex justify-between gap-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            $12.6k
          </p>
          <ChartBarIcon className="this:success size-5 shrink-0 text-this dark:text-this-light" />
        </div>
        <p className="mt-1 truncate text-xs-plus">Total Networth</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
        <div className="flex justify-between gap-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            $10.3k
          </p>
          <CurrencyDollarIcon className="this:warning size-5 shrink-0 text-this dark:text-this-light" />
        </div>
        <p className="mt-1 truncate text-xs-plus">Earnings</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
        <div className="flex justify-between gap-1">
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            651
          </p>
          <ArrowPathIcon className="this:info size-5 shrink-0 text-this dark:text-this-light" />
        </div>
        <p className="mt-1 truncate text-xs-plus">Harvested Losses</p>
      </div>
    </div>
  );
}
