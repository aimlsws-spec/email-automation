```jsx
// Import Dependencies
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const languages = [
  {
    id: 1,
    name: "English",
    flagUrl: "/images/flags/svg/rounded/united-kingdom.svg",
  },
  {
    id: 2,
    name: "Spanish",
    flagUrl: "/images/flags/svg/rounded/spain.svg",
  },
  {
    id: 3,
    name: "Russian",
    flagUrl: "/images/flags/svg/rounded/russia.svg",
  },
  {
    id: 4,
    name: "Japanese",
    flagUrl: "/images/flags/svg/rounded/japan.svg",
  },
  {
    id: 5,
    name: "Chinese",
    flagUrl: "/images/flags/svg/rounded/china.svg",
  },
];

export function WithIcon() {
  const [selected, setSelected] = useState(languages[0]);
  const [query, setQuery] = useState("");

  const filteredLangs =
    query === ""
      ? languages
      : languages.filter((language) =>
          language.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <div className="max-w-xl">
      <Combobox as="div" value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Label>Select Language:</Label>

            <div className="relative mt-1">
              <div className="relative w-full cursor-pointer overflow-hidden">
                <ComboboxInput
                  as={Input}
                  autoComplete="off"
                  className="px-10"
                  displayValue={(language) => language.name}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 flex items-center ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3">
                  <img
                    className="size-5"
                    src={selected.flagUrl}
                    alt={selected.name}
                  />
                </div>
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
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                afterLeave={() => setQuery("")}
              >
                <ComboboxOptions
                  anchor={{ to: "bottom end", gap: 8 }}
                  className="absolute z-10 max-h-60 w-[--input-width] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
                >
                  {filteredLangs.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                      Nothing found for {query}
                    </div>
                  ) : (
                    filteredLangs.map((language) => (
                      <ComboboxOption
                        key={language.id}
                        className={({ selected, focus }) =>
                          clsx(
                            "relative cursor-pointer select-none px-4 py-2 outline-none transition-colors",
                            focus &&
                              !selected &&
                              "bg-gray-100 dark:bg-dark-600",
                            selected
                              ? "bg-primary-600 text-white dark:bg-primary-500"
                              : "text-gray-800 dark:text-dark-100",
                          )
                        }
                        value={language}
                      >
                        <>
                          <div className="flex items-center space-x-2 ">
                            <img
                              className="size-5"
                              src={language.flagUrl}
                              alt={language.name}
                            />
                            <span>{language.name}</span>
                          </div>
                        </>
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
          </>
        )}
      </Combobox>
    </div>
  );
}
```