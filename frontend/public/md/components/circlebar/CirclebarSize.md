```jsx
import { Circlebar } from "components/ui";

const CirclebarSize = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap items-start">
      <Circlebar value={25} size={12} color="primary">
        <span className="text-xs font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} size={16} color="primary">
        <span className="font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} size={20} color="primary">
        <span className="text-base font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} color="primary">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} size={28} color="primary">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} size={32} color="primary">
        <span className="text-xl font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
    </div>
  );
};

export { CirclebarSize };
```