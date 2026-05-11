// Import Dependencies
import { Fragment, useRef } from "react";
import PropTypes from "prop-types";
import Cleave from "cleave.js/react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  PlusIcon,
  XMarkIcon,
  CreditCardIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { InvoiceTable } from "../components/InvoiceTable";
import { Badge, Button, Circlebar, Input } from "components/ui";
import { useDisclosure } from "hooks";
import { ContextualHelp } from "components/shared/ContextualHelp";

// ----------------------------------------------------------------------

export default function Billing() {
  return (
    <div className="w-full 2xl:max-w-5xl">
      <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
        Billing & Payments
      </h5>
      <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
        Manage Your Billing and Payments from here. You can also manage your
        payment methods from here.
      </p>

      <MemberPlan />

      <PaymentMethods />

      <div className="my-7 h-px bg-gray-200 dark:bg-dark-500"></div>

      <InvoiceSection />
    </div>
  );
}

function MemberPlan() {
  return (
    <div className="mt-5 rounded-lg bg-gray-100 p-4 dark:bg-dark-800">
      <div className="flex flex-col items-start justify-between sm:flex-row">
        <div>
          <p className="text-lg font-medium text-gray-800 dark:text-dark-100">
            Premium Plan
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Circlebar
              size={5}
              strokeWidth={12}
              variant="soft"
              value={60}
              color="primary"
              className="flex"
            />
            <p>136 / 300 Days left</p>
          </div>
        </div>
        <Button className="mt-6 sm:mt-0" color="primary">
          Upgrade
        </Button>
      </div>
    </div>
  );
}

function PaymentMethods() {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="mt-4">
        <div className="flex justify-between">
          <div>
            <p className="text-base font-medium text-gray-800 dark:text-dark-100">
              Payment Methods
            </p>
            <p className="mt-0.5 text-balance">
              Manage your payment methods from here.
            </p>
          </div>
          <Button
            onClick={open}
            className="h-8 space-x-2 whitespace-nowrap px-2.5 text-xs "
          >
            <PlusIcon className="size-4" />
            <span>New Method</span>
          </Button>
        </div>
      </div>

      <div className="hide-scrollbar -mx-4 mt-4 flex items-start gap-3 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
        <div className="w-72 shrink-0 rounded-lg bg-linear-to-br from-amber-400 to-orange-600 p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/cc-visa.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    Travis Fuller
                  </p>
                  <p className="mt-0.5 text-xs">•••• 6988</p>
                </div>
              </div>
              <Badge
                className="h-5 rounded-full text-tiny-plus uppercase"
                color="primary"
              >
                Primary
              </Badge>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-72 shrink-0 rounded-lg bg-linear-to-br from-info to-info-darker p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/cc-mastercard.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    Samantha Shelton
                  </p>
                  <p className="mt-0.5 text-xs">•••• 6988</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="w-72 shrink-0 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 p-[3px]">
          <div className="rounded-lg bg-white p-4 pb-3 dark:bg-dark-700">
            <div className="flex items-start justify-between">
              <div>
                <img
                  src="/images/payments/paypal.svg"
                  className="h-5"
                  alt="logo"
                />
                <div className="mt-2">
                  <p className="font-medium text-gray-800 dark:text-dark-100">
                    John Doe
                  </p>
                  <p className="mt-0.5 text-xs">John@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-xs">Expired 02.06.2024</p>

              <Button
                className="-mb-1 -mr-1 size-6 rounded-full"
                variant="flat"
                isIcon
              >
                <Cog6ToothIcon className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddPaymentModal isOpen={isOpen} onClose={close} />
    </>
  );
}

function InvoiceSection() {
  return (
    <>
      <div>
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          Invoices
        </p>
        <p className="mt-0.5 text-balance">
          List of invoices. You can view and download them from here.
        </p>
      </div>
      <InvoiceTable />
    </>
  );
}

function AddPaymentModal({ isOpen, onClose }) {
  const searchRef = useRef(null);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={onClose}
        initialFocus={searchRef}
      >
        <TransitionChild
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/30"
        />

        <TransitionChild
          as={DialogPanel}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          className="relative flex w-full max-w-lg origin-bottom flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700"
        >
          <div className="flex items-center justify-between rounded-t-lg bg-gray-200 px-4 py-3 dark:bg-dark-800 sm:px-5">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-gray-800 dark:text-dark-100"
            >
              Add Card
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="flat"
              isIcon
              className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
            >
              <XMarkIcon className="size-4.5" />
            </Button>
          </div>
          <div className="p-4 sm:px-5">
            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Card Holder Name:"
                placeholder="Enter Card Holder Name"
                type="text"
                ref={searchRef}
                prefix={<UserIcon className="size-4.5" />}
              />
              <Input
                label="Card Number:"
                placeholder="4444 4444 4444 4444"
                component={Cleave}
                prefix={<CreditCardIcon className="size-4.5" />}
                options={{ creditCard: true }}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  component={Cleave}
                  label="Expires:"
                  placeholder="mm/yy"
                  type="text"
                  options={{ date: true, datePattern: ["m", "y"] }}
                />
                <Input
                  component={Cleave}
                  label="CVC:"
                  placeholder="***"
                  type="password"
                  maxLength="3"
                  options={{ numeral: true, numeralPositiveOnly: true }}
                  suffix={
                    <ContextualHelp
                      title="CVV/CVC Code"
                      placement="top-end"
                      content={
                        <p>
                          CVV (Card Verification Value) or CVC (Card
                          Verification Code)? This is an anti-fraud measure used
                          by credit card companies worldwide. It&apos;s a three
                          or four digit number, usually located on the signature
                          panel on the back of most credit cards
                        </p>
                      }
                    />
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button onClick={onClose} className="min-w-[7rem]">
                Cancel
              </Button>
              <Button
                onClick={onClose}
                color="primary"
                className="min-w-[7rem]"
              >
                Save
              </Button>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

AddPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
