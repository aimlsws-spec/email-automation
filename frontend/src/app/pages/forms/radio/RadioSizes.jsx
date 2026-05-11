import { Radio } from "components/ui";

const RadioSizes = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Radio
          name="size"
          defaultChecked
          label="Extra Small"
          className="size-3.5"
        />
        <Radio name="size" label="Small" className="size-4" />
        <Radio name="size" label="Default" />
        <Radio name="size" label="Medium" className="size-6" />
        <Radio name="size" label="Large" className="size-7" />
      </div>
    </div>
  );
};

export { RadioSizes };
