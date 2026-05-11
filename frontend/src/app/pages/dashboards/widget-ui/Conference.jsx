// Import Dependencies
import { CalendarIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Badge, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Conference() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-x-2">
        <CalendarIcon className="size-4.5 text-dark-400 dark:text-dark-300" />
        <p className="text-xs-plus">June 23, 2021</p>
      </div>
      <p className="mt-4 text-base font-medium text-gray-800 dark:text-dark-100">
        UI/UX Design Conference
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge color="warning" variant="soft">
          UI/UX Design
        </Badge>
        <Badge color="success" variant="soft">
          Mobile
        </Badge>
      </div>

      <div className="mt-5 flex -space-x-1.5 ">
        <Avatar
          size={6}
          src="/images/avatar/avatar-1.jpg"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "rounded-xl ring-3 ring-white dark:ring-dark-700",
          }}
        />

        <Avatar
          size={6}
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "rounded-xl text-xs-plus ring-3 ring-white dark:ring-dark-700",
          }}
          name="John Doe"
          initialColor="info"
        />
        <Avatar
          size={6}
          src="/images/avatar/avatar-18.jpg"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "rounded-xl text-xs-plus ring-3 ring-white dark:ring-dark-700",
          }}
        />
      </div>
    </Card>
  );
}
