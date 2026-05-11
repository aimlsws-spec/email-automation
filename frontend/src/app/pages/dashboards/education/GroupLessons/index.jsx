// Import Dependencies
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { Button } from "components/ui";
import { LessonCard } from "./LessonCard";

// ----------------------------------------------------------------------

const lessons = [
  {
    uid: 1,
    name: "Social Media Marketing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    date: "25 May, 2022",
    students: [
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
    uid: 2,
    name: "Figma: Create Design System",
    description: "Lonsectetur adipisicing elit.",
    date: "12 June, 2022",
    students: [
      {
        uid: "8",
        name: "Samantha Shelton",
        avatar: null,
      },
      {
        uid: "9",
        name: "Corey Evans",
        avatar: "/images/avatar/avatar-6.jpg",
      },
      {
        uid: "10",
        name: "Lance Tucker",
        avatar: null,
      },
    ],
  },
  {
    uid: 3,
    name: "Getting started with Vue",
    description: "Ossumenda ratione repellat aliquid?",
    date: "06 September, 2024",
    students: [
      {
        uid: "8",
        name: "Samantha Shelton",
        avatar: null,
      },
      {
        uid: "9",
        name: "Corey Evans",
        avatar: "/images/avatar/avatar-6.jpg",
      },
      {
        uid: "10",
        name: "Lance Tucker",
        avatar: null,
      },
    ],
  },
];

export function GroupLessons() {
  return (
    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Group Lessons
        </h2>
        <ActionMenu />
      </div>
      <div className="mt-3 flex flex-col justify-between space-y-4">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.uid}
            name={lesson.name}
            description={lesson.description}
            date={lesson.date}
            students={lesson.students}
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
