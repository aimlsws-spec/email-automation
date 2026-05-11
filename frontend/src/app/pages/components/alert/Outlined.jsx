const Outlined = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <div
        role="alert"
        className="rounded-lg border border-gray-200 px-4 py-4 text-gray-800 dark:border-dark-450 dark:text-dark-100 sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:primary rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:secondary rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:info rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:success rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:warning rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:error rounded-lg border border-this-darker px-4 py-4 text-this-darker dark:border-this-lighter dark:text-this-lighter sm:px-5"
      >
        This is simple alert
      </div>
    </div>
  );
};

export { Outlined };
