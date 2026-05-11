// Import Dependencies
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

// Local Imports
import { Avatar, Checkbox, Swap, SwapOff, SwapOn } from "components/ui";

// ----------------------------------------------------------------------

const Controlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex space-x-3 ">
        <Swap
          value={checked ? "on" : "off"}
          onChange={(val) => setChecked(val === "on")}
          effect="flip"
        >
          <SwapOn>
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-500">
              <CheckIcon className="size-6 text-white" />
            </div>
          </SwapOn>

          <SwapOff>
            <Avatar
              src="/images/avatar/avatar-5.jpg"
              size={10}
              className="flex rounded-full ring-offset-2 ring-offset-white transition-colors hover:ring-3 hover:ring-primary-500/50 dark:ring-offset-dark-700"
            />
          </SwapOff>
        </Swap>
        <div>
          <p className="text-sm-plus font-medium text-gray-800 dark:text-dark-100">
            John Doe
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
            Product Manager
          </p>
        </div>
      </div>

      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        label="John Doe"
        className="rounded-full"
      />
    </div>
  );
};

export { Controlled };
