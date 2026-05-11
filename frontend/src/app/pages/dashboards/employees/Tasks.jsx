// Import Dependencies
import { ArrowTrendingUpIcon, ClockIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Badge, Card, Circlebar } from "components/ui";

// ----------------------------------------------------------------------

export function Tasks() {
  return (
    <Card className="flex justify-between gap-2 p-4 sm:flex-col lg:flex-row">
      <div className="flex flex-col justify-between">
        <div className="space-y-2 pb-2">
          <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
            Completed Task
          </h2>

          <Badge
            variant="soft"
            color="success"
            className="h-6 space-x-1 rounded-full "
          >
            <ArrowTrendingUpIcon className="size-3.5" />
            <span>34%</span>
          </Badge>
        </div>
        <p className="flex space-x-1 text-xs sm:hidden lg:flex">
          <ClockIcon className="size-4.5 text-gray-400 dark:text-dark-300" />
          <span>2 Days limit</span>
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Circlebar size={30} value={65} color="info">
          <div className="text-lg font-medium">65%</div>
        </Circlebar>
      </div>
    </Card>
  );
}
