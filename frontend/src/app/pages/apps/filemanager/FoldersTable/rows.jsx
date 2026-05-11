// Import Dependencies
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { FolderIcon } from "@heroicons/react/20/solid";

// Local Imports
import { useLocaleContext } from "app/contexts/locale/context";
import { Avatar } from "components/ui";
import { formatBytes } from "utils/formatBytes";

export function Name({ getValue }) {
  return (
    <div className="flex items-center gap-4">
      <FolderIcon className="size-8 text-warning dark:text-warning-light" />
      <span className="truncate font-medium text-gray-800 dark:text-dark-100">
        {getValue()}
      </span>
    </div>
  );
}

export function LastEdit({ getValue }) {
  const { locale } = useLocaleContext();
  return dayjs(getValue()).locale(locale).format("DD MMM YYYY");
}

export function Size({ getValue }) {
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      {formatBytes(getValue())}
    </span>
  );
}

export function Members({ row }) {
  return (
    <div className="flex -space-x-2 ">
      {row.original.members.map((item, i) => (
        <Avatar
          key={i}
          data-tooltip
          data-tooltip-content={item.name}
          size={8}
          name={item.name}
          src={item.image}
          initialColor="auto"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "text-xs ring-3 ring-white dark:ring-dark-700",
          }}
        />
      ))}
    </div>
  );
}

Members.propTypes = {
  row: PropTypes.object.isRequired,
};

Name.propTypes = {
  getValue: PropTypes.func.isRequired,
};

Size.propTypes = {
  getValue: PropTypes.func.isRequired,
};
