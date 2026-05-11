// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
import { ContextualHelp } from "components/shared/ContextualHelp";
import { TextEditor } from "components/shared/form/TextEditor";
import { Button, Input, Textarea } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { MetaTags } from "../components/MetaTags";
import { descriptionSchema } from "../schema";

// ----------------------------------------------------------------------

const editorModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }, "image"],
    ["clean"], // remove formatting button
  ],
};

export function Description({ setCurrentStep }) {
  const addProductFormCtx = useAddProductFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(descriptionSchema),
    defaultValues: addProductFormCtx.state.formData.description,
  });

  const onSubmit = (data) => {
    addProductFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { description: { ...data } },
    });
    addProductFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { description: { isDone: true } },
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div>
        <h6 className="text-base font-medium text-gray-800 dark:text-dark-100">
          <span>Product Description</span>
        </h6>
        <div className="mt-3 space-y-4">
          <Input
            {...register("short_description")}
            label="Short description"
            error={errors?.short_description?.message}
            placeholder="Enter Short Description"
          />
          <div className="flex flex-col">
            <span>Description</span>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange, ...rest } }) => (
                <TextEditor
                  value={value}
                  onChange={(val) => onChange(val)}
                  placeholder="Enter your content..."
                  className="mt-1.5 [&_.ql-editor]:max-h-80 [&_.ql-editor]:min-h-[12rem]"
                  modules={editorModules}
                  error={errors?.description?.message}
                  {...rest}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h6 className="flex space-x-1.5 text-base font-medium text-gray-800 dark:text-dark-100 ">
          <span>SEO Meta Data</span>
          <ContextualHelp
            title="SEO Meta Data"
            content={
              <p>
                SEO data is relevant information that your company needs to be
                aware of so that your business can take full advantage of all
                the opportunities presented with this type of strategy.
              </p>
            }
          />
        </h6>

        <div className="mt-3 space-y-4">
          <Input
            {...register("meta_title")}
            label="Meta title"
            error={errors?.meta_title?.message}
            placeholder="Enter Meta Title"
          />
          <Textarea
            rows={4}
            {...register("meta_description")}
            label="Meta Description"
            error={errors?.meta_description?.message}
            placeholder="Enter Meta Description"
          />
          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <MetaTags
                value={
                  value?.map((val, i) => {
                    return { id: i, value: val };
                  }) || []
                }
                placeholder="Enter Meta Tags"
                label="Meta Keywords"
                onChange={(val) => onChange(val.map((i) => i.value))}
                error={errors?.meta_keywords?.message}
                {...rest}
              />
            )}
            control={control}
            name="meta_keywords"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3 ">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>
          Prev
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

Description.propTypes = {
  setCurrentStep: PropTypes.func,
};
