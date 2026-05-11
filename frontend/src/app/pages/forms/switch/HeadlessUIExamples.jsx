// Import Dependencies
import { useState } from "react";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Spinner } from "components/ui";

// ----------------------------------------------------------------------

const HeadlessUIExamples = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-wrap gap-5">
      <Switch
        checked={checked}
        onChange={setChecked}
        className={clsx(
          "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 outline-hidden transition-colors duration-200 ease-in-out focus:outline-hidden",
          checked
            ? "this:primary bg-this dark:bg-this-light"
            : "bg-gray-300 dark:bg-surface-1",
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            checked
              ? "translate-x-6 bg-white rtl:-translate-x-6"
              : "translate-x-0 bg-white dark:bg-dark-50"
          } pointer-events-none flex size-4 transform items-center justify-center rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        >
          <Spinner
            isElastic
            color={clsx(checked ? "primary" : "neutral")}
            className="size-3 border-2"
          />
        </span>
      </Switch>

      <Switch
        checked={checked}
        onChange={setChecked}
        className={clsx(
          "relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full p-1 outline-hidden transition-colors duration-200 ease-in-out focus:outline-hidden",
          checked
            ? "this:primary bg-this dark:bg-this-light"
            : "bg-gray-300 dark:bg-surface-1",
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            checked
              ? "translate-x-6 bg-white rtl:-translate-x-6"
              : "translate-x-0 bg-white dark:bg-dark-50"
          } pointer-events-none flex size-4 transform items-center justify-center rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        >
          {checked ? (
            <CheckIcon
              className="size-3 text-primary-500"
              style={{ strokeWidth: "3" }}
            />
          ) : (
            <XMarkIcon
              className="size-3 text-gray-500 dark:text-dark-400"
              style={{ strokeWidth: "3" }}
            />
          )}
        </span>
      </Switch>
    </div>
  );
};

export { HeadlessUIExamples };
