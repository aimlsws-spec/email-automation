// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";
import { toast } from "sonner";

// Local Imports
import { Button, CopyButton } from "components/ui";

// ----------------------------------------------------------------------

export function Balance() {
  return (
    <div className="rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 px-4 pb-4 text-white sm:px-5">
      <div className="flex items-center justify-between py-3">
        <h2 className="text-sm-plus font-medium tracking-wide">Your Balance</h2>
        <ActionMenu />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <div>
          <div className="flex w-9/12 items-center gap-1">
            <p className="truncate text-xs text-white/80">
              0x9CDBC28F0A6C13BB42ACBD3A3B366BFCAB07B8B1
            </p>

            <CopyButton value="0x9CDBC28F0A6C13BB42ACBD3A3B366BFCAB07B8B1">
              {({ copied, copy }) => {
                copied && toast.success("Your Wallet Address copied");
                return (
                  <Button
                    unstyled
                    onClick={copy}
                    className="size-5 shrink-0 rounded-full hover:bg-white/20 focus:bg-white/20 active:bg-white/25"
                  >
                    <DocumentDuplicateIcon className="size-3.5" />
                  </Button>
                );
              }}
            </CopyButton>
          </div>
          <div className="mt-3 text-3xl font-semibold">$5,566.00</div>
          <p className="mt-2 text-xs-plus text-white/80">11.159849849 BTC</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <div>
            <p className="text-white/90">Income</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
                <ArrowUpIcon className="size-4" />
              </div>
              <p className="text-base font-medium">$2,225.22</p>
            </div>
            <Button
              unstyled
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/20 px-5 py-2 text-white hover:bg-white/30 focus:bg-white/30 active:bg-white/25"
            >
              Send
            </Button>
          </div>
          <div>
            <p className="text-white/90">Expense</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-black/20">
                <ArrowDownIcon className="size-4" />
              </div>
              <p className="text-base font-medium">$225.22</p>
            </div>
            <Button
              unstyled
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/20 px-5 py-2 text-white hover:bg-white/30 focus:bg-white/30 active:bg-white/25"
            >
              Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        unstyled
        className="size-8 rounded-full hover:bg-white/20 focus:bg-white/20 active:bg-white/25"
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 text-gray-600 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:text-dark-200 dark:shadow-none ltr:right-0 rtl:left-0">
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
