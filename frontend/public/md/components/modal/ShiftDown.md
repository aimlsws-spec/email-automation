```jsx
// Import Dependencies
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useRef } from "react";

// Local Imports
import { useDisclosure } from "hooks";
import { Switch, Button, Checkbox } from "components/ui";

// ----------------------------------------------------------------------

export function ShiftDown() {
  const [isOpen, { open, close }] = useDisclosure(false);

  const saveRef = useRef(null);

  return (
    <>
      <Button onClick={open}>Shift Down</Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
          onClose={close}
          initialFocus={saveRef}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/30" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 [transform:translate3d(0,-1rem,0)]"
            enterTo="opacity-100 [transform:translate3d(0,0,0)]"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
            leaveTo="opacity-0 [transform:translate3d(0,-1rem,0)]"
          >
            <DialogPanel className="scrollbar-sm relative flex w-full max-w-sm flex-col overflow-y-auto rounded-lg bg-white px-4 pb-4 transition-all duration-300 dark:bg-dark-700 sm:px-5">
              <div className="my-3 flex h-8 items-center justify-between">
                <DialogTitle
                  as="h3"
                  className="line-clamp-1 font-medium tracking-wide text-gray-800 dark:text-dark-100 lg:text-base"
                >
                  Table Settings
                </DialogTitle>
                <Button
                  onClick={close}
                  variant="flat"
                  isIcon
                  className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                >
                  <XMarkIcon className="size-4.5" />
                </Button>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
                dignissimos.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                <Checkbox label="ID" defaultChecked />
                <Checkbox label="Name" defaultChecked />
                <Checkbox label="Email" defaultChecked />
                <Checkbox label="Address" />
                <Checkbox label="Created At" />
                <Checkbox label="Updated At" defaultChecked />
                <label className="col-span-2 inline-flex items-center space-x-2 ">
                  <Switch variant="outlined" />
                  <span>Show Avatar</span>
                </label>
              </div>
              <div className="mt-4 text-end">
                <Button
                  onClick={close}
                  variant="flat"
                  className="h-8 rounded-full text-xs-plus"
                >
                  Cancel
                </Button>
                <Button
                  onClick={close}
                  color="primary"
                  className="h-8 rounded-full text-xs-plus"
                  ref={saveRef}
                >
                  Save
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
```