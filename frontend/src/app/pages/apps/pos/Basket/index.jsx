// Import Dependencies
import { Fragment } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";

// Local Imports
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { BasketSelector } from "./BasketSelector";
import { BasketActions } from "./BasketActions";
import { Items } from "./Items";
import { Checkout } from "./Checkout";
import { useDisclosure } from "hooks";
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Basket() {
  const { smAndUp } = useBreakpointsContext();

  return smAndUp ? <DesktopView /> : <MobileView />;
}

function MobileView() {
  const [isBasketOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="fixed bottom-3 right-3 rounded-full bg-white dark:bg-dark-700">
        <Button
          onClick={open}
          isIcon
          color="secondary"
          className="size-14 rounded-full"
        >
          $88
        </Button>
      </div>
      <Transition appear show={isBasketOpen} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed bottom-0 left-0 flex h-[calc(100%-2.5rem)] w-full transform-gpu flex-col rounded-t-2xl bg-white px-4 py-3 transition-transform duration-200 dark:bg-dark-700">
              <div className="-mx-1 flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    onClick={close}
                    variant="flat"
                    isIcon
                    className="size-7 rounded-full"
                  >
                    <XMarkIcon className="size-5" />
                  </Button>
                  <BasketSelector />
                </div>
                <BasketActions />
              </div>
              <div className="flex grow flex-col overflow-y-auto pt-4">
                <Items />
              </div>
              <Checkout />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

function DesktopView() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <BasketSelector />
        <BasketActions />
      </div>
      <Card className="mt-3 p-4 sm:p-5">
        <Items />
        <Checkout />
      </Card>
    </div>
  );
}
