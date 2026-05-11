import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Custom() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <Pagination
          total={10}
          defaultValue={2}
          classNames={{
            root: "gap-1.5 bg-transparent dark:bg-transparent",
            control: "bg-gray-150 dark:bg-surface-2",
          }}
        >
          <PaginationPrevious Icon={ArrowLeftIcon} />
          <PaginationItems />
          <PaginationNext Icon={ArrowRightIcon} />
        </Pagination>
      </div>
      <div>
        <Pagination
          total={10}
          defaultValue={2}
          classNames={{
            root: "gap-1.5 bg-transparent dark:bg-transparent",
            control: "rounded-full bg-gray-150 dark:bg-surface-2",
          }}
        >
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
    </div>
  );
}
