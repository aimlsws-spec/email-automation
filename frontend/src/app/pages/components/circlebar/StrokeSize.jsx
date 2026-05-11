import { Circlebar } from "components/ui";

const StrokeSize = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar value={33} strokeWidth={2} color="warning">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
      <Circlebar value={33} strokeWidth={4} color="warning">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
      <Circlebar value={33} color="warning">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
      <Circlebar value={33} strokeWidth={12} color="warning">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
    </div>
  );
};

export { StrokeSize };
