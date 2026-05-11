// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  AdjustmentsVerticalIcon,
  ArrowsUpDownIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

// Local Imports
import { Button, Input } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { useDisclosure } from "hooks";
import { NewTask } from "./Modals/NewTask";
import { useTodoContext } from "./Todo.context";

// ----------------------------------------------------------------------

const now = new Date();

export function Header() {
  const { locale } = useLocaleContext();
  const { searchQuery, setSearchQuery } = useTodoContext();
  const [isOpen, { open, close }] = useDisclosure();
  const [showMobileSearchbar, setShowMobileSearchbar] = useState(false);
  const mobileSearchRef = useRef();

  useEffect(() => {
    if (showMobileSearchbar) {
      mobileSearchRef.current.focus();
    }
  }, [showMobileSearchbar]);

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <div className="flex gap-2">
            <p className="text-xl font-medium text-gray-800 dark:text-dark-50">
              My Day
            </p>
            <ActionMenu />
          </div>
          <p className="mt-1 text-xs">
            {dayjs(now).locale(locale).format("dddd, MMM. DD")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            classNames={{ root: "max-md:hidden", input: "h-8 text-xs-plus" }}
            placeholder="Search here..."
            prefix={<MagnifyingGlassIcon className="size-4" />}
          />
          <div className="flex">
            <Button onClick={open} variant="flat" isIcon className="size-8">
              <PlusIcon className="size-4.5" />
            </Button>
            <Button
              onClick={() => setShowMobileSearchbar(!showMobileSearchbar)}
              variant="flat"
              isIcon
              className="size-8 md:hidden"
            >
              <MagnifyingGlassIcon className="size-4.5" />
            </Button>
            <Button variant="flat" isIcon className="size-8">
              <ArrowsUpDownIcon className="size-4.5" />
            </Button>
            <Button variant="flat" isIcon className="size-8">
              <AdjustmentsVerticalIcon className="size-4.5" />
            </Button>
          </div>
        </div>
      </header>
      {showMobileSearchbar && (
        <div className="pt-4 md:hidden">
          <Input
            ref={mobileSearchRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search here..."
            prefix={<MagnifyingGlassIcon className="size-4" />}
          />
        </div>
      )}

      <NewTask isOpen={isOpen} close={close} />
    </>
  );
}

function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-start">
      <MenuButton
        as={Button}
        isIcon
        className="size-7 rounded-full"
        variant="flat"
      >
        <EllipsisHorizontalIcon className="size-4.5" />
      </MenuButton>

      <Transition
        as={MenuItems}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
        className="absolute z-100 mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:left-0 rtl:right-0"
      >
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <span>Action</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <span>Another Action</span>
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ focus }) => (
            <button
              className={clsx(
                "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
              )}
            >
              <span>Other Action</span>
            </button>
          )}
        </MenuItem>
      </Transition>
    </Menu>
  );
}
