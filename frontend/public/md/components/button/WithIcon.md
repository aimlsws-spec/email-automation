```jsx
// Import Dependencies
import {
  HeartIcon,
  TicketIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  ChevronDoubleDownIcon,
} from "@heroicons/react/24/outline";
import { CloudIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const WithIcon = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Button color="secondary" className="space-x-2 ">
        <HeartIcon className="size-5 stroke-2" />
        <span>Like</span>
      </Button>

      <Button
        color="primary"
        className="space-x-2 rounded-full "
      >
        <TicketIcon className="size-5 stroke-2" />
        <span>Tickets</span>
      </Button>

      <Button
        color="info"
        className="space-x-2 rounded-full "
      >
        <span>Cloud</span>
        <CloudIcon className="size-5" />
      </Button>

      <Button
        color="warning"
        variant="outlined"
        className="space-x-2 "
      >
        <span>Trending</span>
        <ArrowTrendingUpIcon className="size-5" />
      </Button>

      <Button className="space-x-2 rounded-full ">
        <ArrowPathIcon className="size-5" />
        <span>Refresh</span>
      </Button>

      <Button color="warning" isGlow className="space-x-2 ">
        <span>Low Energy</span>
        <ChevronDoubleDownIcon className="size-5" />
      </Button>

      <Button
        color="error"
        variant="soft"
        className="space-x-2 "
      >
        <NoSymbolIcon className="size-5" />
        <span>Block</span>
      </Button>
    </div>
  );
};

export { WithIcon };

```