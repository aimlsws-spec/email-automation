// Import Dependencies
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Footer() {
  return (
    <footer className="flex h-10 shrink-0 justify-between border-t border-gray-150 px-1.5 py-1 dark:border-dark-600">
      <Button
        data-tooltip
        data-tooltip-content="Setting"
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <Cog6ToothIcon className="size-4.5" />
      </Button>
      <div className="flex">
        <Button
          data-tooltip
          data-tooltip-content="Feedback"
          variant="flat"
          isIcon
          className="size-8 rounded-full"
        >
          <ChatBubbleLeftIcon className="size-4.5" />
        </Button>
        <Button
          data-tooltip
          data-tooltip-content="Help"
          variant="flat"
          isIcon
          className="size-8 rounded-full"
        >
          <QuestionMarkCircleIcon className="size-4.5" />
        </Button>
      </div>
    </footer>
  );
}
