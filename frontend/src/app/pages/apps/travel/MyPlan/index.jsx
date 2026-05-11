// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { Box, Button } from "components/ui";
import { PlanCard } from "./PlanCard";

// ----------------------------------------------------------------------

const plans = [
  {
    uid: "1",
    name: "Picnic on forest",
    image: "/images/travel/picnic-1.jpg",
    dateRange: "22 May - 28 May",
    members: [
      {
        uid: "5",
        name: "Katrina West",
        avatar: "/images/avatar/avatar-11.jpg",
      },
      {
        uid: "6",
        name: "Henry Curtis",
        avatar: "/images/avatar/avatar-4.jpg",
      },
      {
        uid: "7",
        name: "Raul Bradley",
        avatar: "/images/avatar/avatar-5.jpg",
      },
    ],
  },
  {
    uid: "2",
    name: "Picnic with Family",
    image: "/images/travel/picnic-2.jpg",
    dateRange: "12 Jun - 16 Jun",
    members: [
      {
        uid: "5",
        name: "Katrina West",
        avatar: "/images/avatar/avatar-20.jpg",
      },
      {
        uid: "6",
        name: "Henry Curtis",
        avatar: null,
      },
      {
        uid: "7",
        name: "Raul Bradley",
        avatar: "/images/avatar/avatar-2.jpg",
      },
    ],
  },
  {
    uid: "3",
    name: "Turtaruga campy",
    image: "/images/travel/picnic-3.jpg",
    dateRange: "03 Mar - 05 Mar",
    members: [
      {
        uid: "5",
        name: "Katrina West",
        avatar: null,
      },
      {
        uid: "6",
        name: "Henry Curtis",
        avatar: "/images/avatar/avatar-19.jpg",
      },
      {
        uid: "7",
        name: "Raul Bradley",
        avatar: "/images/avatar/avatar-6.jpg",
      },
    ],
  },
];

export function MyPlan() {
  return (
    <Box className="mt-4 lg:mt-5">
      <div className="flex min-w-0 items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          My Plan
        </h2>
        <ActionMenu />
      </div>
      <div className="mt-3 space-y-4">
        {plans.map((plan) => (
          <PlanCard key={plan.uid} {...plan} />
        ))}
      </div>
    </Box>
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
