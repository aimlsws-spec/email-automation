// Import Dependencies
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { ensureString } from "utils/ensureString";
import { Highlight } from "components/shared/Highlight";

// ----------------------------------------------------------------------

export function NameCell({ row, getValue, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const val = getValue();

  return (
    <div className="flex items-center gap-4">
      <Avatar
        size={9}
        src={row.original.avatar}
        name={row.original.name}
        initialColor="auto"
        classNames={{ display: "text-sm" }}
      />
      <div className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={globalQuery}>{val}</Highlight>
      </div>
    </div>
  );
}

export function LocationCell({ table, getValue }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const val = getValue();

  return (
    <a href="##" className="hover:underline focus:underline">
      <Highlight query={globalQuery}>{val}</Highlight>
    </a>
  );
}

export function DateTimeCell({ getValue }) {
  const { locale } = useLocaleContext();
  const time = dayjs(getValue()).locale(locale).format("ddd, D MMM - HH:mm");

  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">{time}</span>
  );
}

export function StatusCell({ getValue }) {
  const status = getValue();

  if (status === "pending") return <ClockIcon className="ml-4 size-5" />;

  return (
    <XCircleIcon className="ml-4 size-5 text-error dark:text-error-light" />
  );
}

NameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
  table: PropTypes.object,
};

LocationCell.propTypes = {
  getValue: PropTypes.func,
  table: PropTypes.object,
};

DateTimeCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};
