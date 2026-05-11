```jsx
import { Circlebar } from "components/ui";

const GapDegree = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar value={25} gapDegree={75} color="primary">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          25%
        </span>
      </Circlebar>
      <Circlebar value={75} gapDegree={75} color="primary" isActive>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          75%
        </span>
      </Circlebar>
      <Circlebar
        value={50}
        gapOffsetDegree={135}
        gapDegree={90}
        color="primary"
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>
    </div>
  );
};

export { GapDegree };
```