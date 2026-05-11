// Import Dependencies
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Input } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

export function Header() {
  const { lgAndUp } = useBreakpointsContext();

  return (
    <div className="flex items-center justify-between gap-3 sm:gap-5">
      <div className="flex w-full max-w-lg -space-x-px ">
        <Input
          placeholder="Location, Country or Destination..."
          classNames={{
            input:
              "relative hover:z-1 focus:z-1 ltr:rounded-r-none rtl:rounded-l-none",
            root: "flex-1",
          }}
          prefix={lgAndUp && <MagnifyingGlassIcon className="size-4.5" />}
        />
        <Button
          color="primary"
          className="px-3 lg:px-5 ltr:rounded-l-none rtl:rounded-r-none"
        >
          <span className="max-lg:hidden">Search</span>
          <MagnifyingGlassIcon className="size-5 lg:hidden" />
        </Button>
      </div>
    </div>
  );
}
