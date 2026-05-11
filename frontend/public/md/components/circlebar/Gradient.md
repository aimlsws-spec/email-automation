```jsx
import { Circlebar } from "components/ui";

const Gradient = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar
        value={66}
        variant="gradient"
        gradient={{
          start: "oklch(0.704 0.191 22.216)",
          end: "oklch(0.792 0.209 151.711)",
        }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>

      <Circlebar
        value={66}
        variant="gradient"
        gradient={{
          start: "oklch(0.75 0.183 55.934)",
          end: "oklch(0.789 0.154 211.53)",
        }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>

      <Circlebar
        value={66}
        variant="gradient"
        gradient={{
          start: "oklch(0.746 0.16 232.661)",
          end: "oklch(0.74 0.238 322.16)",
        }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>

      <Circlebar
        value={66}
        variant="gradient"
        gradient={{
          start: "oklch(0.712 0.194 13.428)",
          end: "oklch(0.702 0.183 293.541)",
        }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>

      <Circlebar
        value={66}
        variant="gradient"
        isActive
        gradient={{
          start: "oklch(0.792 0.209 151.711)",
          end: "oklch(0.704 0.191 22.216)",
        }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>

      <Circlebar
        isIndeterminate
        variant="gradient"
        gradient={{
          start: "#FF00FF",
          end: "#FF0000",
        }}
      />
    </div>
  );
};

export { Gradient };
```