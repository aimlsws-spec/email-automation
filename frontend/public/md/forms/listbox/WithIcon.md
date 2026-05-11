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
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

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

const WithIcon = () => {
  return (
    <div className="max-w-xl">
      <Listbox as="div" name="language" defaultValue={languages[1]}>
        {({ open }) => (
          <>
            <Label>Label text:</Label>
            <div className="relative mt-1.5">
              <ListboxButton
                className={clsx(
                  "relative w-full cursor-pointer rounded-lg border py-2 pl-3 pr-9 text-start outline-none transition-colors focus:outline-none focus-visible:border-primary-600  dark:focus-visible:border-primary-500 rtl:pl-9 rtl:pr-3",
                  open
                    ? "border-primary-600 dark:border-primary-500"
                    : "border-gray-300 hover:border-gray-400 dark:border-dark-450 dark:hover:border-dark-400",
                )}
              >
                {({ value }) => (
                  <>
                    <div className="flex items-center space-x-2 ">
                      <img
                        className="size-5"
                        src={value.flagUrl}
                        alt={value.name}
                      />
                      <span>{value.name}</span>
                    </div>
                    <span className="pointer-events-none absolute inset-y-0 flex items-center ltr:right-0 ltr:pr-2 rtl:left-0 rtl:pl-2">
                      <ChevronUpDownIcon
                        className="size-5 text-gray-400 transition-transform dark:text-dark-300"
                        aria-hidden="true"
                      />
                    </span>
                  </>
                )}
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
                <ListboxOptions
                  anchor={{ to: "bottom end", gap: 8 }}
                  className="absolute z-10 w-[--button-width] max-h-60 overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none focus-visible:outline-none dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
                >
                  {languages.map((language) => (
                    <ListboxOption
                      key={language.id}
                      className={({ selected, active }) =>
                        clsx(
                          "relative cursor-pointer select-none px-4 py-2 outline-none transition-colors",
                          active && !selected && "bg-gray-100 dark:bg-dark-600",
                          selected
                            ? "bg-primary-600 text-white dark:bg-primary-500"
                            : "text-gray-800 dark:text-dark-100",
                        )
                      }
                      value={language}
                    >
                      <div className="flex items-center space-x-2 ">
                        <img
                          className="size-5"
                          src={language.flagUrl}
                          alt={language.name}
                        />
                        <span>{language.name}</span>
                      </div>
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

export { WithIcon };
```