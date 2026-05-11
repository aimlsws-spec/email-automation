// Import Dependencies
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Input, Spinner } from "components/ui";
import { useDebounceValue } from "hooks";

// ----------------------------------------------------------------------

const Search = () => {
  const [search, setSearch] = useState("");
  const [deferredSearch] = useDebounceValue(search, 500);
  return (
    <div className="px-3 py-1">
      <Input
        placeholder="Search here..."
        unstyled
        className="h-8 rounded-lg bg-gray-150 px-9 py-2 text-xs-plus ring-primary-500/50 placeholder:text-gray-400 focus:ring-3 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        prefix={
          deferredSearch !== search ? (
            <Spinner
              color="primary"
              variant="soft"
              className="size-4 border-2"
            />
          ) : (
            <MagnifyingGlassIcon className="size-4" />
          )
        }
      />
    </div>
  );
};

export { Search };
