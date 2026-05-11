// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Sizes() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <Pagination
          total={10}
          defaultValue={2}
          classNames={{
            root: "text-xs-plus",
            control: "h-7 min-w-[1.75rem] px-2",
            icon: "h-4 w-4",
          }}
        >
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div>
        <Pagination total={10} defaultValue={2}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>

      <div>
        <Pagination
          total={10}
          defaultValue={2}
          classNames={{
            root: "text-sm-plus",
            control: "h-9 min-w-[2.25rem] px-2",
            icon: "h-5 w-5",
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
