// Import Dependencies
import clsx from "clsx";
import { useState } from "react";
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
  },
  {
    id: randomId(),
    title: "Shipping",
  },
  {
    id: randomId(),
    title: "Payments",
  },
  {
    id: randomId(),
    title: "Returns",
  },
  {
    id: randomId(),
    title: "My Account",
  },
  {
    id: randomId(),
    title: "Copyright & Legal",
  },
];

const MenuItem = ({ active, title, onKeyDown, ...rest }) => (
  <li>
    <button
      className={clsx(
        "flex w-full cursor-pointer rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-colors",
        active
          ? "bg-primary-600 dark:bg-primary-500 text-white"
          : "dark:hover:bg-dark-600 dark:hover:text-dark-100 dark:focus:bg-dark-600 dark:focus:text-dark-100 hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800",
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
      {title}
    </button>
  </li>
);

export function MenuExample3() {
  const [active, setActive] = useState(items[0]);
  return (
    <Card>
      <div className="dark:border-dark-500 border-b border-gray-200 p-4 sm:px-5">
        <h2 className="dark:text-dark-100 truncate font-medium tracking-wide text-gray-800 lg:text-base">
          Menu List Example 3
        </h2>
      </div>
      <div className="p-4 sm:px-5">
        <ul className="space-y-1.5 font-medium" data-menu-list>
          {items.map((item) => (
            <MenuItem
              key={item.id}
              title={item.title}
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
