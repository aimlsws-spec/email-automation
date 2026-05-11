// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function BasketSelector() {
  return (
    <div className="flex items-center gap-1">
      <div className="min-w-0">
        <span className="truncate text-base font-medium leading-none text-gray-800 dark:text-dark-100">
          Draft
        </span>{" "}
        <span>#001</span>
      </div>

      <BasketSelectorMenu />
    </div>
  );
}

function BasketSelectorMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-7 rounded-full"
      >
        <ChevronDownIcon className="size-5" />
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[8rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <MenuItem key={i}>
                {({ focus }) => (
                  <button
                    className={clsx(
                      "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                      focus &&
                        "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                    )}
                  >
                    <span>Draft #00{i + 1}</span>
                  </button>
                )}
              </MenuItem>
            ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
