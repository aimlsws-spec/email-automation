```jsx
// Import Dependencies
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// Local Imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Tag,
} from "components/ui";

// ----------------------------------------------------------------------

const Primary = () => {
  return (
    <div className="max-w-xl">
      <Accordion
        defaultValue="item-1"
        className="flex flex-col divide-y divide-primary-400 overflow-hidden rounded-lg border border-primary-600 dark:border-primary-500"
      >
        <AccordionItem value="item-1">
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between bg-primary-600 p-4 text-base font-medium text-white outline-none focus-visible:opacity-90 dark:bg-primary-500 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 1</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-primary-50 transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-3 space-x-2 ">
              <Tag href="#">Tag 1</Tag>
              <Tag href="#">Tag 2</Tag>
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between bg-primary-600 p-4 text-base font-medium text-white outline-none focus-visible:opacity-90 dark:bg-primary-500 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 2</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-primary-50 transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-3 space-x-2 ">
              <Tag href="#">Tag 1</Tag>
              <Tag href="#">Tag 2</Tag>
            </div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionButton className="flex w-full cursor-pointer items-center justify-between bg-primary-600 p-4 text-base font-medium text-white outline-none focus-visible:opacity-90 dark:bg-primary-500 sm:px-5">
            {({ open }) => (
              <>
                <p>Accordion Item 3</p>
                <div
                  className={clsx(
                    "text-sm font-normal leading-none text-primary-50 transition-transform duration-300",
                    open && "-rotate-180",
                  )}
                >
                  <ChevronDownIcon className="size-6" />
                </div>
              </>
            )}
          </AccordionButton>
          <AccordionPanel className="p-4 sm:px-5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              earum magni officiis possimus repellendus. Accusantium adipisci
              aliquid praesentium quaerat voluptate.
            </p>
            <div className="mt-3 space-x-2 ">
              <Tag href="#">Tag 1</Tag>
              <Tag href="#">Tag 2</Tag>
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export { Primary };
```