```jsx
const PulseAnimation = () => {
  return (
    <div className="max-w-md">
      <div className="flex animate-pulse flex-col border border-gray-150 dark:border-dark-600">
        <div className="flex space-x-5 px-5 py-4 ">
          <div className="size-16 rounded-full bg-gray-150 dark:bg-dark-600" />
          <div className="flex flex-1 flex-col justify-between py-2">
            <div className="h-3 w-full rounded bg-gray-150 dark:bg-dark-600" />
            <div className="h-3 w-full rounded bg-gray-150 dark:bg-dark-600" />
          </div>
        </div>
        <div className="h-48 w-full bg-gray-150 dark:bg-dark-600" />
        <div className="w-full px-6 py-4">
          <div className="h-3 w-full rounded bg-gray-150 dark:bg-dark-600" />
          <div className="mt-4 h-3 w-8/12 rounded bg-gray-150 dark:bg-dark-600" />
        </div>
      </div>
    </div>
  );
};

export { PulseAnimation };
```