import { Skeleton } from "components/ui";

const NoAnimation = () => {
  return (
    <div className="max-w-md">
      <div className="flex flex-col border border-gray-150 dark:border-dark-600">
        <div className="flex space-x-5 px-5 py-4 ">
          <Skeleton animate={false} className="size-16 rounded-full" />
          <div className="flex flex-1 flex-col justify-between py-2">
            <Skeleton animate={false} className="h-3 w-full rounded-sm" />
            <Skeleton animate={false} className="h-3 w-full rounded-sm" />
          </div>
        </div>
        <Skeleton animate={false} className="h-48 w-full" />
        <div className="w-full px-6 py-4">
          <Skeleton animate={false} className="h-3 w-full rounded-sm" />
          <Skeleton animate={false} className="mt-4 h-3 w-8/12 rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export { NoAnimation };
