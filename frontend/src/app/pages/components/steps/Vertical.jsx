export function Vertical() {
  return (
    <div className="max-w-xl">
      <ol className="steps is-vertical">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <li
              className="step pb-6 before:bg-gray-200 dark:before:bg-surface-2"
              key={i}
            >
              <div className="step-header rounded-full bg-gray-200 text-gray-800 dark:bg-surface-2 dark:text-white">
                {i + 1}
              </div>
              <h3 className="text-gray-600 ltr:ml-4 rtl:mr-4 dark:text-dark-100">
                Step {i + 1}
              </h3>
            </li>
          ))}
      </ol>
    </div>
  );
}
