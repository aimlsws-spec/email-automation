// Import Dependencies
import {
  ChevronUpIcon,
  Cog6ToothIcon,
  InboxIcon,
  PlusIcon,
  StarIcon,
  TableCellsIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Button, Collapse } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function Workspaces() {
  const [isOpen, { toggle }] = useDisclosure(true);

  return (
    <div>
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          Workspaces
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
                <InboxIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Inbox</span>
              </div>
              <span className="text-primary-600 dark:text-primary-400">2</span>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <StarIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Important</span>
              </div>
              <span className="text-primary-600 dark:text-primary-400">1</span>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <UsersIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Memebers</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <Cog6ToothIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Settings</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              variant="flat"
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
            >
              <div className="flex gap-2">
                <TableCellsIcon className="size-4.5 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <span>Timetable</span>
              </div>
            </Button>
          </li>
        </ul>
      </Collapse>
    </div>
  );
}
