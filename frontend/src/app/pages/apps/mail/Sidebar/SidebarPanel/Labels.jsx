// Import Dependencies
import {
  ChevronUpIcon,
  PlusIcon,
  StarIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { HiOutlineTag } from "react-icons/hi";

// Local Imports
import { Button, Collapse } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function Labels() {
  const [isOpen, { toggle }] = useDisclosure(true);

  return (
    <div>
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          Labels
        </span>
        <div className="flex ltr:-mr-1.5 rtl:-ml-1.5">
          <Button variant="flat" isIcon className="size-6 rounded-full">
            <PlusIcon className="size-3.5 stroke-2" />
          </Button>
          <Button
            onClick={toggle}
            variant="flat"
            isIcon
            className="size-6 rounded-full"
          >
            <ChevronUpIcon
              className={clsx(
                "size-3.5 stroke-2 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>
      <Collapse in={isOpen}>
        <ul className="space-y-1.5 px-2 pt-1 font-medium">
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <StarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Important</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <StarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Saved</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <ArchiveBoxIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Archive</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <HiOutlineTag className="this:secondary size-4.5 text-this dark:text-this-light" />
                <span>Work</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <HiOutlineTag className="this:info size-4.5 text-this dark:text-this-light" />
                <span>Personal</span>
              </div>
            </Button>
          </li>
        </ul>
      </Collapse>
    </div>
  );
}
