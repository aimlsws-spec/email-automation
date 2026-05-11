// Import Dependencies
import PropTypes from "prop-types";
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button } from "components/ui";
import { histories } from "../../data";

// ----------------------------------------------------------------------

export function Histories() {
  return (
    <div>
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-xs-plus font-medium uppercase">History</span>
        <div className="flex ltr:-mr-1.5 rtl:-ml-1.5">
          <Button variant="flat" isIcon className="size-6 rounded-full">
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
      </div>
      <div className="hide-scrollbar mt-1 flex min-w-0 snap-x scroll-px-3 gap-2.5 overflow-x-auto px-3">
        {histories.map((history) => (
          <History
            key={history.uid}
            name={history.name}
            avatar={history.avatar}
          />
        ))}
      </div>
    </div>
  );
}

function History({ name, avatar }) {
  return (
    <div className="flex w-11 min-w-0 shrink-0 snap-start flex-col items-center justify-center">
      <Avatar
        componenet="button"
        size={11}
        name={name}
        src={avatar}
        classNames={{
          root: "rounded-full bg-linear-to-r from-purple-500 to-orange-600 p-0.5",
          display: "border-2 border-white text-sm dark:border-dark-700",
        }}
        initialColor="auto"
      />
      <p className="mt-1 w-12 truncate text-center text-xs tracking-tight">
        {name}
      </p>
    </div>
  );
}

History.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
};
