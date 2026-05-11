import { Switch } from "components/ui";

const Outlined = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Switch defaultChecked variant="outlined" label="Primary" />
        <Switch
          color="secondary"
          defaultChecked
          variant="outlined"
          label="Secondary"
        />
        <Switch color="info" defaultChecked variant="outlined" label="Info" />
        <Switch
          color="success"
          defaultChecked
          variant="outlined"
          label="Success"
        />
        <Switch
          color="warning"
          defaultChecked
          variant="outlined"
          label="Warning"
        />
        <Switch color="error" defaultChecked variant="outlined" label="Error" />
      </div>
    </div>
  );
};

export { Outlined };
