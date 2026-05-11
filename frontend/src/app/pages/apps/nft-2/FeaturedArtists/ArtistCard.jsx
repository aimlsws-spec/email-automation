// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function ArtistCard({ cover, avatar, name, itemsCount }) {
  return (
    <Card className="flex flex-col items-center pb-5 text-center">
      <img
        className="h-24 w-full rounded-t-lg object-cover object-center"
        src={cover}
        alt={name}
      />

      <Avatar
        size={20}
        name={name}
        src={avatar}
        classNames={{
          root: "-mt-12",
          display: "border-2 border-white text-xl dark:border-dark-700",
        }}
      />

      <div className="mt-1.5 px-2">
        <a
          href="##"
          className="truncate text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
        >
          {name}
        </a>
        <p className="text-xs text-gray-400 dark:text-dark-300">
          {itemsCount} items
        </p>
        <Button color="primary" className="mt-4 h-8 min-w-[7rem] rounded-full">
          Follow
        </Button>
      </div>
    </Card>
  );
}

ArtistCard.propTypes = {
  cover: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  itemsCount: PropTypes.string,
};
