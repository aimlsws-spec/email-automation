// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const messages = [
  {
    uid: "1",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-20.jpg",
    messageCount: 3,
    lastMessage: "Hello, how are you?",
  },
  {
    uid: "2",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-14.jpg",
    messageCount: 1,
    lastMessage: "I want to know about the project status",
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    avatar: null,
    messageCount: 2,
    lastMessage: "am i supposed to use conditioner everyday",
  },
  {
    uid: "4",
    name: "Derrick Simmons",
    avatar: "/images/avatar/avatar-18.jpg",
    messageCount: 3,
    lastMessage: "Ad hic minus repudiandae.",
  },
];

export function ClientMessages() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 min-w-0 items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Client Messages
        </h2>
        <ActionMenu />
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.uid}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                size={10}
                name={message.name}
                src={message.avatar}
                initialColor="auto"
              />
              <div className="min-w-0">
                <div className="flex items-center space-x-2 ">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    {message.name}
                  </p>
                  <div className="flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-gray-200 px-1.5 text-tiny-plus font-medium leading-none text-gray-800 dark:bg-dark-450 dark:text-white">
                    {message.messageCount}
                  </div>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400 dark:text-dark-300">
                  {message.lastMessage}
                </p>
              </div>
            </div>
            <a
              href="##"
              className="hover:text-primary-600 focus:text-primary-600 dark:hover:text-primary-400 dark:focus:text-primary-400"
            >
              <ChevronRightIcon className="size-5 ltr:-mr-1 rtl:-ml-1 rtl:rotate-180" />
            </a>
          </div>
        ))}
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
