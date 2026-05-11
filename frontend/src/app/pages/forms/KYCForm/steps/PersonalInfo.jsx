// Import Dependencies
import { UserIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { Button, Input, InputErrorMsg } from "components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { CountrySelect } from "../components/CountrySelect";
import { PhoneDialCode } from "../components/PhoneDialCode";
import { personalInfoSchema } from "../schema";

// ----------------------------------------------------------------------

const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

const maritalStatuses = [
  {
    label: "Married",
    value: "married",
  },
  {
    label: "Widowed",
    value: "widowed",
  },
  {
    label: "Separated",
    value: "separated",
  },
  {
    label: "Divorced",
    value: "divorced",
  },
  {
    label: "Single",
    value: "single",
  },
];

export function PersonalInfo({ setCurrentStep }) {
  const kycFormCtx = useKYCFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues: kycFormCtx.state.formData.personalInfo,
  });

  const onSubmit = (data) => {
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { personalInfo: { ...data } },
    });
    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { personalInfo: { isDone: true } },
    });
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("firstName")}
            prefix={<UserIcon className="size-5" />}
            label="First Name"
            error={errors?.firstName?.message}
            placeholder="Enter First Name"
          />
          <Input
            {...register("lastName")}
            prefix={<UserIcon className="size-5" />}
            label="Last Name"
            error={errors?.lastName?.message}
            placeholder="Enter Last Name"
          />
        </div>

        <Input
          {...register("middleName")}
          prefix={<UserIcon className="size-5" />}
          label={
            <>
              Middle Name{" "}
              <span className="text-xs text-gray-400 dark:text-dark-300">
                (Optional)
              </span>
            </>
          }
          error={errors?.middleName?.message}
          placeholder="Enter Middle Name"
        />

        <Input
          {...register("email")}
          prefix={<EnvelopeIcon className="size-5" />}
          label="Enter Email"
          error={errors?.email?.message}
          placeholder="Enter Email Address"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Controller
            render={({ field }) => (
              <Listbox
                data={genders}
                value={
                  genders.find((gender) => gender.value === field.value) || null
                }
                onChange={(val) => field.onChange(val.value)}
                name={field.name}
                label="Gender"
                placeholder="Select Gender"
                displayField="label"
                error={errors?.gender?.message}
              />
            )}
            control={control}
            name="gender"
          />

          <Controller
            render={({ field }) => (
              <Listbox
                data={maritalStatuses}
                onChange={(val) => field.onChange(val.value)}
                value={
                  maritalStatuses.find((stat) => stat.value === field.value) ||
                  null
                }
                name={field.name}
                label="Matrial Status"
                placeholder="Select Matrial Status"
                displayField="label"
                error={errors?.matrialStatus?.message}
              />
            )}
            control={control}
            name="matrialStatus"
          />
        </div>

        <div className="flex flex-col">
          <span>Phone Number</span>
          <div className="mt-1.5 flex -space-x-px ">
            <Controller
              render={({ field: { onChange, value, name } }) => (
                <PhoneDialCode
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={Boolean(errors?.dialCode)}
                />
              )}
              control={control}
              name="dialCode"
            />
            <Input
              {...register("phone")}
              classNames={{
                root: "flex-1",
                input:
                  "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
              }}
              error={Boolean(errors?.phone)}
              placeholder="Phone number"
            />
          </div>
          <InputErrorMsg when={errors?.dialCode || errors?.phone}>
            {errors?.dialCode?.message ?? errors?.phone?.message}
          </InputErrorMsg>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col">
            <Controller
              render={({ field: { onChange, value, ...rest } }) => (
                <CountrySelect
                  onChange={onChange}
                  value={value}
                  error={errors?.nationality?.message}
                  {...rest}
                />
              )}
              control={control}
              name="nationality"
            />
          </div>

          <div className="flex flex-col">
            <Controller
              render={({ field: { onChange, value, ...rest } }) => (
                <DatePicker
                  onChange={onChange}
                  value={value || ""}
                  label="Date of Birth"
                  error={errors?.dateOfBirth?.message}
                  options={{ disableMobile: true }}
                  placeholder="Choose date..."
                  {...rest}
                />
              )}
              control={control}
              name="dateOfBirth"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]">Cancel</Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

PersonalInfo.propTypes = {
  setCurrentStep: PropTypes.func,
};
