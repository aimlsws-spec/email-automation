// Import Dependencies
import { useState } from "react";

// Local Imports
import { Progress, Circlebar, Button } from "components/ui";
import { useToggle, useStep } from "hooks";

// ----------------------------------------------------------------------

const Customizer = () => {
  const [isActive, setIsActive] = useState(false);
  const [showRail, setShowRails] = useState(true);

  const [currentStep, helpers] = useStep(5);

  const [color, toggleColor] = useToggle([
    "success",
    "neutral",
    "primary",
    "secondary",
    "info",
    "warning",
    "error",
  ]);

  const { canGoToPrevStep, canGoToNextStep, goToNextStep, goToPrevStep } =
    helpers;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <p>
          <span className="font-medium text-gray-600 dark:text-dark-100">
            {currentStep}
          </span>
          <span> of 5 Task</span>
        </p>
        <div className="flex space-x-2 ">
          <Button
            onClick={goToPrevStep}
            className="size-7 rounded-full p-0"
            disabled={!canGoToPrevStep}
          >
            -
          </Button>
          <Button
            onClick={goToNextStep}
            className="size-7 rounded-full p-0"
            disabled={!canGoToNextStep}
          >
            +
          </Button>
        </div>
      </div>
      <div className="mt-2 flex items-end space-x-4 ">
        <Circlebar
          color={color}
          value={currentStep * 20}
          isActive={isActive}
          showRail={showRail}
        >
          <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
            {currentStep} / 5
          </span>
        </Circlebar>
        <div className="w-full">
          <div>
            <p className=" text-end">
              <span className="font-medium text-gray-600 dark:text-dark-100">
                {currentStep}
              </span>
              <span> / 5 Task</span>
            </p>
          </div>
          <Progress
            color={color}
            value={currentStep * 20}
            isActive={isActive}
            showRail={showRail}
            className="mt-2"
          />
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <Button onClick={toggleColor}>Color</Button>
        <div className="flex space-x-2 ">
          <Button onClick={() => setShowRails(!showRail)}>Rail</Button>

          <Button
            color={!isActive && "primary"}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? "Unactive" : "Activate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Customizer };
