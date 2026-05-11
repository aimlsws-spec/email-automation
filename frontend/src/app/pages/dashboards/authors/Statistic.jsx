// Import Dependencies
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Statistic() {
  return (
    <Card className="overflow-hidden p-4 sm:col-span-2 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-150 p-4 dark:border-dark-600">
          <Avatar
            size={12}
            initialColor="warning"
            classNames={{ display: "mask is-star-2 rounded-none" }}
          >
            <UserIcon className="size-6" />
          </Avatar>
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
              203
            </p>
            <p>All Posts</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-150 p-4 dark:border-dark-600">
          <Avatar
            size={12}
            initialColor="primary"
            classNames={{ display: "mask is-star-2 rounded-none" }}
          >
            <PencilSquareIcon className="size-6" />
          </Avatar>
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
              16
            </p>
            <p>Post Writers</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-150 p-4 dark:border-dark-600">
          <Avatar
            size={12}
            initialColor="secondary"
            classNames={{ display: "mask is-star-2 rounded-none" }}
          >
            <HeartIcon className="size-6" />
          </Avatar>
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
              12.6k
            </p>
            <p>Likes</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-150 p-4 dark:border-dark-600">
          <Avatar
            size={12}
            initialColor="success"
            classNames={{ display: "mask is-star-2 rounded-none" }}
          >
            <ChatBubbleLeftRightIcon className="size-6" />
          </Avatar>
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
              3.6k
            </p>
            <p>Comments</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
