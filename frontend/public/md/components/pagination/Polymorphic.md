```jsx
// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";

// ----------------------------------------------------------------------

export function Polymorphic() {
  return (
    <div className="max-w-xl">
      <Pagination
        total={10}
        defaultValue={2}
        getItemProps={(p) => ({ component: "a", href: `#page-${p}` })}
      >
        <PaginationPrevious component="a" href="#page-1" />
        <PaginationItems />
        <PaginationNext component="a" href="#page-10" />
      </Pagination>
    </div>
  );
}
```