```jsx
const Basic = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <div
        role="alert"
        className="flex rounded-lg bg-gray-200 px-4 py-4 text-gray-800 dark:bg-dark-500 dark:text-dark-100 sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:primary flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:secondary flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:info flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:success flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:warning flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
      <div
        role="alert"
        className="this:error flex rounded-lg bg-this px-4 py-4 text-white sm:px-5"
      >
        This is simple alert
      </div>
    </div>
  );
};

export { Basic };
```