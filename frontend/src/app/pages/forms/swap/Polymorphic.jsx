// Import Dependencies
import { PencilIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Swap, SwapOff, SwapOn } from "components/ui";

// ----------------------------------------------------------------------

const Polymorphic = () => {
  return (
    <Swap
      component={Button}
      variant="outlined"
      isIcon
      defaultValue="on"
      className="size-8 rounded-full"
      effect="rotate"
    >
      <SwapOn>
        <PencilIcon className="inline size-4" />
      </SwapOn>
      <SwapOff>
        <XMarkIcon className="inline size-4 stroke-2" />
      </SwapOff>
    </Swap>
  );
};

export { Polymorphic };
