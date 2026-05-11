// Import Dependencies
import PropTypes from "prop-types";
import {
  DocumentDuplicateIcon,
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { RiRobot2Line } from "react-icons/ri";

// Local Imports
import { Avatar, Box, Button, Skeleton } from "components/ui";
import { profile } from "../data";

// ----------------------------------------------------------------------

export function Message({ q, a }) {
  return (
    <div className="data-conversation-panel space-y-4">
      <div className="flex items-end justify-end gap-2.5 ltr:ml-4 sm:ltr:ml-10 rtl:mr-4 sm:rtl:mr-10">
        <Box className="max-w-lg rounded-2xl bg-gray-150 p-3 dark:bg-dark-700">
          {q}
        </Box>
        <div className="size-10 max-sm:hidden">
          <Avatar
            size={10}
            initialColor="auto"
            src={profile.avatar}
            name={profile.name}
          />
        </div>
      </div>
      <div className="flex items-end justify-start gap-2.5 sm:gap-5 ltr:mr-4 sm:ltr:mr-10 rtl:ml-4 sm:rtl:ml-10">
        <div className="size-10 max-sm:hidden">
          <Avatar size={10} initialColor="info">
            <RiRobot2Line className="size-5" />
          </Avatar>
        </div>
        <Box className="w-full max-w-lg rounded-2xl border border-gray-200 p-3 dark:border-dark-600">
          <div className="text-sm-plus">
            {a === "" ? (
              <div className="flex flex-1 flex-col justify-between space-y-2 py-2">
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <Skeleton key={index} className="h-3 w-full rounded-sm" />
                  ))}
                <Skeleton className="h-3 w-1/3 rounded-sm" />
              </div>
            ) : (
              a
            )}
          </div>
          <div className="-mx-1 flex justify-between pt-8">
            <div className="flex gap-1">
              <Button
                data-tooltip
                data-tooltip-content="Copy"
                variant="flat"
                isIcon
                className="size-8 rounded-full"
              >
                <DocumentDuplicateIcon className="size-5" />
              </Button>
              <Button
                data-tooltip
                data-tooltip-content="Share"
                variant="flat"
                isIcon
                className="size-8 rounded-full"
              >
                <ShareIcon className="size-5" />
              </Button>

              <Button
                data-tooltip
                data-tooltip-content="Report Issue"
                variant="flat"
                isIcon
                className="size-8 rounded-full"
              >
                <FlagIcon className="size-5" />
              </Button>
            </div>
            <div className="flex">
              <Button
                data-tooltip
                data-tooltip-content="Bad Response"
                variant="flat"
                isIcon
                className="size-8 rounded-full"
              >
                <HandThumbDownIcon className="size-5" />
              </Button>
              <Button
                data-tooltip
                data-tooltip-content="Good Response"
                variant="flat"
                isIcon
                className="size-8 rounded-full"
              >
                <HandThumbUpIcon className="size-5" />
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

Message.propTypes = {
  q: PropTypes.string,
  a: PropTypes.string,
};
