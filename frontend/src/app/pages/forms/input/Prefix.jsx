// Import Dependencies
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const Prefix = () => {
  return (
    <div className="max-w-xl">
      <Input
        label="Label input"
        placeholder="Search here..."
        prefix={<MagnifyingGlassIcon className="size-4.5" />}
      />
    </div>
  );
};

export { Prefix };
