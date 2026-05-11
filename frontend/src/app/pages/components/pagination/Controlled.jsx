// Import Dependencies
import { useState } from "react";

// Local Imports
import {
  Pagination,
  Input,
  PaginationPrevious,
  PaginationItems,
  PaginationNext,
} from "components/ui";

// ----------------------------------------------------------------------

export function Controlled() {
  const [page, setPage] = useState(2);
  const total = 99;

  const handleChange = (e) => {
    const val = +e.target.value;
    if (val <= total && val >= 0) {
      setPage(val);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <Input
        value={page}
        onChange={handleChange}
        type="number"
        label="Enter page"
        placeholder="Enter Page"
        classNames={{ root: "w-fit" }}
      />
      <Pagination total={total} value={page} onChange={setPage}>
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
      </Pagination>
    </div>
  );
}
