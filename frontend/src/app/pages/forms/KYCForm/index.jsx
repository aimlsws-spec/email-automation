// Import Dependencies
import { useState } from "react";
import clsx from "clsx";

// Local Imports
import { Page } from "components/shared/Page";
import { Card } from "components/ui";
import { KYCFormProvider } from "./KYCFormProvider";
import { Stepper } from "./Stepper";
import { UnderReview } from "./UnderReview";
import { AddressInfo } from "./steps/AddressInfo";
import { Declaration } from "./steps/Declaration";
import { Idenfication } from "./steps/Idenfication";
import { PersonalInfo } from "./steps/PersonalInfo";

// ----------------------------------------------------------------------

const steps = [
  {
    key: "personalInfo",
    component: PersonalInfo,
    label: "Personal Information",
    description:
      "Please provide your personal information in order to complete your KYC",
  },
  {
    key: "addressInfo",
    component: AddressInfo,
    label: "Address Information",
    description: "Enter name, DOB, gender, email, phone and occupation",
  },
  {
    key: "identifyDocument",
    component: Idenfication,
    label: "Idenfication",
    description:
      "Upload a scanned copy of ID proof (passport, driver’s license or ID Card).",
  },
  {
    key: "declaration",
    component: Declaration,
    label: "Declaration",
    description:
      "Read and agree to the terms and conditions of the form. Check the box to confirm information and consent.",
  },
];

const KYCForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [finished, setFinished] = useState(false);

  const ActiveForm = steps[currentStep].component;

  const stepsNode = (
    <>
      <div className="col-span-12 sm:order-last sm:col-span-4 lg:col-span-3">
        <div className="sticky top-24 sm:mt-3">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>
      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
        <Card className="h-full p-4 sm:p-5">
          <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
            {steps[currentStep].label}
          </h5>
          <p className="text-sm text-gray-500 dark:text-dark-200">
            {steps[currentStep].description}
          </p>
          {!finished && (
            <ActiveForm
              setCurrentStep={setCurrentStep}
              setFinished={setFinished}
            />
          )}
        </Card>
      </div>
    </>
  );

  return (
    <Page title="eKYC Form">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-(--margin-x) pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          eKYC Form
        </h2>

        <KYCFormProvider>
          <div
            className={clsx(
              "grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6",
              !finished && "grid-rows-[auto_1fr] sm:grid-rows-none "
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
        </KYCFormProvider>
      </div>
    </Page>
  );
};

export default KYCForm;
