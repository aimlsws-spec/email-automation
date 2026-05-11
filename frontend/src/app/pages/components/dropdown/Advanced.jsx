// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ChartPieIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Avatar, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Advanced() {
  return (
    <div className="max-w-xl">
      <Menu as="div" className="relative inline-block text-start">
        <MenuButton
          as={Button}
          variant="flat"
          className="w-64 justify-between space-x-2 p-4 "
        >
          <div className="flex min-w-0 space-x-3 ">
            <Avatar size={10} src="/images/avatar/avatar-5.jpg" />

            <div className="min-w-0 text-start">
              <span className="block truncate text-xs-plus">Wade Cooper</span>
              <span className="mt-1 block truncate text-xs text-gray-400 dark:text-dark-300">
                Web Designer
              </span>
            </div>
          </div>
          <ChevronRightIcon className="size-5 rtl:rotate-180" />
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
          <MenuItems
            anchor={{ to: "bottom start", gap: 8 }}
            className="z-100 w-48 rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <ChartPieIcon className="size-4.5 stroke-1" />
                  <span>Dashboard</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <Cog6ToothIcon className="size-4.5 stroke-1" />
                  <span>Settings</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <EnvelopeIcon className="size-4.5 stroke-1" />
                  <span>Messages</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <ClipboardDocumentCheckIcon className="size-4.5 stroke-1" />
                  <span>Tasks</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <MagnifyingGlassIcon className="size-4.5 stroke-1" />
                  <span>Search</span>
                </button>
              )}
            </MenuItem>
            <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <HomeIcon className="size-4.5 stroke-1" />
                  <span>Homepage</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                      "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <ArrowLeftStartOnRectangleIcon className="size-4.5 stroke-1" />
                  <span>Logout</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                    focus && "bg-this/10 dark:bg-this-light/10",
                  )}
                >
                  <TrashIcon className="size-4.5 stroke-1" />
                  <span>Delete Account</span>
                </button>
              )}
            </MenuItem>
            <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />
            <div className="flex items-center justify-center px-3 py-2">
              <MenuItem>
                <Button
                  color="primary"
                  className="w-full whitespace-nowrap text-xs-plus"
                >
                  Upgrade Account
                </Button>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
