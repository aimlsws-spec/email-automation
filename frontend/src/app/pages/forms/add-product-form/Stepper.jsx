// Import Dependencies
import clsx from "clsx";
import { HiCheck } from "react-icons/hi";
import PropTypes from "prop-types";

// Local Imports
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { useAddProductFormContext } from "./AddProductFormContext";

// ----------------------------------------------------------------------

export function Stepper({ steps, currentStep, setCurrentStep }) {
  const addProductFormCtx = useAddProductFormContext();
  const stepStatus = addProductFormCtx.state.stepStatus;

  return (
    <ol
      className={clsx(
        "steps line-space is-vertical text-center text-xs sm:text-start sm:text-sm",
      )}
      style={{ "--size": "2.75rem", "--line": "0.5rem" }}
    >
      {steps.map((step, i) => {
        const isClickable =
          stepStatus[step.key].isDone ||
          stepStatus[getLeftSiblingStep(step.key, stepStatus)]?.isDone;
        return (
          <li
            className={clsx(
              "step items-center",
              "pb-12 last:pb-0",
              currentStep > i
                ? "before:bg-primary-500"
                : "before:bg-gray-200 dark:before:bg-dark-500",
            )}
            key={step.key}
          >
            <button
              className={clsx(
                "step-header rounded-full outline-hidden dark:text-white",
                isClickable && "cursor-pointer",
                currentStep === i && "ring-2 ring-primary-500",
                stepStatus[step.key].isDone
                  ? "bg-primary-600 text-white ring-offset-[3px] ring-offset-gray-100 dark:bg-primary-500 dark:ring-offset-dark-900"
                  : "bg-gray-200 text-gray-950 dark:bg-dark-500",
              )}
              {...{
                onClick: isClickable
                  ? () => currentStep !== i && setCurrentStep(i)
                  : undefined,
              }}
              onKeyDown={createScopedKeydownHandler({
                siblingSelector: ".step-header",
                parentSelector: ".steps",
                loop: false,
                orientation: "vertical",
                activateOnFocus: true,
              })}
              disabled={!isClickable}
            >
              {stepStatus[step.key].isDone ? (
                <HiCheck className="size-5" />
              ) : (
                <step.icon className="size-4.5 opacity-70" />
              )}
            </button>
            <div className="text-start ltr:ml-4 rtl:mr-4">
              <p className="text-xs opacity-80">Step {i + 1}</p>
              <h3
                className={clsx(
                  "text-base font-medium",
                  currentStep === i
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-800 dark:text-dark-100",
                )}
              >
                {step.label}
              </h3>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function getLeftSiblingStep(step, stepStatus) {
  let keys = Object.keys(stepStatus);
  let index = keys.indexOf(step);
  return index < 1 ? undefined : keys[index - 1];
}

Stepper.propTypes = {
  steps: PropTypes.array,
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
};
