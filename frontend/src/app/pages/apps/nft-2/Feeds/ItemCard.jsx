// Import Dependencies
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card, Swap, SwapOff, SwapOn } from "components/ui";
import { Deadline } from "./Deadline";

// ----------------------------------------------------------------------

export function ItemCard({
  cover,
  name,
  expirySeconds,
  highestBid,
  isLiked,
  artist,
}) {
  return (
    <Card className="group p-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar
            size={10}
            src={artist.avatar}
            name={artist.name}
            color="auto"
          />
          <div className="min-w-0">
            <div className="truncate">
              <a
                href="##"
                className="font-medium text-gray-800 dark:text-dark-100"
              >
                {artist.name}
              </a>
            </div>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
              {artist.itemsCount} items
            </p>
          </div>
        </div>
        <Swap
          component={Button}
          isIcon
          className="size-9"
          defaultValue={isLiked ? "on" : "off"}
        >
          <SwapOn>
            <HeartIconFilled className="size-5 text-error" />
          </SwapOn>
          <SwapOff>
            <HeartIconOutline className="size-5" />
          </SwapOff>
        </Swap>
      </div>
      <div className="relative mt-4">
        <img
          className="h-56 w-full rounded-lg object-cover object-center"
          src={cover}
          alt={name}
        />
        <div className="absolute top-0 h-full w-full rounded-lg bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute top-0 flex h-full w-full items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            unstyled
            className="min-w-[7rem] rounded-lg border border-white/10 bg-white/20 px-4 py-2 text-white backdrop-blur-sm backdrop-saturate-150 hover:bg-white/30 focus:bg-white/30"
          >
            Place a Bid
          </Button>
        </div>
      </div>
      <div className="mt-3 px-1">
        <div className="truncate">
          <a
            href="##"
            className="text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
          >
            {name}
          </a>
        </div>
        <div className="my-3 h-px bg-gray-200 dark:bg-dark-500"></div>

        <div className="flex justify-between">
          <Deadline expirySeconds={expirySeconds} />
          <div className="text-end">
            <p className="text-xs text-gray-400 dark:text-dark-300">
              Highest bid
            </p>
            <p className="text-base font-medium text-primary-600 dark:text-primary-400">
              {highestBid} ETH
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

ItemCard.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  expirySeconds: PropTypes.number,
  highestBid: PropTypes.number,
  isLiked: PropTypes.bool,
  artist: PropTypes.object,
};
