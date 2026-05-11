// Import Dependencies
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";

// Local Imports
import { Avatar, Button, Card, Swap, SwapOff, SwapOn } from "components/ui";
import { Deadline } from "./Deadline";

// ----------------------------------------------------------------------

export function FeaturedItem() {
  return (
    <Card className="p-3">
      <img
        className="h-56 w-full rounded-lg object-cover object-center"
        src="/images/objects/object-18.jpg"
        alt="NftImage"
      />
      <div className="mt-3 p-1">
        <div className="flex min-w-0 items-center justify-between space-x-1">
          <a
            href="##"
            className="truncate text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
          >
            The Runner #033
          </a>
          <Swap
            component={Button}
            isIcon
            className="size-7 rounded-full"
            defaultValue="on"
          >
            <SwapOn>
              <HeartIconFilled className="size-4.5 text-error" />
            </SwapOn>
            <SwapOff>
              <HeartIconOutline className="size-4.5" />
            </SwapOff>
          </Swap>
        </div>
        <p className="mt-2 line-clamp-3 text-xs-plus">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis
          optio laudantium
        </p>
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar
              size={10}
              src="/images/avatar/avatar-20.jpg"
              name="Travis Fuller"
              color="auto"
            />

            <div className="min-w-0">
              <div className="truncate">
                <a
                  href="##"
                  className="font-medium text-gray-800 dark:text-dark-100"
                >
                  Travis Fuller
                </a>
              </div>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
                952 items
              </p>
            </div>
          </div>
          <Button className="h-7 rounded-full px-2.5 text-xs">Follow</Button>
        </div>
        <Deadline expirySeconds={52545} />
        <div className="my-5 h-px bg-gray-200 dark:bg-dark-500"></div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-medium text-gray-800 dark:text-dark-100">
            156 ETH
          </p>
          <Button className="h-9 min-w-[7rem] rounded-full" color="primary">
            Place a Bid
          </Button>
        </div>
      </div>
    </Card>
  );
}
