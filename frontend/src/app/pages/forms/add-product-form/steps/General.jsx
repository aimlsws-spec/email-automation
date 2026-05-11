// Import Dependencies
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Listbox } from "components/shared/form/Listbox";
import { Button, Input, InputErrorMsg, Radio, Switch } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { generalSchema } from "../schema";

// ----------------------------------------------------------------------

const categories = [
  {
    id: "1",
    label: "Tablets",
  },
  {
    id: "2",
    label: "Gaming consoles",
  },
  {
    id: "3",
    label: "Smartphones",
  },
  {
    id: "4",
    label: "Drones",
  },
  {
    id: "5",
    label: "Cameras",
  },
  {
    id: "6",
    label: "Printers",
  },
  {
    id: "7",
    label: "TVs",
  },
];

const brands = [
  {
    id: "1",
    label: "Samsung",
  },
  {
    id: "2",
    label: "Sony",
  },
  {
    id: "3",
    label: "Philips",
  },
  {
    id: "4",
    label: "LG",
  },
  {
    id: "5",
    label: "Bose",
  },
  {
    id: "6",
    label: "Eon",
  },
  {
    id: "7",
    label: "Nexa",
  },
  {
    id: "8",
    label: "Viva",
  },
];

export function General({ setCurrentStep }) {
  const addProductFormCtx = useAddProductFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(generalSchema),
    defaultValues: addProductFormCtx.state.formData.general,
  });

  const onSubmit = (data) => {
    addProductFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { general: { ...data } },
    });
    addProductFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { general: { isDone: true } },
    });
    setCurrentStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-4">
        <Input
          {...register("title")}
          label="Title"
          error={errors?.title?.message}
          placeholder="Enter Product Title"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("sku")}
            label="SKU"
            error={errors?.sku?.message}
            placeholder="Enter Product SKU"
          />
          <Input
            {...register("price")}
            label="Price"
            type="number"
            error={errors?.price?.message}
            placeholder="Enter Product Price"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={categories}
                value={categories.find((cat) => cat.id === value) || null}
                onChange={(val) => onChange(val.id)}
                label="Category"
                placeholder="Select Category"
                displayField="label"
                error={errors?.category_id?.message}
                {...rest}
              />
            )}
            control={control}
            name="category_id"
          />
          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={brands}
                value={brands.find((brand) => brand.id === value) || null}
                onChange={(val) => onChange(val.id)}
                label="Brand"
                placeholder="Select Brand"
                displayField="label"
                error={errors?.brand_id?.message}
                {...rest}
              />
            )}
            control={control}
            name="brand_id"
          />
        </div>

        <div className="flex flex-col">
          <span>Selling Type</span>
          <div
            className={clsx(
              "mt-1.5 flex flex-col space-y-4 rounded-lg border px-3 py-4",
              errors?.selling_type
                ? "border-error dark:border-error-lighter"
                : "border-gray-300 dark:border-dark-450",
            )}
          >
            <Radio
              label="In Store Selling Only"
              {...register("selling_type")}
              value="online-sell"
            />
            <Radio
              label="Online Sell Only"
              {...register("selling_type")}
              value="in-store-sell"
            />
            <Radio
              label="Both In Store And Online Selling"
              {...register("selling_type")}
              value="online-in-store-sell"
            />
          </div>
          <InputErrorMsg when={errors?.selling_type}>
            {errors?.selling_type?.message}
          </InputErrorMsg>
        </div>

        <Switch label="In Stock" {...register("inStock")} />
      </div>
      <div className="mt-4 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]">Cancel</Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

General.propTypes = {
  setCurrentStep: PropTypes.func,
};
