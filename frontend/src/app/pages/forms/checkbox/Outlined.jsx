import { Checkbox } from "components/ui";

const Outlined = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Checkbox defaultChecked variant="outlined" label="Primary" />
        <Checkbox
          color="secondary"
          defaultChecked
          variant="outlined"
          label="Secondary"
        />
        <Checkbox color="info" defaultChecked variant="outlined" label="Info" />
        <Checkbox
          color="warning"
          defaultChecked
          variant="outlined"
          label="Warning"
        />
        <Checkbox
          color="success"
          defaultChecked
          variant="outlined"
          label="Success"
        />
        <Checkbox
          color="error"
          defaultChecked
          variant="outlined"
          label="Error"
        />
      </div>
    </div>
  );
};

export { Outlined };
