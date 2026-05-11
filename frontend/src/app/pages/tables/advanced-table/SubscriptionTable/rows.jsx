// Import Dependencies
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Badge, Progress } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

dayjs.extend(utc);

function getLicenseValiityColor(diff) {
  if (diff < 0) return "error";
  if (diff < 15) return "warning";
  if (diff < 50) return "info";
  return "success";
}

const licenseColor = {
  standard: "info",
  premium: "primary",
  creative: "secondary",
};

export function ClientNameCell({ row, getValue }) {
  const name = getValue();
  return (
    <div className="flex items-center gap-4">
      <Avatar
        name={name}
        src={row.original.user_image}
        size={9}
        classNames={{ display: "rounded-lg text-sm" }}
      />
      <span className="font-medium text-gray-800 dark:text-dark-100">
        {name}
      </span>
    </div>
  );
}

export function LicenseType({ getValue }) {
  const val = getValue();
  return (
    <Badge color={licenseColor[val.toLowerCase()]} isGlow>
      {val}
    </Badge>
  );
}

export function PurchaseDateCell({ getValue }) {
  const { locale } = useLocaleContext();
  return <span>{dayjs(getValue()).locale(locale).format("DD MMMM YYYY")}</span>;
}

export function LicenseValiityCell({ row, getValue }) {
  const length = dayjs(row.original.renewal_date).diff(
    row.original.purchase_date,
  );
  const diff = getValue();

  const color = getLicenseValiityColor((diff / length) * 100);
  return (
    <div
      data-tooltip
      data-tooltip-content={`${(diff / 86400000).toFixed(0)} days`}
    >
      <Progress value={(diff / length) * 100} color={color} variant="soft" />
    </div>
  );
}

export function RenewalDateCell({ getValue }) {
  const { locale } = useLocaleContext();
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      {dayjs(getValue()).locale(locale).format("DD MMMM YYYY")}
    </span>
  );
}

export function AmountCell({ getValue }) {
  return (
    <span className="font-medium text-gray-800 dark:text-dark-100">
      {getValue()}
    </span>
  );
}

ClientNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

LicenseType.propTypes = {
  getValue: PropTypes.func,
};

PurchaseDateCell.propTypes = {
  getValue: PropTypes.func,
};

LicenseValiityCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

RenewalDateCell.propTypes = {
  getValue: PropTypes.func,
};

AmountCell.propTypes = {
  getValue: PropTypes.func,
};
