const Outlined = () => {
  return (
    <div className="flex flex-col space-y-4">
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="size-3.5 rounded-full border-2 border-gray-300 dark:border-dark-300"></span>
        <span>Neutral</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:primary size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Primary</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:secondary size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Secondary</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:info size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Info</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:success size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Success</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:warning size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Warning</span>
      </span>
      <span className="inline-flex items-center space-x-2 leading-none ">
        <span className="this:error size-3.5 rounded-full border-2 border-this dark:border-this-light"></span>
        <span>Error</span>
      </span>
    </div>
  );
};

export { Outlined };
