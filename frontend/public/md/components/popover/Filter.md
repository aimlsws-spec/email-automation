```jsx
// Import Dependencies
import { Fragment, useRef, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";

// Local Imports
import { useFuse } from "hooks";
import { Input, Avatar, Button } from "components/ui";

// ----------------------------------------------------------------------

const people = [
  {
    id: 1,
    name: "Wade Cooper",
    position: "Web Designer",
    image: "/images/avatar/avatar-18.jpg",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    position: "Web Developer",
    image: "/images/avatar/avatar-14.jpg",
  },
  {
    id: 3,
    name: "Devon Webb",
    position: "Android Developer",
    image: "/images/avatar/avatar-6.jpg",
  },
  {
    id: 4,
    name: "Tom Cook",
    position: "Software Engineer",
    image: "/images/avatar/avatar-5.jpg",
  },
  {
    id: 5,
    name: "Tanya Fox",
    position: "UI/UX Designer",
    image: "/images/avatar/avatar-19.jpg",
  },
  {
    id: 6,
    name: "Hellen Schmidt",
    position: "Web Developer",
    image: "/images/avatar/avatar-20.jpg",
  },
];

export function Filter() {
  const [selected, setSelected] = useState(people[1]);
  const inputRef = useRef();

  const {
    result: filteredPeople,
    query,
    setQuery,
  } = useFuse(people, {
    keys: ["name", "position"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  return (
    <Popover className="relative w-full">
      <PopoverButton as={Button}>Popover</PopoverButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <PopoverPanel
          anchor={{ to: "bottom start", gap: 8 }}
          className="z-[100] w-80 overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg shadow-gray-200/50 outline-none ring-primary-500/50 focus-visible:outline-none focus-visible:ring dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
        >
          {({ open, close }) => {
            setTimeout(() => open && inputRef.current.focus());
            return (
              <Combobox
                value={selected}
                onChange={(list) => {
                  setSelected(list);
                  setQuery("");
                }}
              >
                <div className="relative">
                  <div className="bg-gray-100 dark:bg-dark-900">
                    <div className="flex items-center justify-between space-x-2 px-4 pb-1 pt-3 ">
                      <h3 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                        Select People
                      </h3>
                      <div className="contents">
                        <Button
                          onClick={close}
                          isIcon
                          variant="flat"
                          className="size-7 rounded-full ltr:-mr-2 rtl:-ml-2"
                        >
                          <XMarkIcon className="size-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative px-1">
                      <ComboboxInput
                        as={Input}
                        className="border-none"
                        ref={inputRef}
                        autoComplete="off"
                        placeholder="Search Users"
                        displayValue={(item) => item?.name}
                        onChange={(event) => setQuery(event.target.value)}
                        prefix={<MagnifyingGlassIcon className="size-4" />}
                      />
                    </div>
                  </div>

                  <ComboboxOptions
                    static
                    className="max-h-72 w-full overflow-y-auto overflow-x-hidden py-1 outline-none"
                  >
                    {filteredPeople.length === 0 && query !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                        Nothing found for {query}
                      </div>
                    ) : (
                      filteredPeople.map(({ item: person, refIndex }) => (
                        <ComboboxOption
                          key={refIndex}
                          className={({ selected, active }) =>
                            clsx(
                              "relative cursor-pointer select-none px-4 py-2 outline-none transition-colors",
                              active &&
                                !selected &&
                                "bg-gray-100 dark:bg-dark-600",
                              selected
                                ? "bg-primary-600 text-white dark:bg-primary-500"
                                : "text-gray-800 dark:text-dark-100",
                            )
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <div className="flex items-center space-x-2">
                              <Avatar src={person.image} name={person.name} />
                              <div className="overflow-hidden">
                                <span className="block truncate text-xs-plus">
                                  {person.name}
                                </span>
                                <span
                                  className={clsx(
                                    "mt-1 block truncate text-xs",
                                    selected
                                      ? "text-white"
                                      : "text-gray-400 dark:text-dark-300",
                                  )}
                                >
                                  {person.position}
                                </span>
                              </div>
                            </div>
                          )}
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </div>
              </Combobox>
            );
          }}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

```