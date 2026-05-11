// Import Dependencies
import clsx from "clsx";
import { useState } from "react";
import { FaImages, FaLayerGroup, FaListUl } from "react-icons/fa";

// Local Imports
import { Page } from "components/shared/Page";
import { Card } from "components/ui";
import { AddProductFormProvider } from "./AddProductFormProvider";
import { Stepper } from "./Stepper";
import { UnderReview } from "./UnderReview";
import { Description } from "./steps/Description";
import { General } from "./steps/General";
import { Images } from "./steps/Images";

// ----------------------------------------------------------------------

const steps = [
  {
    key: "general",
    component: General,
    label: "General",
    icon: FaLayerGroup,
  },
  {
    key: "description",
    component: Description,
    label: "Description",
    icon: FaListUl,
  },
  {
    key: "images",
    component: Images,
    label: "Images & CTA",
    icon: FaImages,
  },
];

const AddProductForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const ActiveForm = steps[currentStep].component;
  const StepIcon = steps[currentStep].icon;

  const stepsNode = (
    <>
      <div className="col-span-12 sm:col-span-4 lg:col-span-3">
        <div className="sticky top-24 sm:mt-3">
          <Stepper
            numberOfPieces={1000}
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
        <Card className="flex h-full flex-col">
          <div className="flex items-center space-x-2 border-b border-gray-200 p-4 dark:border-dark-500 sm:px-5 ">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary-600/10 p-1 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400">
              <StepIcon className="size-4" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-dark-100">
              <span> {steps[currentStep].label}</span>
            </h4>
          </div>
          {!finished && (
            <div className="flex grow flex-col p-4 sm:p-5">
              <ActiveForm
                setCurrentStep={setCurrentStep}
                setFinished={setFinished}
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );

  return (
    <Page title="Add Product Form">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Add New Product
        </h2>

        <AddProductFormProvider>
          <div
            className={clsx(
              "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
              !finished && "grid-rows-[auto_1fr] sm:grid-rows-none",
            )}
          >
            {finished ? (
              <div className="col-span-12 place-self-center">
                <UnderReview />
              </div>
            ) : (
              stepsNode
            )}
          </div>
        </AddProductFormProvider>
      </div>
    </Page>
  );
};

export default AddProductForm;
