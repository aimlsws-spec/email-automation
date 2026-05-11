```jsx
// Import Dependencies
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

// Local Imports
import { useDisclosure } from "hooks";
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Top() {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Top Drawer</Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <DialogPanel className="fixed left-0 top-0 flex w-full transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700">
              <div className="flex justify-between bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
                <DialogTitle
                  as="h3"
                  className="items-center text-base font-medium text-gray-800 dark:text-dark-100"
                >
                  Top Drawer
                </DialogTitle>
                <Button
                  onClick={close}
                  variant="flat"
                  className="size-7 shrink-0 rounded-full p-0 ltr:-mr-1.5 rtl:-ml-1.5"
                >
                  <XMarkIcon className="size-4.5" />
                </Button>
              </div>
              <div className="h-48 p-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                nisi numquam quos accusamus officiis, error id?
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
```