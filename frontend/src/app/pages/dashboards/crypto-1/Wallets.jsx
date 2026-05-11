// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
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

export function Wallets() {
  return (
    <Card className="col-span-12 pb-5 lg:col-span-4">
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="font-medium tracking-wide text-dark-700 dark:text-gray-100">
          Wallets
        </h2>
        <ActionMenu />
      </div>

      <div
        className="custom-scrollbar flex gap-x-3 overflow-x-auto px-4 pb-2 sm:px-5"
        style={{ "--margin-scroll": "1.25rem" }}
      >
        <div className="w-48 shrink-0 rounded-lg bg-linear-to-br from-amber-400 to-orange-600 p-[3px]">
          <div className="rounded-lg bg-white p-3 dark:bg-dark-700">
            <div className="flex items-center justify-between">
              <p>Bitcoin</p>
              <img
                src="/images/logos/bitcoin.svg"
                className="size-6"
                alt="logo"
              />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
                .739
              </p>
              <p>$7,946.00</p>
            </div>
          </div>
        </div>

        <div className="w-48 shrink-0 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 p-[3px]">
          <div className="rounded-lg bg-white p-3 dark:bg-dark-700">
            <div className="flex items-center justify-between">
              <p>Litecoin</p>
              <img
                src="/images/logos/litecoin.svg"
                className="size-6"
                alt="logo"
              />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
                3.545
              </p>
              <p>$2,589.00</p>
            </div>
          </div>
        </div>

        <div className="w-48 shrink-0 rounded-lg bg-linear-to-br from-info to-info-darker p-[3px]">
          <div className="rounded-lg bg-white p-3 dark:bg-dark-700">
            <div className="flex items-center justify-between">
              <p>Ethereum</p>
              <img
                src="/images/logos/ethereum.svg"
                className="size-6"
                alt="logo"
              />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xl font-medium text-gray-800 dark:text-dark-100">
                5.589
              </p>
              <p>$11,499.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 px-4 sm:px-5">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Send Money
        </h2>

        <div className="mt-3 flex gap-2">
          {contacts.map((contact) => (
            <Avatar
              key={contact.uid}
              size={8}
              name={contact.name}
              src={contact.avatar}
              initialColor="auto"
              classNames={{
                display: "text-xs-plus",
              }}
            />
          ))}
        </div>

        <a
          href="##"
          className="mt-3 inline-flex items-center gap-2 hover:opacity-80"
        >
          <p>View All Contacts</p>
          <ArrowRightIcon className="size-4" />
        </a>

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
