// Import Dependencies
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  CheckIcon,
  UserIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { TbUpload } from "react-icons/tb";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Local Imports
import {
  Avatar,
  Badge,
  Button,
  Input,
  Swap,
  SwapOff,
  SwapOn,
} from "components/ui";
import { DateFilter } from "components/shared/table/DateFilter";
import { FacedtedFilter } from "components/shared/table/FacedtedFilter";
import { TableConfig } from "./TableConfig";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { collaborators, tags } from "./data";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

const filterOptions = [
  { label: "In Progress", value: "in-progress" },
  { label: "Pending", value: "pending" },
  { label: "Done", value: "done" },
];

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
            Projects List
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
              as={MenuItems}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
            >
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
            </Transition>
          </Menu>
        ) : (
          <div className="flex space-x-2 ">
            <Button
              variant="outlined"
              className="h-8 space-x-2 rounded-md px-3 text-xs "
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
                className="h-8 space-x-2 rounded-md px-3 text-xs "
              >
                <TbUpload className="size-4" />
                <span>Export</span>
                <ChevronUpDownIcon className="size-4" />
              </MenuButton>
              <Transition
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
              >
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
                as={MenuItems}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
              >
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
              </Transition>
            </Menu>
          </div>
        )}
      </div>

      <StatusFilter table={table} />

      {isXs ? (
        <>
          <div
            className={clsx(
              "flex space-x-2 pt-4  [&_.input-root]:flex-1",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <SearchInput table={table} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              "hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 ",
              isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
            )}
          >
            <Filters table={table} />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            "custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 ",
            isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
          )}
          style={{
            "--margin-scroll": isFullScreenEnabled
              ? "1.25rem"
              : "var(--margin-x)",
          }}
        >
          <div className="flex shrink-0 space-x-2 ">
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
      classNames={{
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
        root: "shrink-0",
      }}
      placeholder="Search Partner, Name..."
    />
  );
}

function Filters({ table }) {
  const filters = table.getState().columnFilters;

  const isFiltered =
    filters.length > 0 && !(filters.length === 1 && filters[0].id === "status");

  return (
    <>
      {table.getColumn("collaborators") && (
        <FacedtedFilter
          options={collaborators}
          column={table.getColumn("collaborators")}
          title="Collaborators"
          labelField="name"
          valueField="uid"
          renderPrefix={(col, selected) => (
            <Swap effect="flip" value={selected ? "on" : "off"}>
              <SwapOn className="flex">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary-500">
                  <CheckIcon className="size-4 stroke-2 text-white" />
                </div>
              </SwapOn>
              <SwapOff className="flex">
                <Avatar
                  size={6}
                  name={col.name}
                  src={col.avatar}
                  classNames={{ display: "text-tiny" }}
                  initialColor="auto"
                />
              </SwapOff>
            </Swap>
          )}
          showCheckbox={false}
          Icon={UserIcon}
        />
      )}

      {table.getColumn("tags") && (
        <FacedtedFilter
          options={tags}
          column={table.getColumn("tags")}
          title="Tags"
          Icon={TagIcon}
        />
      )}

      {table.getColumn("started_at") && (
        <DateFilter
          column={table.getColumn("started_at")}
          title="Start Date"
          config={{
            mode: "range",
          }}
        />
      )}

      {table.getColumn("deadline") && (
        <DateFilter
          column={table.getColumn("deadline")}
          title="Deadline"
          config={{
            mode: "range",
          }}
        />
      )}

      {isFiltered && (
        <Button
          onClick={() => table.resetColumnFilters()}
          className="h-8 whitespace-nowrap px-2.5 text-xs"
        >
          Reset Filters
        </Button>
      )}
    </>
  );
}

function StatusFilter({ table }) {
  const col = table.getColumn("status");
  const val = col.getFilterValue();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  const handleFilterChange = (value) => col?.setFilterValue(value);
  const facets = col.getFacetedUniqueValues();

  return (
    <div
      className={clsx(
        "transition-content hide-scrollbar mb-1 mt-4 overflow-x-auto",
        isFullScreenEnabled ? "px-4 sm:px-5" : "px-(--margin-x)",
      )}
    >
      <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
        <div className="-mb-0.5 flex gap-2" data-tab>
          <Button
            onClick={() => handleFilterChange(undefined)}
            className={clsx(
              "relative flex gap-2 border-b-2 px-3 pb-3 font-medium",
              val
                ? "border-transparent"
                : "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400",
            )}
            unstyled
            data-tab-item
            onKeyDown={createScopedKeydownHandler({
              siblingSelector: "[data-tab-item]",
              parentSelector: "[data-tab]",
              activateOnFocus: true,
              loop: false,
              orientation: "horizontal",
            })}
          >
            <span>All Projects</span>
            <Badge color={val ? "neutral" : "primary"} className="h-4.5 px-1.5">
              {table.getCoreRowModel().rows.length}
            </Badge>
          </Button>
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={clsx(
                "relative flex gap-2 border-b-2 px-3 pb-3 font-medium",
                val === option.value
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent",
              )}
              unstyled
              data-tab-item
              onKeyDown={createScopedKeydownHandler({
                siblingSelector: "[data-tab-item]",
                parentSelector: "[data-tab]",
                activateOnFocus: true,
                loop: false,
                orientation: "horizontal",
              })}
            >
              <span>{option.label}</span>
              <Badge
                color={val === option.value ? "primary" : "neutral"}
                className="h-4.5 px-1.5"
              >
                {facets.get(option.value)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
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

StatusFilter.propTypes = {
  table: PropTypes.object,
};
