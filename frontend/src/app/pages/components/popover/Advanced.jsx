// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { ArrowUpIcon, CalendarIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Avatar } from "components/ui";

// ----------------------------------------------------------------------

export function Advanced() {
  return (
    <div className="max-w-xl">
      <Popover className="relative w-full">
        <PopoverButton as={Button}>Lessons</PopoverButton>
        <Transition
          as={Fragment}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <PopoverPanel
            anchor={{ to: "bottom start", gap: 8 }}
            className="z-100 w-80 rounded-md border border-gray-300 bg-white px-4 py-3 shadow-lg shadow-gray-200/50 outline-hidden ring-primary-500/50 focus-visible:outline-hidden focus-visible:ring-3 dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
          >
            <h3 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
              Group Lesson
            </h3>
            <div className="mt-2">
              <p className="font-medium text-gray-600 dark:text-dark-100">
                Social Media Marketing
              </p>
              <p className="mt-1 text-xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap -space-x-1.5 ">
              <Avatar
                size={7}
                src="/images/avatar/avatar-5.jpg"
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "ring-3 ring-white dark:ring-dark-700",
                }}
              />
              <Avatar
                size={7}
                name="John Doe"
                initialColor="info"
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "ring-3 ring-white dark:ring-dark-700",
                }}
              />
              <Avatar
                size={7}
                src="/images/avatar/avatar-18.jpg"
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "ring-3 ring-white dark:ring-dark-700",
                }}
              />
              <Avatar
                size={7}
                src="/images/avatar/avatar-19.jpg"
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "ring-3 ring-white dark:ring-dark-700",
                }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="flex items-center gap-2">
                <CalendarIcon className="size-4.5 text-gray-400 dark:text-dark-300" />
                <span className="text-xs">25 May, 2022</span>
              </p>
              <Button isIcon className="h-7 w-7 rounded-full">
                <ArrowUpIcon className="size-4 rotate-45" />
              </Button>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  );
}
