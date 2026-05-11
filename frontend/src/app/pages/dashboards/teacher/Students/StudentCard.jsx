// Import Dependencies
import PropTypes from "prop-types";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, AvatarDot, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function StudentCard({
  name,
  messagesCount,
  avatar,
  isOnline,
  progress,
}) {
  return (
    <Card className="flex items-center justify-between gap-3 p-3">
      <div className="flex min-w-0 items-center gap-x-3">
        <Avatar
          size={10}
          name={name}
          src={avatar}
          initialColor="auto"
          classNames={{
            display: "text-sm",
          }}
          indicator={
            <AvatarDot
              color={isOnline ? "primary" : "neutral"}
              className="right-0 -m-0.5"
            />
          }
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800 dark:text-dark-100">
            {name}
          </p>
          <p className="mt-0.5 truncate text-xs">{progress}% completed</p>
        </div>
      </div>
      <div className="relative">
        <Button className="size-8 rounded-full" isIcon>
          <ChatBubbleOvalLeftEllipsisIcon className="size-4.5" />
        </Button>
        {messagesCount && messagesCount > 0 && (
          <div className="pointer-events-none absolute right-0 top-0 -m-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-600 px-1 text-tiny font-medium leading-none text-white dark:bg-primary-500">
            {messagesCount}
          </div>
        )}
      </div>
    </Card>
  );
}

StudentCard.propTypes = {
  name: PropTypes.string,
  messagesCount: PropTypes.number,
  avatar: PropTypes.string,
  isOnline: PropTypes.bool,
  progress: PropTypes.number,
};
