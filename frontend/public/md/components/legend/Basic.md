```jsx
const Basic = () => {
  return (
    <div className="flex flex-col space-y-4">
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="size-2 rounded-full bg-gray-600 dark:bg-dark-200" />
        <span>Neutral</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:primary size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Primary</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:secondary size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Secondary</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:info size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Info</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:success size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Success</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:warning size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Warning</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:error size-2 rounded-full bg-this dark:bg-this-lighter" />
        <span>Error</span>
      </span>
    </div>
  );
};

export { Basic };
```