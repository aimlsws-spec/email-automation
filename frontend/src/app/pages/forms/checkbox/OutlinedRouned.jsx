import { Checkbox } from "components/ui";

const OutlinedRouned = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Checkbox
          defaultChecked
          variant="outlined"
          label="Primary"
          className="rounded-full"
        />
        <Checkbox
          color="secondary"
          defaultChecked
          variant="outlined"
          label="Secondary"
          className="rounded-full"
        />
        <Checkbox
          color="info"
          defaultChecked
          variant="outlined"
          label="Info"
          className="rounded-full"
        />
        <Checkbox
          color="warning"
          defaultChecked
          variant="outlined"
          label="Warning"
          className="rounded-full"
        />
        <Checkbox
          color="success"
          defaultChecked
          variant="outlined"
          label="Success"
          className="rounded-full"
        />
        <Checkbox
          color="error"
          defaultChecked
          variant="outlined"
          label="Error"
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export { OutlinedRouned };
