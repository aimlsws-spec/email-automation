// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChatBubbleLeftIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { TbPinned } from "react-icons/tb";

// Local Imports
import { Button, ScrollShadow, Skeleton } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { useChatContext } from "../../Chat.context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

export function Recent() {
  const { chats, setActiveChatId } = useChatContext();
  const { close: closeSidebar } = useSidebarContext();
  const { lgAndDown } = useBreakpointsContext();

  const setCurrentChat = (chatId) => {
    setActiveChatId(chatId);
    if (lgAndDown) closeSidebar();
  };

  return (
    <div className="flex grow flex-col overflow-hidden">
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          Recent Chats
        </span>
        <Button
          variant="flat"
          isIcon
          className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
        >
          <MagnifyingGlassIcon className="size-3.5" />
        </Button>
      </div>
      <ScrollShadow className="hide-scrollbar min-w-0 px-2 pt-1">
        <ul data-chat-wrapper>
          {chats.map((chat) => (
            <li key={chat.id}>
              <Button
                component="div"
                role="button"
                data-chat-item
                variant="flat"
                className="group w-full min-w-0 items-start justify-start gap-2 p-2 text-xs-plus"
                onClick={() => setCurrentChat(chat.id)}
                onKeyDown={createScopedKeydownHandler({
                  siblingSelector: "[data-chat-item]",
                  parentSelector: "[data-chat-wrapper]",
                  activateOnFocus: false,
                  loop: false,
                  orientation: "vertical",
                })}
              >
                <ChatBubbleLeftIcon className="size-4.5 shrink-0 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200" />
                <div className="-mt-0.5 flex min-w-0 flex-1 items-center justify-between gap-2 text-start">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-gray-800 dark:text-dark-100">
                      {chat.messages[chat.messages.length - 1].q}
                    </p>
                    <div className="mt-1 truncate text-xs text-gray-400 dark:text-dark-300">
                      {chat.messages[chat.messages.length - 1].a === "" ? (
                        <Skeleton className="mt-1 h-3 w-full rounded-sm" />
                      ) : (
                        chat.messages[chat.messages.length - 1].a
                      )}
                    </div>
                  </div>
                  <MenuAction />
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </div>
  );
}

export function MenuAction() {
  return (
    <Menu as="div" className="relative inline-block text-end">
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className={({ open }) =>
          clsx(
            open ? "opacity-100" : "opacity-0",
            "size-5 rounded-full group-hover:opacity-100 group-focus:opacity-100 ltr:-mr-1 rtl:-ml-1",
          )
        }
      >
        <EllipsisVerticalIcon className="size-4 stroke-2" />
      </MenuButton>

      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-soft shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
      >
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <TbPinned className="size-4.5" />
              <span>Pin Chat</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <PencilIcon className="size-4.5" />
              <span>Edit</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <TrashIcon className="size-4.5" />
              <span>Delete</span>
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}
