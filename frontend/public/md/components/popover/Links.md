```jsx
// Import Dependencies
import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";

// Local Imports
import { Button } from "components/ui";

function IconOne() {
  return (
    <svg
      stroke="currentColor"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        strokeOpacity={0.7}
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        strokeWidth="2"
        strokeOpacity={0.7}
      />
    </svg>
  );
}

function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        strokeOpacity={0.7}
        strokeWidth="2"
      />
    </svg>
  );
}

function IconThree() {
  return (
    <svg
      width="48"
      height="48"
      fill="currentColor"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="13" y="32" width="2" height="4" fillOpacity={0.7} />
      <rect x="17" y="28" width="2" height="8" fillOpacity={0.7} />
      <rect x="21" y="24" width="2" height="12" fillOpacity={0.7} />
      <rect x="25" y="20" width="2" height="16" fillOpacity={0.7} />
      <rect x="29" y="16" width="2" height="20" />
      <rect x="33" y="12" width="2" height="24" />
    </svg>
  );
}

const solutions = [
  {
    name: "Insights",
    description: "Measure actions your users take",
    href: "##",
    icon: IconOne,
  },
  {
    name: "Automations",
    description: "Create your own targeted content",
    href: "##",
    icon: IconTwo,
  },
  {
    name: "Reports",
    description: "Keep track of your growth",
    href: "##",
    icon: IconThree,
  },
];

// ----------------------------------------------------------------------

export function Links() {
  return (
    <Popover className="relative w-full">
      <PopoverButton as={Button}>Start</PopoverButton>
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
          className="z-[100] w-96 overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg shadow-gray-200/50 outline-none ring-primary-500/50 focus-visible:outline-none focus-visible:ring dark:border-dark-500 dark:bg-dark-750 dark:shadow-none"
        >
          <div className="relative grid gap-8 p-7">
            {solutions.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="-m-3 flex items-center space-x-2 rounded-lg p-2 outline-none transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-dark-600 "
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-primary-500 dark:bg-dark-600 dark:text-primary-400">
                  <item.icon aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-50">
                    {item.name}
                  </p>
                  <p className="text-xs-plus">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="bg-gray-100 px-7 py-4 dark:bg-dark-800">
            <span className="flex items-center">
              <a
                href="##"
                className="text-sm font-medium text-gray-800 hover:underline dark:text-dark-50"
              >
                Documentation
              </a>
            </span>
            <span className="mt-1 block text-sm">
              Start integrating products and tools
            </span>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

```