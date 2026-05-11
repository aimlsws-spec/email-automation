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
import { Avatar, Input, Tag } from "components/ui";
import { allUsers } from "../../data";

// ----------------------------------------------------------------------

export function AssignsField({ onChange, value, name }) {
  const [query, setQuery] = useState("");
  const users = allUsers || [];

  const filteredMembers =
    query === ""
      ? users
      : users.filter((user) =>
          user.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  const removeItem = (uid) => {
    const newValue = value.filter((item) => item.uid !== uid);
    onChange(newValue);
  };

  return (
    <Combobox
      value={value || null}
      onChange={onChange}
      name={name}
      by={(a, b) => a?.uid === b?.uid}
      multiple
    >
      {({ open }) => (
        <div className="relative">
          <Label>Assigned To:</Label>

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
                value.map((user) => (
                  <li key={user.uid}>
                    <Tag
                      onClick={() => removeItem(user.uid)}
                      component="button"
                      type="button"
                      variant="outlined"
                      className="flex h-6 rounded-full p-px align-top"
                    >
                      <Avatar
                        size={5.5}
                        src={user.avatar}
                        name={user.name}
                        initialColor="auto"
                        classNames={{ display: "text-tiny" }}
                      />
                      <span className="mx-2">{user.name}</span>
                    </Tag>
                  </li>
                ))
              ) : (
                <span className="h-6 italic text-gray-400 dark:text-dark-300">
                  Unassigned
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
                displayValue={(user) => user.text}
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                value={query}
                placeholder="Select Members"
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
              {filteredMembers.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                  Nothing found for {query}
                </div>
              ) : (
                filteredMembers.map((user) => (
                  <ComboboxOption
                    key={user.uid}
                    className={({ selected, active }) =>
                      clsx(
                        "relative cursor-pointer select-none px-3 py-2 outline-hidden transition-colors",
                        (active || selected) &&
                          "text-gray-800 dark:text-dark-100",
                        active && !selected && "bg-gray-100 dark:bg-dark-600",
                        selected && "bg-gray-200 dark:bg-dark-500",
                      )
                    }
                    value={user}
                  >
                    {({ selected }) => (
                      <span className="flex items-center justify-between">
                        <span className="flex min-w-0 items-center gap-2">
                          <Avatar
                            size={6}
                            name={user.name}
                            src={user.avatar}
                            initialColor="auto"
                            classNames={{ display: "text-tiny-plus" }}
                          />
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {user.name}
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

AssignsField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  name: PropTypes.string,
};
