// Import Dependencies
import {
  ArchiveBoxIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { PiPlug } from "react-icons/pi";

// Local Imports
import { Button } from "components/ui";
import { useChatContext } from "../../Chat.context";

// ----------------------------------------------------------------------

export function Menu() {
  const { setActiveChatId, currentChat } = useChatContext();

  return (
    <div>
      <div className="px-4 pt-2">
        <Button
          disabled={!currentChat}
          onClick={() => setActiveChatId(null)}
          variant="outlined"
          className="w-full gap-2 rounded-full"
        >
          <PlusIcon className="size-4" />
          <span>New Chat</span>
        </Button>
      </div>
      <ul className="space-y-1.5 px-2 pt-4 font-medium">
        <li>
          <Button
            variant="flat"
            className="group w-full min-w-0 justify-between gap-2 p-2 text-xs-plus"
          >
            <div className="flex min-w-0 items-center gap-2">
              <StarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
              <span className="truncate">Favorites</span>
            </div>
            <span className="text-primary-600 dark:text-primary-400">2</span>
          </Button>
        </li>
        <li>
          <Button
            variant="flat"
            className="group w-full min-w-0 justify-between gap-2 p-2 text-xs-plus"
          >
            <div className="flex min-w-0 items-center gap-2">
              <ArchiveBoxIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
              <span className="truncate">Archived</span>
            </div>
            <span className="text-primary-600 dark:text-primary-400">43</span>
          </Button>
        </li>
        <li>
          <Button
            variant="flat"
            className="group w-full min-w-0 justify-between gap-2 p-2 text-xs-plus"
          >
            <div className="flex min-w-0 items-center gap-2">
              <PiPlug className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
              <span className="truncate">Plugins</span>
            </div>
          </Button>
        </li>
      </ul>
    </div>
  );
}
