// Import Dependencies
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Page } from "components/shared/Page";
import { Button } from "components/ui";
import { ServerTraffic } from "./ServerTraffic";
import { CPUUsage } from "./CPUUsage";
import { StorageUsage } from "./StorageUsage";
import { MemoryUsage } from "./MemoryUsage";
import { HourlyTraffic } from "./HourlyTraffic";
import { DailyTraffic } from "./DailyTraffic";
import { ServerList } from "./ServerList";

// ----------------------------------------------------------------------

export default function Workspaces() {
  return (
    <Page title="Workspaces">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="mt-5 flex min-w-0 items-center justify-between">
          <h3 className="truncate text-lg font-medium text-gray-800 dark:text-dark-50">
            Workspaces Overview
          </h3>
          <div className="flex">
            <Button className="size-8 rounded-full" isIcon variant="flat">
              <Cog6ToothIcon className="size-5" />
            </Button>
            <Button className="size-8 rounded-full" isIcon variant="flat">
              <QuestionMarkCircleIcon className="size-5" />
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          <ServerTraffic />
          <div className="order-first col-span-12 grid grid-cols-2 gap-4 sm:order-none sm:gap-5 lg:col-span-5 lg:gap-6">
            <CPUUsage />
            <StorageUsage />
            <MemoryUsage />
            <DailyTraffic />
            <HourlyTraffic />
          </div>
        </div>
        <ServerList />
      </div>
    </Page>
  );
}
