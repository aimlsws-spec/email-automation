// Import Dependencies
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Footer() {
  return (
    <div className="flex flex-col p-4">
      <Button
        unstyled
        className="relative h-11 w-full justify-between overflow-hidden rounded-lg bg-linear-to-r from-purple-500 to-indigo-600 px-4 text-white before:pointer-events-none before:absolute before:inset-0 before:transition-colors hover:before:bg-black/20 focus:before:bg-black/20"
      >
        <span> Upgrade to Pro</span>
        <ChevronDoubleRightIcon className="size-5" />
      </Button>
    </div>
  );
}
