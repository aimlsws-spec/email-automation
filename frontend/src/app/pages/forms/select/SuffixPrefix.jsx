// Import Dependencies
import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Select } from "components/ui";

// ----------------------------------------------------------------------

const SuffixPrefix = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Location"
        defaultValue="USA"
        prefix={<MapPinIcon className="w-1/2" />}
        suffix={<ChevronUpDownIcon className="w-1/2" />}
        data={["Canada", "USA", "Germany", "Japan"]}
      />
    </div>
  );
};

export { SuffixPrefix };
