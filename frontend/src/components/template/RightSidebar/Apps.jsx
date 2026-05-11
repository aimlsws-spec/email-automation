// Import Dependencies
import PropTypes from "prop-types";
import {
  BanknotesIcon,
  ChatBubbleBottomCenterIcon,
  CloudIcon,
  CurrencyDollarIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar } from "components/ui";
import { Link } from "react-router";

// ----------------------------------------------------------------------

const apps = [
  {
    id: "1",
    Icon: ViewColumnsIcon,
    title: "Kanban Board",
    color: "success",
    to: "/apps/kanban",
  },
  {
    id: "2",
    Icon: CurrencyDollarIcon,
    title: "Analytics",
    color: "warning",
    to: "/dashboards/crm-analytics",
  },
  {
    id: "3",
    Icon: ChatBubbleBottomCenterIcon,
    title: "Chat",
    color: "info",
    to: "/apps/chat",
  },
  {
    id: "4",
    Icon: CloudIcon,
    title: "File Manager",
    color: "error",
    to: "/apps/filemanager",
  },
  {
    id: "5",
    Icon: BanknotesIcon,
    title: "Banking",
    color: "secondary",
    to: "/dashboards/banking/banking-2",
  },
];

export function Apps({ close }) {
  return (
    <div className="mt-4">
      <h2 className="line-clamp-1 px-3 text-xs-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Pinned Apps
      </h2>
      <div className="mt-3 flex gap-3 px-3">
        {apps.map((app) => (
          <Link
            key={app.id}
            to={app.to}
            onClick={close}
            className="w-12 shrink-0 text-center"
          >
            <Avatar
              size={10}
              initialColor={app.color}
              classNames={{
                display: "mask is-squircle rounded-none",
              }}
            >
              <app.Icon className="size-5.5" />
            </Avatar>
            <span className="mt-1.5 block truncate whitespace-nowrap text-xs text-gray-800 dark:text-dark-100">
              {app.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

Apps.propTypes = {
  close: PropTypes.func,
};
