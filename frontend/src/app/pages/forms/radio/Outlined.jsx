import { Radio } from "components/ui";

const Outlined = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Radio
          defaultChecked
          label="Primary"
          variant="outlined"
          name="outlined"
        />
        <Radio
          color="secondary"
          label="Secondary"
          variant="outlined"
          name="outlined"
        />
        <Radio color="info" label="Info" variant="outlined" name="outlined" />
        <Radio
          color="warning"
          label="Warning"
          variant="outlined"
          name="outlined"
        />
        <Radio
          color="success"
          label="Success"
          variant="outlined"
          name="outlined"
        />
        <Radio color="error" label="Error" variant="outlined" name="outlined" />
      </div>
    </div>
  );
};

export { Outlined };
