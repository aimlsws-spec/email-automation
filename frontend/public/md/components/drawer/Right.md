```jsx
// Import Dependencies
import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Avatar, Button } from "components/ui";
import { useDisclosure } from "hooks";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

function CopyrightIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12.0449 15.8486C12.625 15.8486 13.1318 15.6729 13.5654 15.3213C13.999 14.9697 14.2393 14.5303 14.2861 14.0029H15.8242C15.7949 14.5479 15.6074 15.0664 15.2617 15.5586C14.916 16.0508 14.4531 16.4434 13.873 16.7363C13.2988 17.0293 12.6895 17.1758 12.0449 17.1758C10.75 17.1758 9.71875 16.7451 8.95117 15.8838C8.18945 15.0166 7.80859 13.833 7.80859 12.333V12.0605C7.80859 11.1348 7.97852 10.3115 8.31836 9.59082C8.6582 8.87012 9.14453 8.31055 9.77734 7.91211C10.416 7.51367 11.1689 7.31445 12.0361 7.31445C13.1025 7.31445 13.9873 7.63379 14.6904 8.27246C15.3994 8.91113 15.7773 9.74023 15.8242 10.7598H14.2861C14.2393 10.1445 14.0049 9.64062 13.583 9.24805C13.167 8.84961 12.6514 8.65039 12.0361 8.65039C11.21 8.65039 10.5684 8.94922 10.1113 9.54688C9.66016 10.1387 9.43457 10.9971 9.43457 12.1221V12.4297C9.43457 13.5254 9.66016 14.3691 10.1113 14.9609C10.5625 15.5527 11.207 15.8486 12.0449 15.8486Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function ShippingIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      ></path>
    </svg>
  );
}

const listItems = [
  {
    id: randomId(),
    label: "Getting Started",
    icon: ArrowTrendingUpIcon,
    link: "##",
    isActive: true,
  },
  {
    id: randomId(),
    label: "Shipping",
    icon: ShippingIcon,
    link: "##",
    isActive: false,
  },

  {
    id: randomId(),
    label: "Payments",
    icon: CreditCardIcon,
    link: "##",
    isActive: false,
  },
  {
    id: randomId(),
    label: "Returns",
    icon: ReceiptRefundIcon,
    link: "##",
    isActive: false,
  },

  {
    id: randomId(),
    label: "My Account",
    icon: UserIcon,
    link: "##",
    isActive: false,
  },

  {
    id: randomId(),
    label: "Copyright & Legal",
    icon: CopyrightIcon,
    link: "##",
    isActive: false,
  },
];

const ListItem = ({ isActive = false, label, Icon, link = "##", ...rest }) => (
  <li>
    <a
      data-list-control
      href={link}
      className={clsx(
        " flex items-center space-x-2 rounded-full px-5 py-2.5 tracking-wide outline-none transition-all ",
        isActive
          ? "bg-primary-600 text-white dark:bg-primary-500"
          : "text-gray-600 hover:bg-gray-300/20 focus:bg-gray-300/20 active:bg-gray-300/25 dark:text-dark-200 dark:hover:bg-dark-300/20 dark:focus:bg-dark-300/20 dark:active:bg-dark-300/25",
      )}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: "[data-list-control]",
        parentSelector: "[data-list]",
        activateOnFocus: false,
        loop: true,
        orientation: "vertical",
      })}
      {...rest}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </a>
  </li>
);

export function Right() {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Left Drawer</Button>

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
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed right-0 top-0 flex h-full w-72 transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700">
              <div className="h-24">
                <img
                  className="h-full w-full object-cover object-center"
                  src="/images/objects/object-2.jpg"
                  alt="proflie-background"
                />
              </div>
              <div className="flex space-x-4 px-4 ">
                <Avatar
                  size={20}
                  src="/images/avatar/avatar-19.jpg"
                  className="-mt-5"
                />
                <div className="mt-2 w-full min-w-0">
                  <div className="flex justify-between">
                    <h4 className="truncate text-base font-medium text-gray-800 dark:text-dark-50 ltr:mr-2 rtl:ml-2">
                      John Doe
                    </h4>
                    <Button
                      onClick={close}
                      variant="flat"
                      isIcon
                      className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
                    >
                      <XMarkIcon className="size-4.5" />
                    </Button>
                  </div>

                  <a
                    href="##"
                    className="cursor-pointer text-xs-plus font-medium text-primary-600 outline-none transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
                  >
                    @johndoe
                  </a>
                </div>
              </div>
              <hr className="mx-5 my-4 h-px border-gray-200 dark:border-dark-500" />
              <ul
                className=" grow space-y-1.5 px-5 font-medium "
                data-list
              >
                {listItems.map((item) => (
                  <ListItem
                    key={item.id}
                    Icon={item.icon}
                    label={item.label}
                    link={item.link}
                    isActive={item.isActive}
                  />
                ))}
              </ul>
              <div className="p-5">
                <Button
                  variant="outlined"
                  className="h-10 w-full space-x-2 "
                >
                  <ArrowLeftStartOnRectangleIcon className="size-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-primary-600 dark:text-primary-400">
                    Logout
                  </span>
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

ListItem.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.string,
  Icon: PropTypes.elementType,
  link: PropTypes.string,
};
```