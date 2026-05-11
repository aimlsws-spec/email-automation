// Local Imports
import {
  Pagination,
  PaginationFirst,
  PaginationItems,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function WithEdges() {
  return (
    <div className="max-w-xl">
      <Pagination total={10} defaultValue={2}>
        <PaginationFirst />
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
        <PaginationLast />
      </Pagination>
    </div>
  );
}
