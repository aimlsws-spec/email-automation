// Import Dependencies
import PropTypes from "prop-types";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { FaEthereum } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

// Local Imports
import { Badge, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function NftCard({ image, time, name, artist, likes, currentBid }) {
  return (
    <Card className="p-2 pb-3">
      <div className="relative w-full">
        <img
          className="h-64 w-full rounded-xl object-cover object-center"
          src={image}
          alt={name}
        />
        <div className="absolute inset-0 flex h-full w-full flex-col justify-between p-3">
          <div className="flex justify-end">
            <Button
              unstyled
              className="size-7 rounded-full bg-black/20 hover:bg-black/30 focus:bg-black/30"
            >
              <BookmarkIcon className="size-4 text-white" />
            </Button>
          </div>
          <div>
            <Badge className="rounded-full">{time}</Badge>
          </div>
        </div>
      </div>

      <div className="mx-2 mt-3">
        <div className="flex justify-between text-xs">
          <a
            href="##"
            className="dark:text-dark-300 text-gray-400 hover:underline"
          >
            {artist}
          </a>
          <div>
            <FaHeart className="inline" />{" "}
            <span className="align-middle">{likes}</span>
          </div>
        </div>
        <a
          href="##"
          className="hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400 mt-1.5 truncate text-base font-medium text-gray-700"
        >
          {name}
        </a>
        <div className="mt-3 flex items-center justify-between">
          <p className="dark:text-navy-300 text-xs text-slate-400">
            Current bid
          </p>
          <p>
            <span className="dark:text-dark-100 font-semibold text-gray-800">
              <FaEthereum className="inline" />{" "}
              <span className="align-middle">{currentBid}</span>
            </span>{" "}
            <span className="dark:text-dark-300 align-middle text-gray-400">
              ETH
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}

NftCard.propTypes = {
  uid: PropTypes.string,
  image: PropTypes.string,
  time: PropTypes.string,
  name: PropTypes.string,
  artist: PropTypes.string,
  likes: PropTypes.string,
  currentBid: PropTypes.string,
};
