// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Button } from "components/ui";
import { EmployeeCard } from "./EmployeeCard";
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";

// ----------------------------------------------------------------------

const employees = [
  {
    uid: "1",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-5.jpg",
    messages: 2,
    mails: 4,
    sells: 2348,
    target: 3000,
    clients: 78,
    relations: {
      calls: 0.33,
      chatMessages: 0.17,
      emails: 0.5,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-19.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-2.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-5.svg",
      },
    ],
  },
  {
    uid: "2",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-18.jpg",
    messages: null,
    mails: 2,
    sells: 1451,
    target: 2000,
    clients: 54,
    relations: {
      calls: 0.24,
      chatMessages: 0.56,
      emails: 0.2,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-6.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-9.svg",
      },
    ],
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    avatar: "/images/avatar/avatar-6.jpg",
    messages: 4,
    mails: null,
    sells: 423,
    target: 500,
    clients: 16,
    relations: {
      calls: 0.6,
      chatMessages: 0.23,
      emails: 0.17,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-14.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "4",
    name: "Samantha Shelton",
    avatar: "/images/avatar/avatar-11.jpg",
    messages: null,
    mails: 2,
    sells: 579,
    target: 800,
    clients: 24,
    relations: {
      calls: 0.4,
      chatMessages: 0.36,
      emails: 0.24,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "5",
    name: "Derrick Simmons",
    avatar: "/images/avatar/avatar-19.jpg",
    messages: null,
    mails: null,
    sells: 6541,
    target: 8000,
    clients: 145,
    relations: {
      calls: 0.55,
      chatMessages: 0.3,
      emails: 0.15,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-5.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-25.svg",
      },
    ],
  },
  {
    uid: "6",
    name: "Katrina West",
    avatar: "/images/avatar/avatar-7.jpg",
    messages: null,
    mails: 1,
    sells: 3481,
    target: 5000,
    clients: 96,
    relations: {
      calls: 0.09,
      chatMessages: 0.41,
      emails: 0.5,
    },
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-24.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-30.svg",
      },
    ],
  },
];

export function EmployeeList() {
  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Employees & Personnel
        </h2>
        <div className="flex">
          <CollapsibleSearch placeholder="Search here..." />
          <ActionMenu />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.uid}
            name={employee.name}
            avatar={employee.avatar}
            messages={employee.messages}
            mails={employee.mails}
            sells={employee.sells}
            target={employee.target}
            clients={employee.clients}
            relations={employee.relations}
            awards={employee.awards}
          />
        ))}
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
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisVerticalIcon className="size-5" />
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
