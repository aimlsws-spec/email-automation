// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import PropTypes from "prop-types";

// Local Imports
import { ContextualHelp } from "components/shared/ContextualHelp";
import { Button, Checkbox, Collapse, Input, Textarea } from "components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { CountrySelect } from "../components/CountrySelect";
import { addressInfoSchema } from "../schema";

// ----------------------------------------------------------------------

export function AddressInfo({ setCurrentStep }) {
  const kycFormCtx = useKYCFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(addressInfoSchema),
    defaultValues: kycFormCtx.state.formData.addressInfo,
  });

  const showCorrespondenceAddressForm = !watch("isSameCorrespondenceAddress");

  const onSubmit = (data) => {
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { addressInfo: { ...data } },
    });
    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { addressInfo: { isDone: true } },
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <h6 className="mt-6 flex space-x-1.5 text-base font-medium text-gray-800 dark:text-dark-100 ">
        <span>Permanent Address</span>
        <ContextualHelp
          title="Permanent Address"
          content={
            <p>
              A permanent address is a physical address where you permanently
              reside or have a legal residence. It is different from a mailing
              address, which is where you receive your mail and can be in a
              different location from your permanent address.
            </p>
          }
        />
      </h6>
      <div className="mt-3 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <Controller
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <CountrySelect
                    onChange={onChange}
                    value={value}
                    error={errors?.permanentAddress?.country?.message}
                    {...rest}
                  />
                );
              }}
              control={control}
              name="permanentAddress.country"
            />
          </div>

          <Input
            {...register("permanentAddress.city")}
            label="City"
            error={errors?.permanentAddress?.city?.message}
            placeholder="Enter City"
          />

          <Input
            {...register("permanentAddress.state")}
            label="State"
            error={errors?.permanentAddress?.state?.message}
            placeholder="Enter State"
          />

          <Input
            {...register("permanentAddress.zipCode")}
            label="Zipcode"
            error={errors?.permanentAddress?.zipCode?.message}
            placeholder="Enter Zipcode"
          />
        </div>

        <Textarea
          {...register("permanentAddress.addressLine1")}
          component={TextareaAutosize}
          minRows={3}
          label="Address Line 1"
          error={errors?.permanentAddress?.addressLine1?.message}
          placeholder="Enter Address Line 1"
        />

        <Textarea
          {...register("permanentAddress.addressLine2")}
          component={TextareaAutosize}
          minRows={3}
          label={
            <>
              Address Line 2{" "}
              <span className="text-xs text-gray-400 dark:text-dark-300">
                (Optional)
              </span>
            </>
          }
          error={errors?.permanentAddress?.addressLine2?.message}
          placeholder="Enter Address Line 2"
        />

        <Checkbox
          {...register("isSameCorrespondenceAddress")}
          label="Correspondence address is the same as permanent address."
        />
      </div>

      <Collapse in={showCorrespondenceAddressForm}>
        <hr className="mt-4 border-gray-200 dark:border-dark-500" />
        <h6 className="mt-3 flex space-x-1.5 text-base font-medium text-gray-800 dark:text-dark-100 ">
          <span>Correspondence Address</span>
          <ContextualHelp
            title="Correspondence Address"
            content={
              <p>
                A correspondence address is an address that you can be
                officially contacted at but do not reside within. It is
                different from a residential address, which is where you
                physically live for a minimum of 180 days a year.
              </p>
            }
          />
        </h6>
        <div className="mt-3 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col">
              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <CountrySelect
                    onChange={onChange}
                    value={value}
                    error={errors?.correspondenceAddress?.country?.message}
                    {...rest}
                  />
                )}
                control={control}
                name="correspondenceAddress.country"
              />
            </div>

            <Input
              {...register("correspondenceAddress.city")}
              label="City"
              error={errors?.correspondenceAddress?.city?.message}
              placeholder="Enter City"
            />

            <Input
              {...register("correspondenceAddress.state")}
              label="State"
              error={errors?.correspondenceAddress?.state?.message}
              placeholder="Enter State"
            />

            <Input
              {...register("correspondenceAddress.zipCode")}
              label="Zipcode"
              error={errors?.correspondenceAddress?.zipCode?.message}
              placeholder="Enter Zipcode"
            />
          </div>

          <Textarea
            {...register("correspondenceAddress.addressLine1")}
            component={TextareaAutosize}
            minRows={3}
            label="Address Line 1"
            error={errors?.correspondenceAddress?.addressLine1?.message}
            placeholder="Enter Address Line 1"
          />

          <Textarea
            {...register("correspondenceAddress.addressLine2")}
            component={TextareaAutosize}
            minRows={3}
            label={
              <>
                Address Line 2{" "}
                <span className="text-xs text-gray-400 dark:text-dark-300">
                  (Optional)
                </span>
              </>
            }
            error={errors?.correspondenceAddress?.addressLine2?.message}
            placeholder="Enter Address Line 2"
          />
        </div>
      </Collapse>

      <div className="mt-8 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

AddressInfo.propTypes = {
  setCurrentStep: PropTypes.func,
};
