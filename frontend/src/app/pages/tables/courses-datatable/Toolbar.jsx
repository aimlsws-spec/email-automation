// Import Dependencies
import {
  CheckCircleIcon,
  ChevronUpDownIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { TbCurrencyDollar, TbUpload } from "react-icons/tb";
import clsx from "clsx";
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChartBarIcon,
  EllipsisHorizontalIcon,
  StarIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import { FacedtedFilter } from "components/shared/table/FacedtedFilter";
import { RangeFilter } from "components/shared/table/RangeFilter";
import { RadioFilter } from "components/shared/table/RadioFilter";
import { FilterSelector } from "components/shared/table/FilterSelector";
import { Button, Input } from "components/ui";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import {
  courseStatusOptions,
  durationOptions,
  filtersOptions,
  levelOptions,
} from "./data";
import { formatNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          "transition-content flex items-center justify-between gap-4",
          isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x) pt-4",
        )}
      >
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            Courses Table
          </h2>
        </div>
        {isXs ? (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              variant="flat"
              className="size-8 shrink-0 rounded-full p-0"
            >
              <EllipsisHorizontalIcon className="size-4.5" />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>New Order</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Share</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Print</span>
                    </button>
                  )}
                </MenuItem>
                <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Import Orders</span>
                    </button>
                  )}
                </MenuItem>
                <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Export as PDF</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Export as CSV</span>
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      className={clsx(
                        "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                        focus &&
                          "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                      )}
                    >
                      <span>Save Table as View</span>
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outlined"
              className="h-8 gap-2 rounded-md px-3 text-xs"
            >
              <PrinterIcon className="size-4" />
              <span>Print</span>
            </Button>

            <Menu
              as="div"
              className="relative inline-block whitespace-nowrap text-left"
            >
              <MenuButton
                as={Button}
                variant="outlined"
                className="h-8 gap-2 rounded-md px-3 text-xs"
              >
                <TbUpload className="size-4" />
                <span>Export</span>
                <ChevronUpDownIcon className="size-4" />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>Export as PDF</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>Export as CSV</span>
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>

            <Menu
              as="div"
              className="relative inline-block whitespace-nowrap text-left"
            >
              <MenuButton
                as={Button}
                variant="outlined"
                className="h-8 shrink-0 rounded-md px-2.5"
              >
                <EllipsisHorizontalIcon className="size-4.5" />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>New Order</span>
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>Share Orders</span>
                      </button>
                    )}
                  </MenuItem>

                  <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>Import Orders</span>
                      </button>
                    )}
                  </MenuItem>

                  <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={clsx(
                          "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                        )}
                      >
                        <span>Save Table as View</span>
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex gap-2 pt-4 [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 gap-2 overflow-x-auto pb-1 pt-4",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between gap-4 overflow-x-auto pb-1 pt-4",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 gap-2">
            <SearchInput table={table} />
            <Filters table={table} />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      placeholder="Search Course, Category..."
      classNames={{
        root: "shrink-0",
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
      }}
    />
  );
}

function Filters({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const toolbarFilters = table.getState().toolbarFilters;

  return (
    <>
      {toolbarFilters.includes("level") && table.getColumn("level") && (
        <div style={{ order: toolbarFilters.indexOf("level") + 1 }}>
          <FacedtedFilter
            options={levelOptions}
            column={table.getColumn("level")}
            title="Level"
            Icon={ChartBarIcon}
          />
        </div>
      )}

      {toolbarFilters.includes("status") && table.getColumn("status") && (
        <div style={{ order: toolbarFilters.indexOf("status") + 1 }}>
          <FacedtedFilter
            options={courseStatusOptions}
            column={table.getColumn("status")}
            title="Status"
            Icon={CheckCircleIcon}
          />
        </div>
      )}

      {toolbarFilters.includes("rating") && table.getColumn("rating") && (
        <div style={{ order: toolbarFilters.indexOf("rating") + 1 }}>
          <RangeFilter
            column={table.getColumn("rating")}
            title="Rating"
            buttonText={({ min, max }) => (
              <>
                {min && (
                  <>
                    From {min}{" "}
                    <StarIcon className="inline size-3.5 align-text-top opacity-70" />
                  </>
                )}
                {min && max && " - "}
                {max && (
                  <>
                    To {max}{" "}
                    <StarIcon className="inline size-3.5 align-text-top opacity-70" />
                  </>
                )}
              </>
            )}
            Icon={StarIcon}
            MinPrefixIcon={StarIcon}
            MaxPrefixIcon={StarIcon}
          />
        </div>
      )}

      {toolbarFilters.includes("lesson_count") &&
        table.getColumn("lesson_count") && (
          <div style={{ order: toolbarFilters.indexOf("lesson_count") + 1 }}>
            <RangeFilter
              column={table.getColumn("lesson_count")}
              title="Lesson Count"
              buttonText={({ min, max }) => (
                <>
                  {min && <>From {min} lessons</>}
                  {min && max && " - "}
                  {max && <>To {max} lessons</>}
                </>
              )}
            />
          </div>
        )}

      {toolbarFilters.includes("duration") && table.getColumn("duration") && (
        <div style={{ order: toolbarFilters.indexOf("duration") + 1 }}>
          <RadioFilter
            column={table.getColumn("duration")}
            Icon={ClockIcon}
            title="Duration"
            options={durationOptions}
          />
        </div>
      )}

      {toolbarFilters.includes("price") && table.getColumn("price") && (
        <div style={{ order: toolbarFilters.indexOf("price") + 1 }}>
          <RangeFilter
            column={table.getColumn("price")}
            title="Price"
            buttonText={({ min, max }) => (
              <>
                {min && <>From ${min}</>}
                {min && max && " - "}
                {max && <>To ${max}</>}
              </>
            )}
            Icon={TbCurrencyDollar}
            MinPrefixIcon={TbCurrencyDollar}
            MaxPrefixIcon={TbCurrencyDollar}
          />
        </div>
      )}

      {toolbarFilters.includes("earning") && table.getColumn("earning") && (
        <div style={{ order: toolbarFilters.indexOf("earning") + 1 }}>
          <RangeFilter
            column={table.getColumn("earning")}
            title="Earning"
            buttonText={({ min, max }) => (
              <>
                {min && <>From ${formatNumber(min)}</>}
                {min && max && " - "}
                {max && <>To ${formatNumber(max)}</>}
              </>
            )}
            Icon={TbCurrencyDollar}
            MinPrefixIcon={TbCurrencyDollar}
            MaxPrefixIcon={TbCurrencyDollar}
          />
        </div>
      )}

      {toolbarFilters.includes("students") && table.getColumn("students") && (
        <div style={{ order: toolbarFilters.indexOf("students") + 1 }}>
          <RangeFilter
            column={table.getColumn("students")}
            title="Students"
            Icon={UserGroupIcon}
            MinPrefixIcon={UserIcon}
            MaxPrefixIcon={UserIcon}
            buttonText={({ min, max }) => (
              <>
                {min && <>From {formatNumber(min)} students</>}
                {min && max && " - "}
                {max && <>To {formatNumber(max)} students</>}
              </>
            )}
          />
        </div>
      )}

      <div style={{ order: toolbarFilters.length + 1 }}>
        <FilterSelector options={filtersOptions} table={table} />
      </div>

      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
          style={{ order: toolbarFilters.length + 2 }}
        >
          Reset Filters
        </Button>
      )}
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
};

SearchInput.propTypes = {
  table: PropTypes.object,
};

Filters.propTypes = {
  table: PropTypes.object,
};
