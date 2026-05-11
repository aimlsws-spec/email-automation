// Import Dependencies
import {
  ClockIcon,
  HashtagIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
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
          <ShareIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Shared Folders</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <StarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Important</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <ClockIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Recent</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <HashtagIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
          <span>Tags</span>
        </Button>
      </li>
      <li>
        <Button
          variant="flat"
          color="error"
          className="group w-full justify-start gap-2 p-2 text-xs-plus"
        >
          <TrashIcon className="size-4.5" />
          <span>Trash</span>
        </Button>
      </li>
    </ul>
  );
}
