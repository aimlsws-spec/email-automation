import { Checkbox } from "components/ui";

const Rounded = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Checkbox defaultChecked label="Primary" className="rounded-full" />
        <Checkbox
          color="secondary"
          defaultChecked
          label="Secondary"
          className="rounded-full"
        />
        <Checkbox
          color="info"
          defaultChecked
          label="Info"
          className="rounded-full"
        />
        <Checkbox
          color="warning"
          defaultChecked
          label="Warning"
          className="rounded-full"
        />
        <Checkbox
          color="success"
          defaultChecked
          label="Success"
          className="rounded-full"
        />
        <Checkbox
          color="error"
          defaultChecked
          label="Error"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export { Rounded };
