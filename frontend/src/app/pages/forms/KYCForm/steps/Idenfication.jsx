// Import Dependencies
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "components/ui";
import { Controller, useForm } from "react-hook-form";
import { FaCar, FaPassport, FaRegIdCard } from "react-icons/fa";
import PropTypes from "prop-types";
import { useDidUpdate } from "hooks";

// Local Imports
import { useKYCFormContext } from "../KYCFormContext";
import { DocumentType } from "../components/DocumentType";
import { DocumentUpload } from "../components/DocumentUpload";
import { identifyDocumentSchema } from "../schema";

// ----------------------------------------------------------------------

const documentTypes = [
  {
    key: "passport",
    label: "Passport",
    description: "160+ countries supported",
    icon: FaPassport,
    rules: [
      "Take the photo in a room with enough light",
      "Please upload your image in one of these formats: .png, .jpg or .jpeg. The file size should not exceed 4 MB.",
      "Make sure both your face and ID are clear on the photo — nothing on the passport can be covered or censored",
    ],
  },
  {
    key: "nationalID",
    label: "National ID",
    description: "110+ countries supported",
    icon: FaRegIdCard,
    rules: [
      "Take the photo in a room with enough light",
      "Hold your ID card in front of your chest with both hands. Do not cover or censor any part of your ID card, such as your name, photo, or signature.",
      "Please upload your image in one of these formats: .png, .jpg or .jpeg. The file size should not exceed 4 MB.",
      "Verify that your ID card photo is correct. If it is not, try again.",
    ],
  },
  {
    key: "driverLicense",
    label: "Driver License",
    description: "EEA, USA and Canada",
    icon: FaCar,
    rules: [
      "Take the photo in a room with enough light",
      "Please upload your image in one of these formats: .png, .jpg or .jpeg. The file size should not exceed 4 MB.",
      "Hold your driver's license in front of your chest with both hands. Do not cover or censor any part of your driver's license, such as your name, photo, or signature.",
    ],
  },
];

export function Idenfication({ setCurrentStep }) {
  const kycFormCtx = useKYCFormContext();

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    resetField,
  } = useForm({
    resolver: yupResolver(identifyDocumentSchema),
    defaultValues: kycFormCtx.state.formData.identifyDocument,
  });

  const documentType = watch("type");

  const onSubmit = (data) => {
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { identifyDocument: { ...data } },
    });
    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { identifyDocument: { isDone: true } },
    });
    setCurrentStep(3);
  };

  useDidUpdate(() => {
    resetField("imageFront");
    resetField("imageBack");
    resetField("passportPage");
  }, [documentType]);

  return (
    <form
      className="max-w-3xl"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="mt-6">
        <p>Select Document Type</p>
        <Controller
          render={({ field }) => (
            <DocumentType {...field} documentTypes={documentTypes} />
          )}
          name="type"
          control={control}
          defaultValue="passport"
        />

        <p className="mt-6 text-base font-medium text-gray-800 dark:text-dark-100">
          To complete your upload and verify your account, please follow these
          steps:
        </p>

        <ul className="mt-3 space-y-2">
          {documentTypes
            .find((doc) => doc.key === documentType)
            .rules.map((item, i) => (
              <li
                key={i}
                className="flex items-center space-x-2 "
              >
                <CheckCircleIcon className="size-5 shrink-0 text-primary-500" />
                <p>{item}</p>
              </li>
            ))}
        </ul>

        <div className="mt-5 grid w-full place-items-start gap-3 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {documentType === "passport" && (
            <>
              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.imageFront?.message}
                    label="Passport Cover"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="imageFront"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.passportPage?.message}
                    label="Passport Page"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="passportPage"
                control={control}
              />
            </>
          )}
          {documentType === "nationalID" && (
            <>
              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.imageFront?.message}
                    label="National ID Front"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="imageFront"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.imageBack?.message}
                    label="National ID Back"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="imageBack"
                control={control}
              />
            </>
          )}
          {documentType === "driverLicense" && (
            <>
              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.imageFront?.message}
                    label="Driver License Front"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="imageFront"
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <DocumentUpload
                    {...field}
                    error={errors?.imageBack?.message}
                    label="Driver License Back"
                    classNames={{
                      box: "mt-2",
                    }}
                  />
                )}
                name="imageBack"
                control={control}
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

Idenfication.propTypes = {
  setCurrentStep: PropTypes.func,
};
