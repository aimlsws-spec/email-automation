// Import Dependencies
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { CloudIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useSidebarContext } from "app/contexts/sidebar/context";
import { Avatar, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Header() {
  const { close: closeSidebar } = useSidebarContext();

  return (
    <div className="relative flex h-18 w-full shrink-0 items-center justify-between pl-4 pr-1 rtl:pl-1 rtl:pr-4">
      <div className="flex items-center gap-3">
        <Avatar size={9} initialColor="primary" initialVariant="soft">
          <CloudIcon className="size-4.5 stroke-2" />
        </Avatar>
        <p className="truncate text-base tracking-wider text-gray-800 dark:text-dark-100">
          My Cloud
        </p>
      </div>
      <Button
        onClick={closeSidebar}
        isIcon
        variant="flat"
        className="size-7 rounded-full xl:hidden"
      >
        <ChevronLeftIcon className="size-6 rtl:rotate-180" />
      </Button>
    </div>
  );
}
