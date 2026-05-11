// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

export function RoleFilter({ column, options }) {
  const selectedValue = column?.getFilterValue() || "";

  return (
    <div
      data-tab
      className="flex rounded-md bg-gray-200 px-1 py-1 text-xs-plus text-gray-800 dark:bg-dark-700 dark:text-dark-200"
    >
      <Button
        data-tab-item
        onClick={() => column.setFilterValue("")}
        className={clsx(
          "shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium",
          selectedValue === ""
            ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
            : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
        )}
        unstyled
        onKeyDown={createScopedKeydownHandler({
          siblingSelector: "[data-tab-item]",
          parentSelector: "[data-tab]",
          activateOnFocus: true,
          loop: false,
          orientation: "horizontal",
        })}
      >
        All
      </Button>
      {options.map((option) => (
        <Button
          data-tab-item
          onClick={() => column.setFilterValue(option.value)}
          key={option.value}
          className={clsx(
            "shrink-0 whitespace-nowrap rounded-sm px-2.5 py-1 font-medium",
            selectedValue === option.value
              ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
              : "hover:text-gray-900 focus:text-gray-900 dark:hover:text-dark-100 dark:focus:text-dark-100",
          )}
          unstyled
          onKeyDown={createScopedKeydownHandler({
            siblingSelector: "[data-tab-item]",
            parentSelector: "[data-tab]",
            activateOnFocus: true,
            loop: false,
            orientation: "horizontal",
          })}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

RoleFilter.propTypes = {
  column: PropTypes.object,
  options: PropTypes.array,
};
