// Import Dependencies
import clsx from "clsx";
import { useState } from "react";
import {
  ArrowTrendingUpIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { TbTruckDelivery, TbCopyright } from "react-icons/tb";
import PropTypes from "prop-types";

// Local Imports
import { Card } from "components/ui";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

const items = [
  {
    id: randomId(),
    title: "Getting start",
    Icon: ArrowTrendingUpIcon,
  },
  {
    id: randomId(),
    title: "Shipping",
    Icon: TbTruckDelivery,
  },
  {
    id: randomId(),
    title: "Payments",
    Icon: CreditCardIcon,
  },
  {
    id: randomId(),
    title: "Returns",
    Icon: ReceiptRefundIcon,
  },
  {
    id: randomId(),
    title: "My Account",
    Icon: UserIcon,
  },
  {
    id: randomId(),
    title: "Copyright & Legal",
    Icon: TbCopyright,
  },
];

const MenuItem = ({ active, title, onKeyDown, Icon, ...rest }) => (
  <li>
    <button
      className={clsx(
        "group flex w-full cursor-pointer space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-colors ",
        active
          ? "bg-linear-to-r from-purple-500 to-purple-600 text-white"
          : "hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800 dark:hover:bg-dark-600 dark:hover:text-dark-100 dark:focus:bg-dark-600 dark:focus:text-dark-100",
      )}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: "[data-menu-list-item]",
        parentSelector: "[data-menu-list]",
        activateOnFocus: false,
        loop: true,
        orientation: "vertical",
        onKeyDown,
      })}
      data-menu-list-item
      {...rest}
    >
      {Icon && (
        <Icon
          className={clsx(
            "size-4.5 stroke-[1.5]",
            !active &&
              "text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200",
          )}
        />
      )}
      <span>{title}</span>
    </button>
  </li>
);

export function MenuExample10() {
  const [active, setActive] = useState(items[0]);
  return (
    <Card>
      <div className="border-b border-gray-200 p-4 dark:border-dark-500 sm:px-5">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100 lg:text-base">
          Menu List Example 10
        </h2>
      </div>
      <div className="p-4 sm:px-5">
        <ul className="space-y-1.5 font-medium" data-menu-list>
          {items.map((item) => (
            <MenuItem
              key={item.id}
              title={item.title}
              Icon={item.Icon}
              active={active === item}
              onClick={() => setActive(item)}
            />
          ))}
        </ul>
      </div>
    </Card>
  );
}

MenuItem.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  Icon: PropTypes.elementType,
  onKeyDown: PropTypes.func,
};
