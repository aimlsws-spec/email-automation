// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useState } from "react";

// Local Imports
import { Button, GhostSpinner } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { CoverImageUpload } from "../components/CoverImageUpload";
import { GalleryImageUpload } from "../components/GalleryImageUpload";
import { imageSchema } from "../schema";

// ----------------------------------------------------------------------

export function Images({ setCurrentStep, setFinished }) {
  const addProductFormCtx = useAddProductFormContext();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(imageSchema),
    defaultValues: addProductFormCtx.state.formData.images,
  });

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      addProductFormCtx.dispatch({
        type: "SET_FORM_DATA",
        payload: { images: { ...data } },
      });
      addProductFormCtx.dispatch({
        type: "SET_STEP_STATUS",
        payload: { images: { isDone: true } },
      });
      setLoading(false);
      setFinished(true);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="space-y-4">
        <Controller
          render={({ field }) => (
            <CoverImageUpload
              label="CTA Image"
              classNames={{
                box: "mt-1.5",
              }}
              error={errors?.cover?.message}
              {...field}
            />
          )}
          name="cover"
          control={control}
        />

        <Controller
          render={({ field }) => (
            <GalleryImageUpload
              label={
                <p className="mb-1.5">
                  Image Gallery{" "}
                  <span className="text-xs text-gray-400 dark:text-dark-300">
                    (Optional)
                  </span>
                </p>
              }
              error={errors?.gallery?.message}
              {...field}
            />
          )}
          name="gallery"
          control={control}
        />
      </div>

      <div className="mt-4 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(1)}>
          Prev
        </Button>
        <Button
          type="submit"
          className="min-w-[7rem] space-x-2 "
          color="primary"
          disabled={loading}
        >
          {loading && <GhostSpinner className="size-4 border-2" />}
          <span>Finish</span>
        </Button>
      </div>
    </form>
  );
}

Images.propTypes = {
  setCurrentStep: PropTypes.func,
  setFinished: PropTypes.func,
};
