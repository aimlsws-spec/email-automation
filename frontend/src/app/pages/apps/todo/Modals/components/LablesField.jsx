// Import Dependencies
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { labels } from "../../data";
import { Input, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function LabelsField({ onChange, value, name }) {
  const [query, setQuery] = useState("");

  const filteredLabels =
    query === ""
      ? labels
      : labels.filter((label) =>
          label.text
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  const removeItem = (id) => {
    const newValue = value.filter((item) => item.id !== id);
    onChange(newValue);
  };

  return (
    <Combobox
      value={value || null}
      onChange={onChange}
      name={name}
      by={(a, b) => a?.id === b?.id}
      multiple
    >
      {({ open }) => (
        <div className="relative">
          <Label>Labels:</Label>

          <div
            className={clsx(
              "relative mt-1.5 rounded-lg border transition-colors",
              open
                ? "border-primary-600 dark:border-primary-500"
                : "border-gray-300 hover:border-gray-400 dark:border-dark-450 dark:hover:border-dark-400",
            )}
          >
            <ul
              className={clsx(
                "flex flex-wrap gap-1.5 border-b px-3 py-2 transition-colors",
                open
                  ? "border-primary-600 dark:border-primary-500"
                  : "border-gray-300 dark:border-dark-450",
              )}
            >
              {value.length > 0 ? (
                value.map((label) => (
                  <li key={label.id}>
                    <Tag
                      onClick={() => removeItem(label.id)}
                      component="button"
                      type="button"
                      color={label.color}
                      variant="soft"
                    >
                      {label.text}
                    </Tag>
                  </li>
                ))
              ) : (
                <span className="h-6 italic text-gray-400 dark:text-dark-300">
                  Not Selected Labels
                </span>
              )}
            </ul>

            <div className="relative w-full cursor-default overflow-hidden px-3 py-2 text-start outline-hidden ltr:pr-9 rtl:pl-9">
              <ComboboxInput
                as={Input}
                unstyled
                classNames={{
                  root: "flex-1",
                  input:
                    "placeholder:text-gray-400 dark:placeholder:text-dark-300",
                }}
                displayValue={(label) => label.text}
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                value={query}
                placeholder="Select Labels"
              />
              <ComboboxButton className="absolute inset-y-0 flex items-center ltr:right-0 ltr:pr-2 rtl:left-0 rtl:pl-2">
                <ChevronDownIcon
                  className={clsx(
                    "size-5 text-gray-400 transition-transform dark:text-dark-300",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>

            <Transition
              as={ComboboxOptions}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
              className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none"
            >
              {filteredLabels.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                  Nothing found for {query}
                </div>
              ) : (
                filteredLabels.map((label) => (
                  <ComboboxOption
                    key={label.id}
                    className={({ selected, active }) =>
                      clsx(
                        "relative cursor-pointer select-none px-4 py-2 outline-hidden transition-colors",
                        (active || selected) &&
                          "text-gray-800 dark:text-dark-100",
                        active && !selected && "bg-gray-100 dark:bg-dark-600",
                        selected && "bg-gray-200 dark:bg-dark-500",
                      )
                    }
                    value={label}
                  >
                    {({ selected }) => (
                      <span className="flex items-center justify-between">
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={clsx(
                              "size-2 rounded-full",
                              label.color === "neutral"
                                ? "bg-gray-200 dark:bg-dark-400"
                                : `bg-this this:${label.color}`,
                            )}
                          />
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {label.text}
                          </span>
                        </span>
                        {selected && <CheckIcon className="size-4.5" />}
                      </span>
                    )}
                  </ComboboxOption>
                ))
              )}
            </Transition>
          </div>
        </div>
      )}
    </Combobox>
  );
}

LabelsField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  name: PropTypes.string,
};
