// Import Dependencies
import PropTypes from "prop-types";
import {
  ArrowUpRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function AppointmentsRequestsCard({
  name,
  avatar,
  request,
  date,
  time,
}) {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size={10} name={name} src={avatar} initialColor="auto" />

        <div>
          <h3 className="truncate font-medium text-gray-800 dark:text-dark-100">
            {name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
            {request}
          </p>
        </div>
      </div>
      <div>
        <p>{date}</p>
        <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
          {time}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            className="size-7 rounded-full"
            isIcon
            color="success"
            variant="soft"
          >
            <CheckIcon className="size-4" />
          </Button>
          <Button
            className="size-7 rounded-full"
            isIcon
            color="error"
            variant="soft"
          >
            <XMarkIcon className="size-4" />
          </Button>
        </div>
        <Button className="size-7 rounded-full" isIcon>
          <ArrowUpRightIcon className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

AppointmentsRequestsCard.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  request: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
};
