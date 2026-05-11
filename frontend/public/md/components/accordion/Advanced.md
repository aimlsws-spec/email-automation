```jsx
// Import Dependencies
import clsx from "clsx";
import { ArrowUpRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

// Local Imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Button,
} from "components/ui";

// ----------------------------------------------------------------------

const Advanced = () => {
  return (
    <div className="max-w-xl">
      <Accordion
        defaultValue="item-1"
        className="flex flex-col space-y-4 sm:space-y-5 lg:space-y-6"
      >
        <AccordionItem
          value="item-1"
          className="overflow-hidden rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <div className="flex items-center justify-between bg-gray-150 p-4 dark:bg-dark-500 sm:px-5">
            <div className="mr-2 flex min-w-0 items-center space-x-3 tracking-wide outline-none ">
              <Avatar size={10} src="/images/avatar/avatar-20.jpg" />
              <div className="min-w-0">
                <p className="truncate text-gray-800 dark:text-dark-50">
                  Simon Tods
                </p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-dark-200">
                  Web Developer
                </p>
              </div>
            </div>
            <AccordionButton
              component={Button}
              variant="flat"
              className="-mr-1 size-8 shrink-0 rounded-full p-0"
            >
              {({ open }) => (
                <div
                  className={clsx(
                    "text-sm font-normal leading-none transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              )}
            </AccordionButton>
          </div>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-4 flex justify-between space-x-2 ">
              <div className="flex flex-wrap -space-x-1.5 ">
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  initialColor="info"
                  name="John Doe"
                  classNames={{
                    root: "origin-bottom text-xs transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />

                <Avatar
                  size={7}
                  src="/images/avatar/avatar-18.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-19.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
              </div>
              <Button className="size-7 shrink-0 rounded-full p-0">
                <ArrowUpRightIcon className="size-4.5" />
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="overflow-hidden rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <div className="flex items-center justify-between bg-gray-150 p-4 dark:bg-dark-500 sm:px-5">
            <div className="mr-2 flex min-w-0 items-center space-x-3 tracking-wide outline-none ">
              <Avatar size={10} src="/images/avatar/avatar-5.jpg" />
              <div className="min-w-0">
                <p className="truncate text-gray-800 dark:text-dark-50">
                  Konnor Guzman
                </p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-dark-200">
                  Frontend Developer
                </p>
              </div>
            </div>
            <AccordionButton
              component={Button}
              variant="flat"
              className="-mr-1 size-8 shrink-0 rounded-full p-0"
            >
              {({ open }) => (
                <div
                  className={clsx(
                    "text-sm font-normal leading-none transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              )}
            </AccordionButton>
          </div>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-4 flex justify-between space-x-2 ">
              <div className="flex flex-wrap -space-x-1.5 ">
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  initialColor="info"
                  name="John Doe"
                  classNames={{
                    root: "origin-bottom text-xs transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />

                <Avatar
                  size={7}
                  src="/images/avatar/avatar-18.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-19.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
              </div>
              <Button className="size-7 shrink-0 rounded-full p-0">
                <ArrowUpRightIcon className="size-4.5" />
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className="overflow-hidden rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <div className="flex items-center justify-between bg-gray-150 p-4 dark:bg-dark-500 sm:px-5">
            <div className="mr-2 flex min-w-0 items-center space-x-3 tracking-wide outline-none ">
              <Avatar size={10} src="/images/avatar/avatar-19.jpg" />
              <div className="min-w-0">
                <p className="truncate text-gray-800 dark:text-dark-50">
                  Derrick Simmons
                </p>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-dark-200">
                  UI/UX Designer
                </p>
              </div>
            </div>
            <AccordionButton
              component={Button}
              variant="flat"
              className="-mr-1 size-8 shrink-0 rounded-full p-0"
            >
              {({ open }) => (
                <div
                  className={clsx(
                    "text-sm font-normal leading-none transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              )}
            </AccordionButton>
          </div>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-4 flex justify-between space-x-2 ">
              <div className="flex flex-wrap -space-x-1.5 ">
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  initialColor="info"
                  name="John Doe"
                  classNames={{
                    root: "origin-bottom text-xs transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />

                <Avatar
                  size={7}
                  src="/images/avatar/avatar-18.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-19.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
              </div>
              <Button className="size-7 shrink-0 rounded-full p-0">
                <ArrowUpRightIcon className="size-4.5" />
              </Button>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export { Advanced };

```