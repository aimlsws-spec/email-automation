// Import Dependencies
import {
  PlusIcon,
  ListBulletIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

// Local Imports
import { Button } from "components/ui";
import { labels } from "../../data";

// ----------------------------------------------------------------------

export function Labels() {
  return (
    <div>
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          Labels
        </span>
        <div className="flex ltr:-mr-1.5 rtl:-ml-1.5">
          <Button variant="flat" isIcon className="size-6 rounded-full">
            <PlusIcon className="size-3.5 stroke-2" />
          </Button>
          <ActionMenu />
        </div>
      </div>
      <ul className="space-y-1.5 px-2 pt-1 font-medium">
        {labels.map((label) => (
          <li key={label.id}>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <ListBulletIcon
                  className={`size-4.5 stroke-2 text-this dark:text-this-light this:${label.color}`}
                />
                <span>{label.text}</span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-start">
      <MenuButton
        as={Button}
        isIcon
        className="size-6 rounded-full"
        variant="flat"
      >
        <EllipsisVerticalIcon className="size-4" />
      </MenuButton>

      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
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
              <span>Another Action</span>
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
              <span>Other Action</span>
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}
