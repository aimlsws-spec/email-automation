```jsx
// Import Dependencies
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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

// ----------------------------------------------------------------------

export function Primary() {
  return (
    <div className="max-w-xl">
      <Menu as="div" className="relative inline-block text-start">
        <MenuButton
          as={Button}
          color="primary"
          className="space-x-2 "
        >
          {({ open }) => (
            <>
              <span>Dropdown</span>
              <ChevronDownIcon
                className={clsx(
                  "size-4 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </>
          )}
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
          <MenuItems className="absolute z-[100] mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-700 dark:shadow-none">
            <MenuItem>
              {({ focus }) => (
                <button
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                    focus && "bg-primary-600 text-white",
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
                    "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                    focus && "bg-primary-600 text-white",
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
                    "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                    focus && "bg-primary-600 text-white",
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
                    "flex h-9 w-full items-center px-3 tracking-wide outline-none transition-colors",
                    focus && "bg-primary-600 text-white",
                  )}
                >
                  <span>Separated action</span>
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
```