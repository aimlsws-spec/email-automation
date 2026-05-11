```jsx
// Import Dependencies
import { useStep } from "hooks";
import clsx from "clsx";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function Advanced() {
  const [currentStep, helpers] = useStep(4);

  const {
    canGoToPrevStep,
    canGoToNextStep,
    goToNextStep,
    goToPrevStep,
    setStep,
  } = helpers;

  return (
    <div className="max-w-xl">
      <ol className="steps">
        {Array(4)
          .fill(null)
          .map((_, i) => {
            const step = i + 1;
            return (
              <li
                key={step}
                className={clsx(
                  "step",
                  currentStep > step
                    ? "before:bg-primary-500"
                    : "before:bg-gray-200 dark:before:bg-surface-2"
                )}
              >
                <button
                  onClick={() => setStep(step)}
                  className={clsx(
                    "step-header rounded-full dark:text-white",
                    currentStep === step
                      ? "border-2 border-primary-500 bg-gray-200 text-gray-800 dark:bg-surface-2"
                      : currentStep > step
                      ? "bg-primary-600 text-white dark:bg-primary-500"
                      : " bg-gray-200 text-gray-800 dark:bg-surface-2"
                  )}
                >
                  {step}
                </button>
                <h3 className="text-gray-600 dark:text-dark-100">
                  Step {step}
                </h3>
              </li>
            );
          })}
      </ol>

      <div className="mt-4 flex h-36 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-dark-600">
        <p className="text-lg">Current Step {currentStep}</p>
      </div>

      <div className="mt-4 flex justify-center space-x-2 ">
        <Button onClick={goToPrevStep} disabled={!canGoToPrevStep}>
          Prev
        </Button>
        <Button onClick={goToNextStep} disabled={!canGoToNextStep}>
          Next
        </Button>
      </div>
    </div>
  );
}
```