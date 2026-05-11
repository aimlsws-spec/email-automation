// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Cleave from "cleave.js/react";
import clsx from "clsx";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

// Local Imports
import { Avatar, Button, Card, Input, Select } from "components/ui";

// ----------------------------------------------------------------------

const contacts = [
  {
    uid: "1",
    name: "John Doe",
    avatar: "/images/avatar/avatar-20.jpg",
  },
  {
    uid: "2",
    name: "Samantha Shelton",
    avatar: null,
  },
  {
    uid: "3",
    name: "Corey Evans",
    avatar: "/images/avatar/avatar-6.jpg",
  },
  {
    uid: "4",
    name: "Lance Tucker",
    avatar: null,
  },
];

export function SendFlow() {
  return (
    <Card className="col-span-12 px-4 pb-5 sm:px-5 lg:col-span-4">
      <div className="flex items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-dark-700 dark:text-gray-100">
          Send Money
        </h2>
        <ActionMenu />
      </div>

      <div className="flex gap-2">
        {contacts.map((contact) => (
          <Avatar
            size={8}
            key={contact.uid}
            src={contact.avatar}
            name={contact.name}
            classNames={{
              display: "text-xs-plus",
            }}
            initialColor="auto"
          />
        ))}
      </div>

      <a
        href="##"
        className="mt-3 inline-flex items-center gap-2 hover:opacity-80"
      >
        <p>View All Contacts</p>
        <ArrowRightIcon className="size-4 rtl:rotate-180" />
      </a>

      <div className="mt-4 space-y-4">
        <Input
          label="Pay to"
          component={Cleave}
          options={{ creditCard: true }}
          placeholder="**** **** **** ****"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="amount">Amount</label>
        <div className="mt-1.5 flex -space-x-px ">
          <Select
            classNames={{
              root: "relative hover:z-1 focus:z-1",
              select: "ltr:rounded-r-none rtl:rounded-l-none",
            }}
          >
            <option>$</option>
            <option>€</option>
            <option>£</option>
          </Select>
          <Input
            id="amount"
            placeholder="Enter Amount"
            classNames={{
              root: "relative flex-1 hover:z-1 focus:z-1",
              input: "ltr:rounded-l-none rtl:rounded-r-none",
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex justify-between text-gray-400 dark:text-dark-300">
        <p className="text-xs-plus">Commission:</p>
        <p>3$</p>
      </div>

      <div className="mt-2 flex justify-between">
        <p>Total:</p>
        <p className="font-medium text-gray-800 dark:text-dark-100">3$</p>
      </div>

      <Button color="primary" className="mt-4 h-10 w-full">
        Send Money
      </Button>
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
