// Import Dependencies
import { PropTypes } from "prop-types";
import clsx from "clsx";

// Local Imports
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

const actionStyles = {
  sent: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  opened: "bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300",
  replied: "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300",
};

export function TransactionCard({ name, avatar, time, action }) {
  return (
    <Card className="flex items-center justify-between gap-3 p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size={10} src={avatar} name={name} initialColor="auto" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
            {name}
          </span>
          <span className="truncate text-xs text-gray-400 dark:text-dark-300">
            {time}
          </span>
        </div>
      </div>
      <span
        className={clsx(
          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
          actionStyles[action] ?? actionStyles.sent,
        )}
      >
        {action}
      </span>
    </Card>
  );
}

TransactionCard.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  time: PropTypes.string,
  action: PropTypes.string,
};
