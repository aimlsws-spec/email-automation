// Import Dependencies
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

// Local Imports
import { useSidebarContext } from "app/contexts/sidebar/context";
import { Avatar, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Header() {
  const { close: closeSidebar } = useSidebarContext();

  return (
    <div className="relative flex h-18 w-full shrink-0 items-center justify-between pl-4 pr-1 rtl:pl-1 rtl:pr-4">
      <Link to="/apps/mail" className="flex items-center gap-3">
        <Avatar size={9} initialColor="warning" initialVariant="soft">
          <EnvelopeIcon className="size-4.5 stroke-2" />
        </Avatar>
        <p className="truncate text-base tracking-wider text-gray-800 dark:text-dark-100">
          Mail
        </p>
      </Link>
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
