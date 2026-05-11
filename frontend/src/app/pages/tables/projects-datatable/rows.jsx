// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Badge, Circlebar } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { colorFromText } from "utils/colorFromText";
import { collaborators } from "./data";

// ----------------------------------------------------------------------

function getColorProgress(val) {
  if (val === 0) return "neutral";
  if (val === 100) return "success";
  if (val < 10) return "warning";
  if (val < 50) return "info";
  return "primary";
}

export function PartnerCell({ row, getValue }) {
  const val = getValue();
  return (
    <div className="flex items-center gap-3">
      <div className="size-9">
        <img
          src={row.original.partner_image}
          alt={val}
          className="h-full w-full"
        />
      </div>
      <p className="font-medium text-gray-800 dark:text-dark-100">{val}</p>
    </div>
  );
}

export function CollaboratorsCell({ row }) {
  const collabs = collaborators.filter((collab) =>
    row.original.collaborators.includes(collab.uid),
  );

  return (
    <div className="flex -space-x-2 ">
      {collabs.map((item, i) => (
        <Avatar
          key={i}
          data-tooltip
          data-tooltip-content={item.name}
          size={8}
          name={item.name}
          src={item.avatar}
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

export function ProjectNameCell({ row, getValue }) {
  return (
    <div className="line-clamp-2 w-72 whitespace-normal">
      <span className="font-semibold text-gray-800 dark:text-dark-100">
        {getValue()}:{" "}
      </span>{" "}
      <span title={row.original.project_desc}>{row.original.project_desc}</span>
    </div>
  );
}

export function TagsCell({ row }) {
  return (
    <div className="flex w-64 flex-wrap gap-2">
      {row.original.tags.map((item, i) => (
        <Badge
          key={i}
          className="rounded-full border border-white/10 capitalize"
          color={colorFromText(item)}
          variant="soft"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

export function StartedDateCell({ getValue, row }) {
  const { locale } = useLocaleContext();

  return (
    <div>
      <p>{dayjs(getValue()).locale(locale).format("DD MMM YYYY")}</p>
      <p className="mt-1 text-xs">
        <span className="font-semibold text-gray-700 dark:text-error-lighter">
          Deadline:
        </span>{" "}
        {dayjs(row.original.deadline).locale(locale).format("DD MMM YYYY")}
      </p>
    </div>
  );
}

export function ProgressCell({ getValue }) {
  const val = getValue();

  return (
    <Circlebar
      size={13}
      strokeWidth={9}
      value={val}
      color={getColorProgress(val)}
    >
      <div className="text-tiny-plus font-semibold text-gray-800 dark:text-dark-100">
        {val}%
      </div>
    </Circlebar>
  );
}

PartnerCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

CollaboratorsCell.propTypes = {
  row: PropTypes.object,
};

ProjectNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

TagsCell.propTypes = {
  row: PropTypes.object,
};

StartedDateCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

ProgressCell.propTypes = {
  getValue: PropTypes.func,
};
