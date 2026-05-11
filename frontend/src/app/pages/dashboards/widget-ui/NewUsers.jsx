// Import Dependencies
import { UserIcon } from "@heroicons/react/20/solid";
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function NewUsers() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Avatar
          size={10}
          initialColor="primary"
          initialVariant="soft"
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
        >
          <UserIcon className="size-5" />
        </Avatar>
        <div className="flex items-center gap-2">
          <ArrowTrendingUpIcon className="size-5 stroke-2 text-success" />
          <span className="text-base font-semibold text-gray-800 dark:text-dark-100">
            1.2%
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold text-gray-800 dark:text-dark-100">
            1024
          </p>
          <p>New Users</p>
        </div>
        <div className="flex -space-x-1.5 ">
          <Avatar
            size={6}
            src="/images/avatar/avatar-1.jpg"
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl text-xs-plus ring-3 ring-white dark:ring-dark-700",
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
      </div>
    </Card>
  );
}
