import { Circlebar } from "components/ui";

const OffsetDegree = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar value={25} offsetDegree={0}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} offsetDegree={90}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} offsetDegree={180}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={25} offsetDegree={270}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
    </div>
  );
};

export { OffsetDegree };
