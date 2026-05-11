// Import Dependencies
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// Local Imports
import { Button, Card } from "components/ui";
import { WalletCard } from "./WalletCard";

// ----------------------------------------------------------------------

const wallets = [
  {
    uid: 1,
    wallet: "Bitcoin",
    abbr: "BTC",
    image: "/images/logos/bitcoin.svg",
    impession: 4.3,
    amount: "$31,566.11",
    color: "#F7931A",
    chartData: [20, 420, 102, 540, 275, 614],
  },
  {
    uid: 2,
    wallet: "Ethereum",
    abbr: "ETH",
    image: "/images/logos/ethereum.svg",
    impession: -6.53,
    amount: "$7,668.56",
    color: "#627EEA",
    chartData: [54, 77, 43, 69, 12],
  },
  {
    uid: 3,
    wallet: "Solana",
    abbr: "SOL",
    image: "/images/logos/solana.svg",
    impession: 3.6,
    amount: "$1,956.11",
    color: "#3AC5BC",
    chartData: [654, 820, 102, 540, 154, 614],
  },
  {
    uid: 4,
    wallet: "Litecoin",
    abbr: "LTC",
    image: "/images/logos/litecoin.svg",
    impession: 7.86,
    amount: "$487.76",
    color: "#4073C3",
    chartData: [0, 20, 10, 30, 20, 50],
  },
];

export function Watchlist() {
  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Watchlist
        </h2>
        <ActionMenu />
      </div>

      <div
        className="custom-scrollbar flex space-x-4 overflow-x-auto overflow-y-hidden px-4 pb-2 sm:px-5"
        style={{ "--margin-scroll": "1.25rem" }}
      >
        {wallets.map((wallet) => (
          <WalletCard key={wallet.uid} {...wallet} />
        ))}
      </div>
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
        isIcon
        variant="flat"
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 text-gray-600 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:text-dark-200 dark:shadow-none ltr:right-0 rtl:left-0">
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
