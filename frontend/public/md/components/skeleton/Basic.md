```jsx
import { Skeleton } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-md space-y-4">
      <div className="flex flex-col border border-gray-150 dark:border-dark-600">
        <div className="flex space-x-5 px-5 py-4 ">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-1 flex-col justify-between py-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="w-full px-6 py-4">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="mt-4 h-3 w-8/12 rounded" />
        </div>
      </div>
      <div className="flex flex-col">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex space-x-5 py-4 ">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-1 flex-col justify-between py-2">
            <Skeleton className="h-3 w-10/12 rounded" />
            <Skeleton className="h-6 w-full rounded" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 border border-gray-150 dark:border-dark-600">
        <div className="px-4 pt-4">
          <Skeleton className="h-8 w-10/12 rounded-full" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="flex flex-1 flex-col justify-between space-y-4 p-4">
          <Skeleton className="h-4 w-9/12 rounded" />
          <Skeleton className="h-4 w-6/12 rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
      </div>
    </div>
  );
};

export { Basic };
```