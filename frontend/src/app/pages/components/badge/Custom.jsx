// Import Dependencies
import {
  ArrowTrendingUpIcon,
  CloudIcon,
  ShieldCheckIcon,
  StarIcon,
  TagIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/solid";


// Local Imports
import { Badge } from "components/ui";

// ----------------------------------------------------------------------

const Custom = () => {
  return (
    <div className="inline-space flex flex-wrap items-center">
      <Badge className="gap-2 rounded-full px-3">
        <ArrowUpIcon className="size-3.5" />
        <span>Neutral</span>
      </Badge>
      <Badge color="primary" className="gap-2 rounded-full px-3">
        <StarIcon className="size-4" />
        <span>Primary</span>
      </Badge>
      <Badge
        variant="soft"
        color="secondary"
        className="gap-2 rounded-full border border-this-darker/20 px-3 dark:border-this-lighter/20"
      >
        <TagIcon className="size-4" />
        <span>Secondary</span>
      </Badge>
      <Badge color="info" className="rounded-full">
        <CloudIcon className="size-4" />
      </Badge>
      <Badge variant="soft" color="success">
        <ArrowTrendingUpIcon className="size-4" />
      </Badge>
      <Badge
        color="warning"
        className="animate-pulse gap-2 px-3 shadow-lg shadow-this/50 dark:shadow-this-light/50"
      >
        <ShieldCheckIcon className="size-4" />
        <span>Warning</span>
      </Badge>
      <Badge
        unstyled
        className="rounded-full bg-linear-to-r from-purple-500 to-orange-600 px-3 py-1.5 text-xs text-white "
      >
        Live
      </Badge>
      <Badge
        unstyled
        className="rounded-sm bg-gray-200 px-2 py-1.5 text-xs text-gray-900"
      >
        White
      </Badge>
      <Badge
        unstyled
        className="rounded-sm bg-dark-800 px-2 py-1.5 text-xs text-white"
      >
        Dark
      </Badge>
    </div>
  );
};

export { Custom };
