// Import Dependencies
import {
  ChevronUpIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { useDisclosure } from "hooks";
import { Button, Collapse } from "components/ui";

// ----------------------------------------------------------------------

export function Channels() {
  const [isOpen, { toggle }] = useDisclosure(true);

  return (
    <div>
      <div className="flex min-w-0 items-center justify-between px-4 pt-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          channels
        </span>
        <div className="flex ltr:-mr-1.5 rtl:-ml-1.5">
          <Button variant="flat" isIcon className="size-6 rounded-full">
            <MagnifyingGlassIcon className="size-3.5 stroke-2" />
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
        <div className="space-y-1.5 px-2 pt-1 text-xs-plus font-medium">
          <Button
            variant="flat"
            className="w-full justify-start gap-2 p-2 text-xs-plus"
          >
            <HomeIcon className="this:secondary size-4.5 text-this dark:text-this-lighter" />
            <span className="text-gray-800 dark:text-dark-100">Office</span>
          </Button>
          <Button
            variant="flat"
            className="w-full justify-start gap-2 p-2 text-xs-plus"
          >
            <HomeIcon className="this:warning size-4.5 text-this dark:text-this-lighter" />
            <span className="text-gray-800 dark:text-dark-100">
              Main Warehouse
            </span>
          </Button>
          <Button
            variant="flat"
            className="w-full justify-start gap-2 p-2 text-xs-plus"
          >
            <HomeIcon className="this:info size-4.5 text-this dark:text-this-lighter" />
            <span className="text-gray-800 dark:text-dark-100">
              Warehouse East
            </span>
          </Button>
          <Button
            variant="flat"
            className="w-full justify-start gap-2 p-2 text-xs-plus"
          >
            <HomeIcon className="this:success size-4.5 text-this dark:text-this-lighter" />
            <span className="text-gray-800 dark:text-dark-100">
              {" "}
              Warehouse #12
            </span>
          </Button>
        </div>
      </Collapse>
    </div>
  );
}
