// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Boundaries() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <Pagination total={20} defaultValue={10} boundaries={1}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div>
        <Pagination total={20} defaultValue={10} boundaries={2}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div>
        <Pagination total={20} defaultValue={10} boundaries={3}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
    </div>
  );
}
