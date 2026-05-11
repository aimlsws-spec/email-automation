// Import Dependencies
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";

// Local Imports
import { Button, Checkbox } from "components/ui";

// ----------------------------------------------------------------------

export function Header() {
  return (
    <div className="flex flex-col-reverse py-4 sm:flex-row sm:justify-between">
      <div className="mt-2 flex items-center justify-between gap-1 sm:mt-0">
        <div className="flex items-center px-2.5">
          <div className="flex size-8 items-center justify-center">
            <Checkbox />
          </div>
          <ActionMenu />
        </div>
        <div className="flex gap-1">
          <Button isIcon variant="flat" className="size-8 rounded-full">
            <ArrowPathIcon className="size-5" />
          </Button>
          <Button isIcon variant="flat" className="size-8 rounded-full">
            <EllipsisHorizontalIcon className="size-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-lg font-medium text-gray-800 dark:text-dark-100 sm:hidden">
          Inbox
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-2">
            <span>1 - 25 of 1234</span>
            <div className="flex">
              <Button isIcon variant="flat" className="size-8 rounded-full">
                <ChevronLeftIcon className="size-5 rtl:rotate-180" />
              </Button>
              <Button isIcon variant="flat" className="size-8 rounded-full">
                <ChevronRightIcon className="size-5 rtl:rotate-180" />
              </Button>
            </div>
          </div>
          <Button isIcon variant="flat" className="size-8 rounded-full">
            <Cog6ToothIcon className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-start">
      <MenuButton
        as={Button}
        isIcon
        className="size-6 rounded-full md:size-8"
        variant="flat"
      >
        <ChevronDownIcon className="size-4 md:size-4.5" />
      </MenuButton>

      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:left-0 rtl:right-0"
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
              <span>All</span>
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
              <span>None</span>
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
              <span>Read</span>
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
              <span>Starred</span>
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
              <span>Unread</span>
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
              <span>Unstarred</span>
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}
