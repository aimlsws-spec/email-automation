// Import Dependencies
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/20/solid";

// Local Imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Tag,
} from "components/ui";

// ----------------------------------------------------------------------

const Custom = () => {
  return (
    <div className="max-w-xl">
      <Accordion defaultValue="item-2">
        <AccordionItem
          value="item-1"
          className={({ open }) =>
            clsx(
              "rounded-lg transition-transform duration-300",
              open
                ? "z-1 scale-[1.03] border bg-white shadow-sm dark:border-dark-500 dark:bg-dark-700"
                : "z-0",
            )
          }
        >
          {({ open }) => (
            <>
              <AccordionButton
                className={clsx(
                  "flex w-full cursor-pointer items-center justify-between rounded-t-lg p-4 text-base font-medium text-gray-700 outline-hidden ring-primary-500/50 transition-colors duration-300 focus-visible:ring-3 dark:text-dark-100",
                  !open && "bg-gray-150 dark:bg-dark-500",
                )}
              >
                <p>Accordion Item 1</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "rotate-[135deg]",
                  )}
                >
                  <PlusIcon className="size-6" />
                </div>
              </AccordionButton>
              <AccordionPanel className="p-4 pt-0">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Commodi earum magni officiis possimus repellendus. Accusantium
                  adipisci aliquid praesentium quaerat voluptate.
                </p>
                <div className="mt-3 space-x-2 ">
                  <Tag href="#">Tag 1</Tag>
                  <Tag href="#">Tag 2</Tag>
                </div>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className={({ open }) =>
            clsx(
              "rounded-lg transition-transform duration-300",
              open
                ? "z-1 scale-[1.03] border bg-white shadow-sm dark:border-dark-500 dark:bg-dark-700"
                : "z-0",
            )
          }
        >
          {({ open }) => (
            <>
              <AccordionButton
                className={clsx(
                  "flex w-full cursor-pointer items-center justify-between p-4 text-base font-medium text-gray-700 outline-hidden ring-primary-500/50 transition-colors duration-300 focus-visible:ring-3 dark:text-dark-100",
                  !open && "bg-gray-150 dark:bg-dark-500",
                )}
              >
                <p>Accordion Item 2</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "rotate-[135deg]",
                  )}
                >
                  <PlusIcon className="size-6" />
                </div>
              </AccordionButton>
              <AccordionPanel className="p-4 pt-0">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Commodi earum magni officiis possimus repellendus. Accusantium
                  adipisci aliquid praesentium quaerat voluptate.
                </p>
                <div className="mt-3 space-x-2 ">
                  <Tag href="#">Tag 1</Tag>
                  <Tag href="#">Tag 2</Tag>
                </div>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className={({ open }) =>
            clsx(
              "rounded-lg transition-transform duration-300",
              open
                ? "z-1 scale-[1.03] border bg-white shadow-sm dark:border-dark-500 dark:bg-dark-700"
                : "z-0",
            )
          }
        >
          {({ open }) => (
            <>
              <AccordionButton
                className={clsx(
                  "flex w-full cursor-pointer items-center justify-between rounded-b-lg p-4 text-base font-medium text-gray-700 outline-hidden ring-primary-500/50 transition-colors duration-300 focus-visible:ring-3 dark:text-dark-100",
                  !open && "bg-gray-150 dark:bg-dark-500",
                )}
              >
                <p>Accordion Item 3</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-gray-400 transition-transform duration-300 dark:text-dark-300",
                    open && "rotate-[135deg]",
                  )}
                >
                  <PlusIcon className="size-6" />
                </div>
              </AccordionButton>
              <AccordionPanel className="p-4 pt-0">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Commodi earum magni officiis possimus repellendus. Accusantium
                  adipisci aliquid praesentium quaerat voluptate.
                </p>
                <div className="mt-3 space-x-2 ">
                  <Tag href="#">Tag 1</Tag>
                  <Tag href="#">Tag 2</Tag>
                </div>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export { Custom };
