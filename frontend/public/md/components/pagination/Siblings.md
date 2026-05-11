```jsx
// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Siblings() {
  return (
    <div className="max-w-xl space-y-4">
      <div>
        <Pagination total={20} defaultValue={10} siblings={1}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div>
        <Pagination total={20} defaultValue={10} siblings={2}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div>
        <Pagination total={20} defaultValue={10} siblings={3}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
    </div>
  );
}
```