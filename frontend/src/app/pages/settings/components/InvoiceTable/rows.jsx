// Import Dependencies
import PropTypes from "prop-types";
import dayjs from "dayjs";

// Local Imports
import { Badge } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";

// ----------------------------------------------------------------------

const statusColor = {
  pending: "neutral",
  paid: "success",
  unfunded: "error",
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function InvoiceName({ getValue, column }) {
  const columnQuery = ensureString(column.getFilterValue());

  return (
    <p className="font-medium text-gray-800 dark:text-dark-100">
      <Highlight query={columnQuery}>{getValue()}</Highlight>
    </p>
  );
}

export function Date({ getValue }) {
  const { locale } = useLocaleContext();
  const date = dayjs(+getValue()).locale(locale).format("DD MMM YYYY");
  return <span>{date}</span>;
}

export function Amount({ getValue }) {
  return <> {formatter.format(getValue())}</>;
}

export function Status({ getValue }) {
  const val = getValue();
  return (
    <Badge color={statusColor[val.toLowerCase()]} className="capitalize">
      {val}
    </Badge>
  );
}

export function Download() {
  return (
    <div className="text-end">
      <a
        href="##"
        className="mx-auto border-b border-dashed border-current pb-0.5 text-primary-600 dark:text-primary-400"
      >
        Download
      </a>
    </div>
  );
}

InvoiceName.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object,
};

Date.propTypes = {
  getValue: PropTypes.func,
};

Amount.propTypes = {
  getValue: PropTypes.func,
};

Status.propTypes = {
  getValue: PropTypes.func,
};
