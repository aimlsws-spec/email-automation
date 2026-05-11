// Import Dependencies
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useRef } from "react";

// Local Imports
import { useDisclosure } from "hooks";
import { Avatar, AvatarDot, Button } from "components/ui";

// ----------------------------------------------------------------------

export function ShiftUp() {
  const [isOpen, { open, close }] = useDisclosure(false);

  const applyRef = useRef(null);

  return (
    <>
      <Button onClick={open}>Shift Up</Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
          onClose={close}
          initialFocus={applyRef}
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
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/30" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 [transform:translate3d(0,1rem,0)]"
            enterTo="opacity-100 [transform:translate3d(0,0,0)]"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 [transform:translate3d(0,0,0)]"
            leaveTo="opacity-0 [transform:translate3d(0,1rem,0)]"
          >
            <DialogPanel className="scrollbar-sm relative flex w-full max-w-md flex-col overflow-y-auto rounded-lg bg-white pb-4 pt-10 text-center transition-all duration-300 dark:bg-dark-700">
              <div className="mt-4">
                <Avatar
                  size={20}
                  className="mx-auto"
                  src="/images/avatar/avatar-19.jpg"
                  indicator={
                    <AvatarDot color="primary" className="right-0 m-1 size-4" />
                  }
                />
                <div className="mt-4 px-4 sm:px-12">
                  <DialogTitle
                    as="h3"
                    className="text-lg text-gray-800 dark:text-dark-50"
                  >
                    Follow Request
                  </DialogTitle>
                  <p className="mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Fuga sunt vel vero.
                  </p>
                </div>
                <hr className="my-4 mt-16 h-px border-gray-200 dark:border-dark-500" />
                <div className="space-x-3 ">
                  <Button
                    onClick={close}
                    variant="outlined"
                    className="min-w-[7rem] rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={close}
                    color="primary"
                    ref={applyRef}
                    className="min-w-[7rem] rounded-full"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
