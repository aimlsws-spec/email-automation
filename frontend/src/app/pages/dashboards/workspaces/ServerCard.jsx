// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Badge, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function ServerCard({
  uid,
  status,
  countries,
  uptime,
  response,
  memory,
  ipList,
}) {
  return (
    <Card className="card space-y-6 p-4 sm:px-5">
      <div className="flex min-w-0 items-center justify-between">
        <div className="text-lg font-semibold uppercase text-primary-600 dark:text-primary-400">
          Id: {uid}
        </div>
        <ActionMenu />
      </div>

      <div>
        <p className="text-xs uppercase">Current Status</p>
        <p
          className={clsx(
            "text-base font-medium text-this dark:text-this-light",
            status.isActive ? "this:success" : "this:warning",
          )}
        >
          {status.isActive ? "Up" : "Down"} for {status.time}
        </p>
      </div>

      <div className="flex grow justify-between gap-2">
        <div>
          <p className="text-xs-plus text-gray-400 dark:text-dark-300">
            Total Uptime
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-dark-100">
            {uptime}
          </p>
        </div>
        <div>
          <p className="text-xs-plus text-gray-400 dark:text-dark-300">Response</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-dark-100">
            {response}
          </p>
        </div>
        <div>
          <p className="text-xs-plus text-gray-400 dark:text-dark-300">Memory</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-dark-100">
            {memory}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Country
          </p>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            traffic
          </p>
        </div>
        {countries.map((country, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <img className="size-6" src={country.flag} alt={country.name} />
              <p className="font-medium text-gray-800 dark:text-dark-100">
                {country.name}
              </p>
            </div>
            <div>
              <span className="text-end font-medium text-gray-800 dark:text-dark-100">
                {country.traffic}
              </span>{" "}
              <span className="text-xs">/{country.memory}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {ipList.map((ip, i) => (
          <Badge key={i} variant="soft" color="info">
            {ip}
          </Badge>
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

ServerCard.propTypes = {
  uid: PropTypes.string,
  status: PropTypes.object,
  countries: PropTypes.array,
  uptime: PropTypes.string,
  response: PropTypes.string,
  memory: PropTypes.string,
  ipList: PropTypes.array,
};
