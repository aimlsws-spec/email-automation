```jsx
// Import Dependencies
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import Marquee from "react-fast-marquee";

// Local Imports
import { Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

const Loop = () => {
  const [isOpen, { close }] = useDisclosure(true);

  return (
    <div className="max-w-2xl">
      <Transition
        as={Fragment}
        show={isOpen}
        leave="duration-200 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          role="alert"
          className="this:primary flex items-center space-x-2 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
        >
          <BellAlertIcon className="size-6" />
          <span className="flex-1">
            <Marquee pauseOnHover gradient={false}>
              I can be a React component, multiple React components, or just
              some text. I can be a React component, multiple React components,
              or just some text. I can be a React component, multiple React
              components, or just some text. I can be a React component,
              multiple React components, or just some text.
            </Marquee>
          </span>
          <div>
            <Button
              onClick={close}
              unstyled
              className="size-6 shrink-0 rounded-full p-0 text-white hover:bg-white/30 focus:bg-white/30 ltr:-mr-1 rtl:-ml-1"
            >
              <XMarkIcon className="size-4" />
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export { Loop };
```