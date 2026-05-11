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
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

// Local Imports
import { Avatar, Badge, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function ContactInfo() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 items-center justify-between py-3">
        <h2 className="truncate text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Contact Info
        </h2>
        <ActionMenu />
      </div>
      <Avatar
        size={16}
        src="/images/avatar/avatar-18.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
      <h3 className="mt-2 text-base font-medium text-gray-800 dark:text-dark-100">
        Travis Fuller
      </h3>
      <p className="text-xs text-gray-400 dark:text-dark-300">Family</p>
      <div className="my-3 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate">(01) 22 888 4444</p>
          <div className="flex gap-1.5">
            <Button
              variant="soft"
              color="success"
              className="size-7 rounded-full"
              isIcon
            >
              <FaPhoneAlt className="size-3" />
            </Button>
            <Button
              variant="soft"
              color="info"
              className="size-7 rounded-full"
              isIcon
            >
              <FaEnvelope className="size-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate">(727)-810-3880</p>
          <div className="flex gap-1.5">
            <Button
              variant="soft"
              color="success"
              className="size-7 rounded-full"
              isIcon
            >
              <FaPhoneAlt className="size-3" />
            </Button>
            <Button
              variant="soft"
              color="info"
              className="size-7 rounded-full"
              isIcon
            >
              <FaEnvelope className="size-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate">raul@example.com</p>
          <div className="flex gap-1.5">
            <Button
              variant="soft"
              color="info"
              className="size-7 rounded-full"
              isIcon
            >
              <FaEnvelope className="size-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="my-3 h-px bg-gray-200 dark:bg-dark-500"></div>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p>12 Sep. 20:30</p>
            <p className="text-xs">incoming call</p>
          </div>
          <div>
            <Badge color="error" variant="soft" className="rounded-full">
              Missed
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p>12 Sep. 20:30</p>
            <p className="text-xs">incoming call</p>
          </div>
          <div>
            <Badge color="info" variant="soft" className="rounded-full">
              1m 33s
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p>13 Sep. 20:30</p>
            <p className="text-xs">incoming call</p>
          </div>
          <div>
            <Badge color="info" variant="soft" className="rounded-full">
              45s
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p>04 Oct. 20:30</p>
            <p className="text-xs">incoming call</p>
          </div>
          <div>
            <Badge color="info" variant="soft" className="rounded-full">
              6m 18s
            </Badge>
          </div>
        </div>
      </div>
    </Card>
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
