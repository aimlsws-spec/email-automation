// Import Dependencies
import { Fragment, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// ----------------------------------------------------------------------

const charactersList = [
  {
    id: 1,
    image: "https://img.icons8.com/clouds/256/000000/futurama-bender.png",
    label: "Bender Bending Rodríguez",
    description: "Fascinated with cooking, though has no sense of taste",
  },

  {
    id: 2,
    image: "https://img.icons8.com/clouds/256/000000/futurama-mom.png",
    label: "Carol Miller",
    description: "One of the richest people on Earth",
  },
  {
    id: 3,
    image: "https://img.icons8.com/clouds/256/000000/homer-simpson.png",
    label: "Homer Simpson",
    description: "Overweight, lazy, and often ignorant",
  },
  {
    id: 4,
    image: "https://img.icons8.com/clouds/256/000000/spongebob-squarepants.png",
    label: "Spongebob Squarepants",
    description: "Not just a sponge",
  },
];

const Advanced = () => {
  const [selectedChar, setSelectedChar] = useState(charactersList[0]);

  return (
    <div className="max-w-xl">
      <Listbox as="div" value={selectedChar} onChange={setSelectedChar}>
        {({ open }) => (
          <>
            <Label>Label text:</Label>
            <div className="relative mt-1.5">
              <ListboxButton
                className={clsx(
                  "relative w-full cursor-pointer rounded-lg border py-2 pl-3 pr-9 text-start outline-hidden transition-colors focus:outline-hidden focus-visible:border-primary-600  dark:focus-visible:border-primary-500 rtl:pl-9 rtl:pr-3",
                  open
                    ? "border-primary-600 dark:border-primary-500"
                    : "border-gray-300 hover:border-gray-400 dark:border-dark-450 dark:hover:border-dark-400",
                )}
              >
                <span className="block truncate">{selectedChar.label}</span>
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
                <ListboxOptions
                  anchor={{ to: "bottom end", gap: 8 }}
                  className="absolute z-10 max-h-60 w-(--button-width) overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
                >
                  {charactersList.map((char) => (
                    <ListboxOption
                      key={char.id}
                      className={({ selected, focus }) =>
                        clsx(
                          "relative cursor-pointer select-none px-4 py-2 outline-hidden",
                          focus && !selected && "bg-gray-100 dark:bg-dark-600",
                          selected
                            ? "bg-primary-600 text-white dark:bg-primary-500"
                            : "text-gray-800 dark:text-dark-100",
                        )
                      }
                      value={char}
                    >
                      {({ selected }) => (
                        <div className="flex items-center space-x-2 ">
                          <img
                            className="size-10"
                            src={char.image}
                            alt={char.label}
                          />
                          <div className="overflow-hidden">
                            <span className="block truncate text-xs-plus">
                              {char.label}
                            </span>
                            <span
                              className={clsx(
                                "mt-1 block truncate text-xs",
                                selected
                                  ? "text-white"
                                  : "text-gray-400 dark:text-dark-300",
                              )}
                            >
                              {char.description}
                            </span>
                          </div>
                        </div>
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

export { Advanced };
