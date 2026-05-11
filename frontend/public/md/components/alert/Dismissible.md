```jsx
// Import Dependencies
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  BellAlertIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

// Local Imports
import { Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

const Dismissible = () => {
  const [isOpen1, handler1] = useDisclosure(true);
  const [isOpen2, handler2] = useDisclosure(true);

  return (
    <div className="max-w-2xl space-y-4">
      <Transition
        as={Fragment}
        show={isOpen1}
        leave="duration-200 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          role="alert"
          className="this:info flex items-center space-x-2 rounded-lg border border-this-darker p-4 text-this-darker dark:border-this-lighter dark:text-this-lighter "
        >
          <ExclamationCircleIcon className="size-7" />
          <span className="flex-1">This is simple alert</span>
          <div className="contents">
            <Button
              onClick={handler1.close}
              color="info"
              variant="flat"
              className="-mr-1 size-6 shrink-0 rounded-full p-0"
            >
              <XMarkIcon className="size-4" />
            </Button>
          </div>
        </div>
      </Transition>

      <Transition
        as={Fragment}
        show={isOpen2}
        leave="duration-200 transition ease-in-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          role="alert"
          className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-4 text-gray-800 dark:border-dark-450 dark:text-dark-100 sm:flex-row sm:space-x-2 sm:space-y-0 rtl:sm:space-x-reverse"
        >
          <span className="flex-1 text-center sm:text-start">
            Lorem ipsum dolor sit amet consectetur.
          </span>
          <Button
            onClick={handler2.close}
            className="space-x-2 rounded-full uppercase "
          >
            <BellAlertIcon className="size-4" />
            <span>Remind me later</span>
          </Button>
        </div>
      </Transition>
    </div>
  );
};

export { Dismissible };
```