// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Button, Card } from "components/ui";
import { formatNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

const channels = [
  {
    uid: "1",
    logo: "/images/logos/instagram-round.svg",
    name: "Instagram",
    views: 34358,
    viewImpression: 1,
    sales: 5166,
    salesImpression: -1,
  },
  {
    uid: "2",
    logo: "/images/logos/facebook-round.svg",
    name: "Facebook",
    views: 24616,
    viewImpression: 1,
    sales: 4319,
    salesImpression: 1,
  },
  {
    uid: "3",
    logo: "/images/logos/tik_tok-round.svg",
    name: "Tik Tok",
    views: 17363,
    viewImpression: -1,
    sales: 3466,
    salesImpression: -1,
  },
  {
    uid: "4",
    logo: "/images/logos/twitter-round.svg",
    views: 49318,
    name: "Twitter",
    viewImpression: -1,
    sales: 1261,
    salesImpression: 1,
  },
  {
    uid: "5",
    logo: "/images/logos/pinterest-round.svg",
    name: "Pinterest",
    views: 6917,
    viewImpression: 1,
    sales: 926,
    salesImpression: 1,
  },
  {
    uid: "6",
    logo: "/images/logos/discord-round.svg",
    name: "Discord",
    views: 639,
    viewImpression: 1,
    sales: 517,
    salesImpression: 1,
  },
  {
    uid: "7",
    logo: "/images/logos/youtube-round.svg",
    name: "Youtube",
    views: 391,
    viewImpression: -1,
    sales: 268,
    salesImpression: 1,
  },
];

export function SocialSource() {
  return (
    <Card className="pb-2">
      <div className="flex h-14 min-w-0 items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Social Source
        </h2>
        <ActionMenu />
      </div>
      <div className="px-4 sm:px-5">
        <p>
          <span className="text-2xl text-gray-800 dark:text-dark-100">
            135K
          </span>
          <span className="text-xs text-success dark:text-success-lighter">
            +3.1%
          </span>
        </p>
        <p className="text-xs-plus">View in this month</p>
      </div>
      <div className="mt-2 w-full overflow-x-auto px-4 sm:px-5">
        <table className="w-full">
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.uid}>
                <td className="w-full">
                  <div className="flex items-center gap-2 py-2">
                    <img
                      className="size-6"
                      src={channel.logo}
                      alt={channel.name}
                    />
                    <a
                      href="##"
                      className="truncate transition-opacity hover:opacity-80"
                    >
                      {channel.name}
                    </a>
                  </div>
                </td>
                <td>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-1 py-2 font-medium">
                      <EyeIcon className="size-3" />
                      <span className="text-xs-plus">
                        {formatNumber(channel.views)}
                      </span>
                      {channel.viewImpression === 1 ? (
                        <ArrowTrendingUpIcon className="this:success size-3 text-this dark:text-this-lighter" />
                      ) : (
                        <ArrowTrendingDownIcon className="this:error size-3 text-this dark:text-this-lighter" />
                      )}
                    </div>
                    <div className="mx-1.5 my-2 w-px bg-gray-200 dark:bg-dark-500"></div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-start gap-1 py-2 font-medium">
                    <span className="text-xs-plus">
                      ${formatNumber(channel.sales)}
                    </span>
                    {channel.salesImpression === 1 ? (
                      <ArrowTrendingUpIcon className="this:success size-3 text-this dark:text-this-lighter" />
                    ) : (
                      <ArrowTrendingDownIcon className="this:error size-3 text-this dark:text-this-lighter" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
