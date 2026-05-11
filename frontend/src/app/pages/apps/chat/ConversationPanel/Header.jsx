// Import Dependencies
import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PhoneIcon,
  SpeakerXMarkIcon,
  TrashIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

// Local Imports
import { SidebarToggleBtn } from "components/shared/SidebarToggleBtn";
import { Avatar, Button } from "components/ui";
import { useChatContext } from "../Chat.context";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

export function Header() {
  const { currentChat, showProfile, setShowProfile } = useChatContext();
  const { cardSkin } = useThemeContext();

  return (
    <header
      className={clsx(
        cardSkin === "bordered" ? "dark:bg-dark-900" : "dark:bg-dark-750",
        "chat-header transition-content relative z-10 flex h-[65px] w-full shrink-0 items-center justify-between border-b border-gray-150 bg-white px-[calc(var(--margin-x)-.5rem)] shadow-xs dark:border-dark-600",
      )}
    >
      <div className="flex min-w-0 items-center gap-5">
        <div className="size-7 ltr:ml-1 rtl:mr-1">
          <SidebarToggleBtn />
        </div>

        <button
          onClick={() => setShowProfile(true)}
          className="flex min-w-0 cursor-pointer items-center gap-3 text-start outline-hidden lg:gap-4"
        >
          <Avatar
            size={10}
            src={currentChat.profile.avatar}
            name={currentChat.profile.name}
            initialColor="auto"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-800 dark:text-dark-100">
              {currentChat.profile.name}
            </p>
            <p className="mt-0.5 text-xs">Last seen recently</p>
          </div>
        </button>
      </div>

      <div className="flex items-center md:ltr:-mr-1 md:rtl:-ml-1">
        <Button
          variant="flat"
          className="size-9 rounded-full max-sm:hidden"
          isIcon
        >
          <PhoneIcon className="size-5.5" />
        </Button>
        <Button variant="flat" className="size-9 rounded-full" isIcon>
          <MagnifyingGlassIcon className="size-5.5" />
        </Button>
        <Button
          onClick={() => setShowProfile((val) => !val)}
          color={showProfile ? "primary" : "neutral"}
          variant="flat"
          className="size-9 rounded-full max-sm:hidden"
          isIcon
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.25 21.167h5.5c4.584 0 6.417-1.834 6.417-6.417v-5.5c0-4.583-1.834-6.417-6.417-6.417h-5.5c-4.583 0-6.417 1.834-6.417 6.417v5.5c0 4.583 1.834 6.417 6.417 6.417ZM13.834 2.833v18.334"
            />
          </svg>
        </Button>
        <ActionMenu />
      </div>
    </header>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisVerticalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
      >
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center gap-2 px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <SpeakerXMarkIcon className="size-4" />
              <span>Unmute</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center gap-2 px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <Cog6ToothIcon className="size-4" />
              <span>Chat Settings</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center gap-2 px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <NoSymbolIcon className="size-4" />
              <span>Block User</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center gap-2 px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <TrashIcon className="size-4" />
              <span>Delete Chat</span>
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}
