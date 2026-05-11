// Import Dependencies
import {
  Dialog,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { Fragment, useRef, useState } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
  ShoppingBagIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  CloudIcon,
  EnvelopeIcon,
  CurrencyPoundIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Button, Input, Avatar, Spinner } from "components/ui";
import { useDisclosure, useDebounceValue } from "hooks";
import { useThemeContext } from "app/contexts/theme/context";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";

// ----------------------------------------------------------------------

const tabs = [
  {
    key: "all",
    title: "All",
  },
  {
    key: "chats",
    title: "Chats",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "projects",
    title: "Projects",
  },
  {
    key: "tasks",
    title: "Tasks",
  },
];

const frequents = [
  { key: "kanban", title: "Kanban", color: "secondary", Icon: ViewColumnsIcon },
  {
    key: "chat",
    title: "Chat",
    color: "success",
    Icon: ChatBubbleLeftEllipsisIcon,
  },
  {
    key: "analytics",
    title: "Analytics",
    color: "error",
    Icon: ArrowTrendingUpIcon,
  },
  { key: "banking", title: "Banking", color: "warning", Icon: ScaleIcon },
  { key: "orders", title: "Orders", color: "info", Icon: ShoppingBagIcon },
  { key: "sales", title: "Sales", color: "success", Icon: CurrencyDollarIcon },
];

const suggestions = [
  { key: "chat", title: "Chat App", Icon: ChatBubbleLeftEllipsisIcon },
  { key: "filemanager", title: "File Manager App", Icon: CloudIcon },
  { key: "email", title: "Email App", Icon: EnvelopeIcon },
  { key: "kanban", title: "Kanban Board", Icon: ViewColumnsIcon },
  { key: "crypto", title: "Crypto Dashboard", Icon: CurrencyPoundIcon },
  { key: "banking", title: "Banking Dashboard", Icon: ScaleIcon },
  { key: "analytics", title: "Analytics Dashboard", Icon: ArrowTrendingUpIcon },
];

const FrequentItem = ({ title, Icon, color }) => (
  <a href="##" className="w-14 text-center">
    <Avatar
      size={12}
      initialColor={color}
      classNames={{ display: "rounded-2xl" }}
    >
      <Icon className="size-5 stroke-2" />
    </Avatar>

    <p className="mt-1.5 truncate whitespace-nowrap text-xs text-gray-800 dark:text-dark-100">
      {title}
    </p>
  </a>
);

const SuggestionItem = ({ title, Icon }) => (
  <a
    onKeyDown={createScopedKeydownHandler({
      siblingSelector: "[data-search-item]",
      parentSelector: "[data-search-result]",
      activateOnFocus: false,
      loop: true,
      orientation: "vertical",
    })}
    data-search-item
    href="##"
    className="group flex items-center justify-between space-x-2 rounded-lg bg-gray-100 px-2.5 py-2 tracking-wide text-gray-800 outline-hidden transition-all focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-600 dark:text-dark-100 "
  >
    <div className="flex min-w-0 items-center space-x-2 ">
      <Icon className="size-4.5 shrink-0 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
      <span className="truncate">{title}</span>
    </div>

    <ChevronRightIcon className="size-4.5 rtl:rotate-180" />
  </a>
);

export function ScaleDown() {
  const [isOpen, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [deferredSearch] = useDebounceValue(search, 500);
  const { isDark } = useThemeContext();

  const searchRef = useRef(null);

  return (
    <>
      <Button onClick={open}>Scale Up</Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
          onClose={close}
          initialFocus={searchRef}
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
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative flex w-full max-w-lg origin-bottom flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-dark-700">
              <div className="rounded-t-lg bg-gray-200 pt-3 dark:bg-dark-800">
                <div className="flex items-center justify-between pl-2 pr-4 rtl:pl-4 rtl:pr-2">
                  <Input
                    ref={searchRef}
                    placeholder="Search here..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    classNames={{ root: "flex-1", input: "border-none" }}
                    prefix={
                      deferredSearch !== search ? (
                        <Spinner
                          color="primary"
                          variant="soft"
                          className="size-4.5 border-2"
                        />
                      ) : (
                        <MagnifyingGlassIcon className="size-5" />
                      )
                    }
                  />
                  <Button
                    onClick={close}
                    variant={isDark ? "filled" : "outlined"}
                    className="px-3 py-1.5 text-xs"
                  >
                    ESC
                  </Button>
                </div>
                <TabGroup>
                  <TabList className="hide-scrollbar flex overflow-x-auto pt-2">
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.key}
                        className={({ selected }) =>
                          clsx(
                            "shrink-0 whitespace-nowrap border-b-2 px-5 py-2 font-medium",
                            selected
                              ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                              : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
                          )
                        }
                        as={Button}
                        unstyled
                      >
                        {tab.title}
                      </Tab>
                    ))}
                  </TabList>
                </TabGroup>
              </div>

              <div className="flex flex-col overflow-y-auto py-4">
                <h3 className="px-4 text-gray-800 dark:text-dark-50 sm:px-5">
                  Frequent
                </h3>
                <div className="flex space-x-4 overflow-x-auto px-4 pt-4 sm:px-5 ">
                  {frequents.map(({ key, Icon, title, color }) => (
                    <FrequentItem
                      key={key}
                      Icon={Icon}
                      title={title}
                      color={color}
                    />
                  ))}
                </div>
                <h3 className="mt-6 px-4 text-gray-800 dark:text-dark-50 sm:px-5">
                  Suggestion
                </h3>
                <div className="space-y-3 px-4 pt-3" data-search-result>
                  {suggestions.map(({ key, Icon, title }) => (
                    <SuggestionItem key={key} Icon={Icon} title={title} />
                  ))}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}

FrequentItem.propTypes = {
  title: PropTypes.string,
  Icon: PropTypes.elementType,
  color: PropTypes.string,
};

SuggestionItem.propTypes = {
  title: PropTypes.string,
  Icon: PropTypes.elementType,
};
