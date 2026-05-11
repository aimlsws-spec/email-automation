// Import Dependencies
import { ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";
import {
  EllipsisHorizontalIcon,
  HashtagIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Footer() {
  return (
    <footer className="flex h-12 shrink-0 justify-between border-t border-gray-150 px-1.5 py-1 dark:border-dark-600">
      <Button
        data-tooltip
        data-tooltip-content="All Chats"
        variant="flat"
        color="primary"
        isIcon
        className="size-9 rounded-full"
      >
        <ChatBubbleLeftRightIcon className="size-5" />
      </Button>
      <Button
        data-tooltip
        data-tooltip-content="Users"
        variant="flat"
        isIcon
        className="size-9 rounded-full"
      >
        <UserIcon className="size-5" />
      </Button>
      <Button
        data-tooltip
        data-tooltip-content="Group"
        variant="flat"
        isIcon
        className="size-9 rounded-full"
      >
        <UsersIcon className="size-5" />
      </Button>
      <Button
        data-tooltip
        data-tooltip-content="Channels"
        variant="flat"
        isIcon
        className="size-9 rounded-full"
      >
        <HashtagIcon className="size-5" />
      </Button>
      <Button
        data-tooltip
        data-tooltip-content="More"
        variant="flat"
        isIcon
        className="size-9 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </Button>
    </footer>
  );
}
