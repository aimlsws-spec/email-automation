```jsx
// Import Dependencies
import { useState } from "react";
import { useDebounceValue } from "hooks";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Input, Spinner } from "components/ui";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"
        opacity="0.4"
      ></path>
      <path fill="currentColor" d="M11.8 6L8 15.1h-.9L10.8 6h1z"></path>
    </svg>
  );
}

// ----------------------------------------------------------------------

const Search = () => {
  const [search, setSearch] = useState("");
  const [deferredSearch] = useDebounceValue(search, 500);
  return (
    <div className="max-w-xl">
      <Input
        label="Label input"
        placeholder="Search here..."
        unstyled
        className="rounded-lg bg-gray-150 px-9 py-2 ring-primary-500/50 placeholder:text-gray-400 focus:ring dark:bg-dark-900 dark:placeholder:text-dark-200/70"
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
            <MagnifyingGlassIcon className="size-4.5" />
          )
        }
        suffix={<Icon />}
      />
    </div>
  );
};

export { Search };
```