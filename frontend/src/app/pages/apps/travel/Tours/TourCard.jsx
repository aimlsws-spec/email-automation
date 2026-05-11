// Import Dependencies
import PropTypes from "prop-types";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Box, Button, Swap, SwapOff, SwapOn } from "components/ui";
// ----------------------------------------------------------------------

export function TourCard({ cover, name, location, rating, isLiked }) {
  return (
    <Box>
      <img
        className="h-80 w-full rounded-lg object-cover"
        src={cover}
        alt={name}
      />
      <div className="absolute inset-0 flex h-full w-full flex-col justify-between">
        <div className="flex justify-end p-3">
          <Swap
            component={Button}
            isIcon
            unstyled
            className="size-7 rounded-full bg-black/20 hover:bg-black/30 focus:bg-black/30"
            defaultValue={isLiked ? "on" : "off"}
          >
            <SwapOn>
              <HeartIconFilled className="size-4 text-error" />
            </SwapOn>
            <SwapOff>
              <HeartIconOutline className="size-4 text-white" />
            </SwapOff>
          </Swap>
        </div>
        <div className="rounded-lg bg-linear-to-t from-[#19213299] via-[#19213266] to-transparent px-4 py-3 pt-14">
          <div>
            <a
              href="##"
              className="line-clamp-2 text-base font-semibold text-white"
            >
              {name}
            </a>
          </div>
          <div className="mt-1 flex items-center gap-3 text-white/90">
            <p className="flex min-w-0 items-center gap-1">
              <MapPinIcon className="size-3.5 shrink-0" />
              <span className="truncate text-xs-plus">{location} </span>
            </p>
            <p className="flex shrink-0 items-center gap-1">
              <StarIcon className="size-3.5" />
              <span className="text-xs-plus">{rating}</span>
            </p>
          </div>
        </div>
      </div>
    </Box>
  );
}

TourCard.propTypes = {
  cover: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
  rating: PropTypes.string,
  isLiked: PropTypes.bool,
};
