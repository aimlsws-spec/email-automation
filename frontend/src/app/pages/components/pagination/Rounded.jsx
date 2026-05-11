// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Rounded() {
  return (
    <div className="max-w-xl">
      <Pagination
        total={10}
        defaultValue={2}
        classNames={{
          root: "rounded-full",
          control: "rounded-full",
        }}
      >
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
      </Pagination>
    </div>
  );
}
