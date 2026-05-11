// Import Dependencies
import clsx from "clsx";
import { useState } from "react";
import {
  ArrowTrendingUpIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
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
  {
    id: randomId(),
    title: "Mobile App",
    Icon: DevicePhoneMobileIcon,
  },
  {
    id: randomId(),
    title: "Security",
    Icon: ShieldCheckIcon,
  },
];

const MenuItem = ({ active, title, onKeyDown, Icon, ...rest }) => (
  <li>
    <button
      className={clsx(
        "group inline-flex cursor-pointer items-center space-x-2 font-medium tracking-wide outline-hidden transition-colors ",
        active
          ? "text-primary-600 dark:text-primary-400"
          : "dark:hover:text-dark-100 dark:focus:text-dark-100 hover:text-gray-800 focus:text-gray-800",
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
            active
              ? "text-primary-600 dark:text-primary-400"
              : "dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200 text-gray-400 transition-colors group-hover:text-gray-500 group-focus:text-gray-500",
          )}
        />
      )}
      <span>{title}</span>
    </button>
  </li>
);

export function MenuExample2() {
  const [active, setActive] = useState(items[0]);
  return (
    <Card>
      <div className="dark:border-dark-500 border-b border-gray-200 p-4 sm:px-5">
        <h2 className="dark:text-dark-100 truncate font-medium tracking-wide text-gray-800 lg:text-base">
          Menu List Example 2
        </h2>
      </div>
      <div className="p-4 sm:px-5">
        <ul className="space-y-3.5 font-medium" data-menu-list>
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
