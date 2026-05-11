// Import Dependencies
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import clsx from "clsx";

// Local Imports
import { Avatar, Button } from "components/ui";
import { setThisClass } from "utils/setThisClass";
import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

const statusColors = {
  "full-time": "primary",
  "part-time": "secondary",
  contractor: "info",
  intern: "warning",
  freelance: "success",
};

export function IdCell({ row, getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  return (
    <div className="-mx-2 flex items-center space-x-2 ">
      {row.getCanExpand() ? (
        <Button
          isIcon
          className="size-5"
          variant="flat"
          onClick={row.getToggleExpandedHandler()}
        >
          <ChevronUpIcon
            className={clsx(
              "size-4 transition-transform",
              row.getIsExpanded() && "rotate-180",
            )}
          />
        </Button>
      ) : null}
      <span>
        <Highlight query={query}>{getValue()}</Highlight>
      </span>
    </div>
  );
}

export function NameCell({ row, getValue, table }) {
  const name = getValue();
  const query = ensureString(table.getState().globalFilter);

  return (
    <div className="flex items-center space-x-4 ">
      <Avatar
        size={9}
        name={name}
        initialColor="auto"
        src={row.original.avatar}
        classNames={{ initial: "text-xs-plus" }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={query}>{name}</Highlight>
      </span>
    </div>
  );
}

export function PositionCell({ getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={query}>{getValue()}</Highlight>
    </p>
  );
}

export function DepartmentCell({ getValue, table }) {
  const query = ensureString(table.getState().globalFilter);

  return (
    <p className="w-48 truncate text-xs-plus">
      <Highlight query={query}>{getValue()}</Highlight>
    </p>
  );
}

export function StatusCell({ getValue, row, table }) {
  const query = ensureString(table.getState().globalFilter);

  return (
    <span className="inline-flex items-center space-x-2 leading-none ">
      <span
        className={clsx(
          "size-3 rounded-full border-2 border-this dark:border-this-light",
          setThisClass(statusColors[row.original.status.key]),
        )}
      ></span>
      <span>
        <Highlight query={query}>{getValue()}</Highlight>
      </span>
    </span>
  );
}

IdCell.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

NameCell.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};

PositionCell.propTypes = {
  table: PropTypes.object,
  getValue: PropTypes.func,
};

DepartmentCell.propTypes = {
  table: PropTypes.object,
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};
