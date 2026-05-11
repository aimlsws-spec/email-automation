import { Checkbox } from "components/ui";

const CheckboxSizes = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Checkbox defaultChecked label="Extra Small" className="size-3.5" />
        <Checkbox defaultChecked label="Small" className="size-4" />
        <Checkbox defaultChecked label="Default" />
        <Checkbox defaultChecked label="Medium" className="size-6" />
        <Checkbox defaultChecked label="Large" className="size-7" />
      </div>
    </div>
  );
};

export { CheckboxSizes };
