// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Box, Button } from "components/ui";

// ----------------------------------------------------------------------

export function CustomerSatisfaction() {
  return (
    <Box className="col-span-12 lg:col-span-4">
      <div className="flex min-w-0 items-center justify-between">
        <h2 className="min-w-0 font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Customer Satisfaction
        </h2>
        <ActionMenu />
      </div>
      <div className="mt-3">
        <p>
          <span className="text-3xl text-gray-800 dark:text-dark-100">9.7</span>
          <span className="this:success text-xs text-this dark:text-this-lighter">
            +2.1%
          </span>
        </p>
        <p className="text-xs-plus">Performance score</p>
      </div>
      <div className="mt-4 flex w-full gap-1">
        <div className="this:primary h-2 w-5/12 rounded-full bg-this dark:bg-this-light" />
        <div className="this:success w-2/12 rounded-full bg-this dark:bg-this-light" />
        <div className="this:info w-2/12 rounded-full bg-this dark:bg-this-light" />
        <div className="this:warning w-2/12 rounded-full bg-this dark:bg-this-light" />
        <div className="this:error h-2 w-1/12 rounded-full bg-this dark:bg-this-light" />
      </div>
      <div className="hide-scrollbar mt-4 min-w-full overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="whitespace-nowrap py-2">
                <div className="flex items-center gap-2">
                  <div className="this:primary size-3.5 rounded-full border-2 border-this dark:border-this-light"></div>
                  <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Exellent
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 text-end">
                <p className="font-medium text-gray-800 dark:text-dark-100">
                  1 029
                </p>
              </td>
              <td className="whitespace-nowrap py-2 text-end">42%</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-2">
                <div className="flex items-center gap-2">
                  <div className="this:success size-3.5 rounded-full border-2 border-this dark:border-this-light"></div>
                  <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Very Good
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 text-end">
                <p className="font-medium text-gray-800 dark:text-dark-100">
                  426
                </p>
              </td>
              <td className="whitespace-nowrap py-2 text-end">18%</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-2">
                <div className="flex items-center gap-2">
                  <div className="this:info size-3.5 rounded-full border-2 border-this dark:border-this-light"></div>
                  <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Good
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 text-end">
                <p className="font-medium text-gray-800 dark:text-dark-100">
                  326
                </p>
              </td>
              <td className="whitespace-nowrap py-2 text-end">14%</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-2">
                <div className="flex items-center gap-2">
                  <div className="this:warning size-3.5 rounded-full border-2 border-this dark:border-this-light"></div>
                  <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Poor
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 text-end">
                <p className="font-medium text-gray-800 dark:text-dark-100">
                  395
                </p>
              </td>
              <td className="whitespace-nowrap py-2 text-end">17%</td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-2">
                <div className="flex items-center gap-2">
                  <div className="this:error size-3.5 rounded-full border-2 border-this dark:border-this-light"></div>
                  <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Very Poor
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 text-end">
                <p className="font-medium text-gray-800 dark:text-dark-100">
                  129
                </p>
              </td>
              <td className="whitespace-nowrap py-2 text-end">9%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Box>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1 rtl:-ml-1"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
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
                <span>Action</span>
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
                <span>Another action</span>
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
                <span>Other action</span>
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
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
