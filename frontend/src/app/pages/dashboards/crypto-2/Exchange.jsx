// Import Dependencies
import {
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { RadioGroup } from "@headlessui/react";
import { HiDownload, HiUpload } from "react-icons/hi";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Card, Input, Select } from "components/ui";

// ----------------------------------------------------------------------

export function Exchange() {
  return (
    <Card className="px-4 pb-5 sm:px-5">
      <div className="flex min-w-0 items-center justify-between py-3">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Exchange
        </h2>
        <ActionMenu />
      </div>
      <div className="rounded-lg bg-gray-150 text-gray-600 dark:bg-dark-800 dark:text-dark-200">
        <RadioGroup
          defaultValue="receive"
          as="div"
          className="flex px-1.5 py-1"
        >
          <Radio
            value="receive"
            className={({ checked }) =>
              clsx(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 space-x-2 rounded-lg px-3 py-2 font-medium outline-hidden",
                checked
                  ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
                  : "hover:text-dark-800 focus:text-dark-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
              )
            }
          >
            <HiDownload className="size-4.5" />
            <Label className="cursor-pointer">Receive</Label>
          </Radio>
          <Radio
            value="send"
            className={({ checked }) =>
              clsx(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 space-x-2 rounded-lg px-3 py-2 font-medium outline-hidden",
                checked
                  ? "bg-white shadow-sm dark:bg-dark-500 dark:text-dark-100"
                  : "hover:text-dark-800 focus:text-dark-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
              )
            }
          >
            <HiUpload className="size-4.5" />
            <Label className="cursor-pointer">Send</Label>
          </Radio>
        </RadioGroup>
      </div>

      <div className="relative">
        <div className="pt-4">
          <p className="text-xs-plus">You send</p>
          <div className="mt-1 flex items-center justify-between gap-2 rounded-2xl bg-gray-150 p-1.5 dark:bg-dark-800">
            <Select
              classNames={{
                root: "w-full",
                select:
                  "h-8 rounded-full border-transparent py-0 text-xs-plus dark:border-transparent",
              }}
            >
              <option>Litecoin</option>
              <option>Solana</option>
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>Tether</option>
            </Select>
            <Input
              unstyled
              classNames={{
                root: "w-full",
                input: "bg-transparent px-2 text-end",
              }}
              placeholder="Amount"
              type="text"
            />
          </div>
        </div>
        <div className="pt-4">
          <p className="text-xs-plus">You receive</p>
          <div className="mt-1 flex items-center justify-between gap-2 rounded-2xl bg-gray-150 p-1.5 dark:bg-dark-800">
            <Select
              classNames={{
                root: "w-full",
                select:
                  "h-8 rounded-full border-transparent py-0 text-xs-plus dark:border-transparent",
              }}
            >
              <option>Solana</option>
              <option>Litecoin</option>
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>Tether</option>
            </Select>
            <Input
              unstyled
              classNames={{
                root: "w-full",
                input: "bg-transparent px-2 text-end",
              }}
              placeholder="Amount"
              type="text"
            />
          </div>
        </div>
        <div className="absolute top-1/2 mt-1 ltr:right-0 rtl:left-0">
          <Button isIcon color="primary" className="mask is-hexagon size-7">
            <ArrowsUpDownIcon className="size-4" />
          </Button>
        </div>
      </div>

      <Button color="primary" className="mt-6 h-10 w-full">
        Buy BTC
      </Button>
    </Card>
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
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
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
                <span>Another action</span>
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
                <span>Other action</span>
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
