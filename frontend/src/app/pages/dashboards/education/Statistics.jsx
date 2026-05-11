// Import Dependencies
import {
  ArrowUpCircleIcon,
  ChartBarSquareIcon,
  CheckBadgeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Statistics() {
  return (
    <div className="order-first col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:order-none lg:col-span-6 lg:gap-6">
      <Card className="flex flex-col justify-between p-5">
        <p className="font-medium">Courses In Progress</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-3xl font-semibold text-gray-800 dark:text-dark-100">
            32
          </p>
          <ChartBarSquareIcon className="this:primary size-10 text-this dark:text-this-light" />
        </div>
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <p className="font-medium">Completed Courses</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-3xl font-semibold text-gray-800 dark:text-dark-100">
            14
          </p>
          <CheckBadgeIcon className="this:primary size-10 text-this dark:text-this-light" />
        </div>
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <p className="font-medium">Watching Time</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-gray-800 dark:text-dark-100">
            <span className="text-3xl font-semibold">214h</span>
            <span className="text-xl font-medium">21m</span>
          </p>
          <VideoCameraIcon className="this:primary size-10 text-this dark:text-this-light" />
        </div>
      </Card>
      <Card className="flex flex-col justify-between p-5">
        <p className="font-medium">Earning Points</p>
        <div className="flex items-center justify-between pt-4">
          <p className="text-3xl font-semibold text-gray-800 dark:text-dark-100">
            8
          </p>
          <ArrowUpCircleIcon className="this:primary size-10 text-this dark:text-this-light" />
        </div>
      </Card>
    </div>
  );
}
