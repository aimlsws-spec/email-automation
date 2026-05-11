// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { formatNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CollectionCell({ row, getValue }) {
  const val = getValue();
  return (
    <div className="flex items-center space-x-4 ">
      <div className="size-10">
        <img
          src={row.original.collection_image}
          alt={val}
          className="mask is-diamond h-full w-full object-cover object-center"
        />
      </div>
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {val}
      </span>
    </div>
  );
}

export function VolumeCell({ getValue }) {
  return <> {formatter.format(getValue())}</>;
}

export function Change24hrCell({ getValue }) {
  const val = getValue();

  return (
    <span
      className={clsx(
        "font-semibold",
        val > 0
          ? "text-success dark:text-success-light"
          : "text-error dark:text-error-light",
      )}
    >
      {val}%
    </span>
  );
}

export function OwnersCell({ getValue }) {
  return <>{formatNumber(getValue())}</>;
}

export function ItemsCell({ getValue }) {
  return <>{getValue().toLocaleString("en-US")}</>;
}

CollectionCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

VolumeCell.propTypes = {
  getValue: PropTypes.func,
};

Change24hrCell.propTypes = {
  getValue: PropTypes.func,
};

OwnersCell.propTypes = {
  getValue: PropTypes.func,
};

ItemsCell.propTypes = {
  getValue: PropTypes.func,
};
