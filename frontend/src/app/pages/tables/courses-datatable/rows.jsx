// Import Dependencies
import {
  CurrencyDollarIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Badge } from "components/ui";
import { formatNumber } from "utils/formatNumber";
import { courseStatusOptions, levelOptions } from "./data";
import { msToTime } from "utils/msToTime";

// ----------------------------------------------------------------------

export function CourseNameCell({ row, getValue }) {
  const duration = msToTime(row.original.duration);
  return (
    <div className="flex max-w-xs items-center space-x-4 2xl:max-w-sm ">
      <div className="size-12 shrink-0">
        <img
          className="h-full w-full rounded-lg object-cover object-center"
          src={row.original.image}
          alt="destination"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate">
          <a
            href="##"
            className="font-medium text-gray-700 transition-colors hover:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400"
          >
            {getValue()}
          </a>
        </p>
        <div className="mt-2 flex items-center space-x-2 text-xs ">
          <div className="flex shrink-0 items-center space-x-1 ">
            <ClockIcon className="size-4 text-gray-400 dark:text-dark-300" />
            <p className="opacity-80">{duration}</p>
          </div>
          <div className="mx-2 my-0.5 w-px self-stretch bg-gray-200 dark:bg-dark-500"></div>
          <p>
            <span>{row.original.lesson_count}</span>
            <span className="opacity-80"> Lessons</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function EarningCell({ row, getValue }) {
  return (
    <div className="flex space-x-2 ">
      <div
        data-tooltip
        data-tooltip-content="Earning"
        className="flex items-center space-x-0.5 "
      >
        <CurrencyDollarIcon className="size-5 text-gray-400 dark:text-dark-300" />
        <p>{formatNumber(getValue())}</p>
      </div>
      <span>/</span>
      <div
        data-tooltip
        data-tooltip-content="Students"
        className="flex items-center space-x-1 "
      >
        <UserGroupIcon className="size-5 text-gray-400 dark:text-dark-300" />
        <p>{formatNumber(row.original.students)}</p>
      </div>
    </div>
  );
}

export function LevelCell({ getValue }) {
  const val = getValue();
  const option = levelOptions.find((item) => item.value === val);

  return (
    <div className="flex items-center space-x-2 ">
      <div className="flex items-end space-x-0.5 ">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={{ height: `${(i + 1) * 0.23 + 0.2}rem` }}
            className={clsx(
              "h-2 w-1 rounded-sm",
              i < option.index
                ? "bg-primary-500"
                : "bg-gray-200 dark:bg-dark-450",
            )}
          ></div>
        ))}
      </div>
      <p>{option.label}</p>
    </div>
  );
}

export function RatingCell({ getValue }) {
  return (
    <div className="flex items-center space-x-1 ">
      <StarIcon className="size-4 text-yellow-500" />
      <span>{getValue()}</span>
    </div>
  );
}

export function StatusCell({ getValue }) {
  const val = getValue();
  const option = courseStatusOptions.find((item) => item.value === val);

  return (
    <Badge color={option?.color} className="rounded-full" variant="outlined">
      {option.label}
    </Badge>
  );
}

export function PriceCell({ getValue }) {
  return <>${getValue()}</>;
}

CourseNameCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

EarningCell.propTypes = {
  row: PropTypes.object,
  getValue: PropTypes.func,
};

LevelCell.propTypes = {
  getValue: PropTypes.func,
};

RatingCell.propTypes = {
  getValue: PropTypes.func,
};

StatusCell.propTypes = {
  getValue: PropTypes.func,
};

PriceCell.propTypes = {
  getValue: PropTypes.func,
};
