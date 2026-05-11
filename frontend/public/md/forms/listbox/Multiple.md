```jsx
// Import Dependencies
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";

// ----------------------------------------------------------------------

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

const Multiple = () => {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[3]]);

  return (
    <div className="max-w-xl">
      <Listbox
        as="div"
        value={selectedPeople}
        onChange={setSelectedPeople}
        multiple
      >
        {({ open }) => (
          <>
            <Label>Label text:</Label>
            <div className="relative mt-1.5">
              <ListboxButton
                className={clsx(
                  "relative w-full cursor-pointer rounded-lg border py-2 pl-3 pr-9 text-start outline-none transition-colors focus:outline-none focus-visible:border-primary-600 dark:focus-visible:border-primary-500 rtl:pl-9 rtl:pr-3",
                  open
                    ? "border-primary-600 dark:border-primary-500"
                    : "border-gray-300 hover:border-gray-400 dark:border-dark-450 dark:hover:border-dark-400",
                )}
              >
                <span className="block truncate">
                  {selectedPeople.length > 0
                    ? selectedPeople.map((person) => person.name).join(", ")
                    : "Select Peoples"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 flex items-center ltr:right-0 ltr:pr-2 rtl:left-0 rtl:pl-2">
                  <ChevronDownIcon
                    className={clsx(
                      "size-5 text-gray-400 transition-transform dark:text-dark-300",
                      open && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none">
                  {people.map((person, personIdx) => (
                    <ListboxOption
                      key={personIdx}
                      className={({ selected, active }) =>
                        clsx(
                          "relative cursor-pointer select-none py-2 pl-10 pr-4 outline-none transition-colors rtl:pl-4 rtl:pr-10",
                          active && !selected && "bg-gray-100 dark:bg-dark-600",
                          selected
                            ? "bg-primary-600 text-white dark:bg-primary-500"
                            : "text-gray-800 dark:text-dark-100",
                        )
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <>
                          <span className="block truncate">{person.name}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 flex items-center ltr:left-0 ltr:pl-3 rtl:right-0 rtl:pr-3">
                              <CheckIcon
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export { Multiple };
```