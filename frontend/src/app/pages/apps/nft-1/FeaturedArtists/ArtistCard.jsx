// Import Dependencies
import PropTypes from "prop-types";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { FaEthereum } from "react-icons/fa6";

// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

export function ArtistCard({ name, avatar, itemsCount, featuredItems }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-4">
        <Avatar size={10} src={avatar} name={name} initialColor="auto" />
        <div className="min-w-0">
          <a
            href="##"
            className="group flex items-center text-gray-800 dark:text-dark-100"
          >
            <span className="truncate">{name}</span>{" "}
            <ArrowRightIcon className="size-3 shrink-0 stroke-2 opacity-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
          </a>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
            {itemsCount} items
          </p>
        </div>
      </div>
      <div className="hide-scrollbar mt-2.5 flex gap-4 overflow-x-auto px-4">
        {featuredItems.map((item) => (
          <div key={item.uid} className="w-28 shrink-0 text-xs">
            <img
              className="w-28 rounded-lg object-cover object-center"
              src={item.cover}
              alt={item.name}
            />
            <div className="mt-1.5 truncate">
              <a
                href="##"
                className="font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
              >
                {item.name}
              </a>
            </div>

            <p className="mt-1.5">
              <span className="font-semibold text-gray-800 dark:text-dark-100">
                <FaEthereum className="inline size-3.5" />{" "}
                <span className="align-middle">{item.price}</span>
              </span>{" "}
              <span className="align-middle text-gray-400 dark:text-dark-300">
                ETH
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

ArtistCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  itemsCount: PropTypes.string.isRequired,
  featuredItems: PropTypes.array,
};
