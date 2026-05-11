// Import Dependencies
import PropTypes from "prop-types";
import { Fragment } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { PiSlidersHorizontalFill } from "react-icons/pi";
import { MdFileDownload } from "react-icons/md";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { TbCurrencyDollar } from "react-icons/tb";

// Local Imports
import { RangeFilter } from "components/shared/table/RangeFilter";
import { FacedtedFilter } from "components/shared/table/FacedtedFilter";
import { DateFilter } from "components/shared/table/DateFilter";
import { invoiceStatus } from "./invoiceList";
import { Button, Collapse, Input } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function Toolbar({ table }) {
  const [showFilters, { toggle }] = useDisclosure(false, {
    onClose: () => queueMicrotask(() => table.resetColumnFilters()),
  });

  return (
    <div className="table-toolbar mt-5 flex flex-col">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          {table.getColumn("invoice_name") && (
            <Input
              value={table.getColumn("invoice_name")?.getFilterValue() ?? ""}
              onChange={(e) =>
                table.getColumn("invoice_name").setFilterValue(e.target.value)
              }
              prefix={<MagnifyingGlassIcon className="size-4" />}
              className="h-8 text-xs ring-primary-500/50 focus:ring-3"
              placeholder="Search Name..."
            />
          )}
          <Button
            onClick={toggle}
            color={showFilters ? "primary" : "neutral"}
            className="h-8 space-x-2 whitespace-nowrap px-2.5 text-xs "
          >
            <PiSlidersHorizontalFill className="size-4" />
            <span className="max-sm:hidden">Filter</span>
          </Button>
        </div>

        <Menu as="div" className="relative inline-block text-start">
          <MenuButton
            as={Button}
            className="h-8 space-x-2 whitespace-nowrap px-2.5 text-xs "
          >
            <MdFileDownload className="size-4" />
            <span className="max-sm:hidden">Export</span>
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
            <MenuItems className="absolute z-100 mt-1.5 min-w-[11rem] whitespace-nowrap rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
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
                    <span>Export as PDF</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <Collapse in={showFilters}>
        <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pt-3 sm:-mx-5 sm:px-5">
          <Filters table={table} />
        </div>
      </Collapse>
    </div>
  );
}

function Filters({ table }) {
  return (
    <>
      {table.getColumn("status") && (
        <FacedtedFilter
          options={invoiceStatus}
          column={table.getColumn("status")}
          title="Status"
          Icon={CheckCircleIcon}
        />
      )}

      {table.getColumn("invoice_date") && (
        <DateFilter
          column={table.getColumn("invoice_date")}
          title="Date Range"
          config={{
            maxDate: new Date().fp_incr(1),
            mode: "range",
          }}
        />
      )}

      {table.getColumn("amount") && (
        <RangeFilter
          column={table.getColumn("amount")}
          title="Amount"
          Icon={TbCurrencyDollar}
          MinPrefixIcon={TbCurrencyDollar}
          MaxPrefixIcon={TbCurrencyDollar}
          buttonText={({ min, max }) => (
            <>
              {min && <>From ${min}</>}
              {min && max && " - "}
              {max && <>To ${max}</>}
            </>
          )}
        />
      )}
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object.isRequired,
};

Filters.propTypes = {
  table: PropTypes.object.isRequired,
};
