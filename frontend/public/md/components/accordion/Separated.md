```jsx
// Import Dependencies
import clsx from "clsx";
import { ChevronDownIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";

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

const Separated = () => {
  return (
    <div className="max-w-xl">
      <Accordion
        defaultValue="item-1"
        className="flex flex-col space-y-4 rounded-lg sm:space-y-5 lg:space-y-6"
      >
        <AccordionItem
          value="item-1"
          className="rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between rounded-lg p-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 1</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 pt-0 sm:px-5">
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
          className="rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between rounded-lg p-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 2</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 pt-0 sm:px-5">
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
          className="rounded-lg border border-gray-150 dark:border-dark-500"
        >
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between rounded-lg p-4 text-base font-medium text-gray-700 outline-none ring-primary-500/50 ring-offset-2 ring-offset-white focus-visible:ring dark:text-dark-100 dark:ring-offset-dark-700 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 3</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 pt-0 sm:px-5">
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

export { Separated };

```