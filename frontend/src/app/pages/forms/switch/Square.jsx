import { Switch } from "components/ui";

const Square = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Switch
          defaultChecked
          label="Primary"
          className="rounded-lg before:rounded-md"
        />
        <Switch
          color="secondary"
          defaultChecked
          label="Secondary"
          className="rounded-lg before:rounded-md"
        />
        <Switch
          color="info"
          defaultChecked
          label="Info"
          className="rounded-lg before:rounded-md"
        />
        <Switch
          color="success"
          defaultChecked
          label="Success"
          className="rounded-lg before:rounded-md"
        />
        <Switch
          color="warning"
          defaultChecked
          label="Warning"
          className="rounded-lg before:rounded-md"
        />
        <Switch
          color="error"
          defaultChecked
          label="Error"
          className="rounded-lg before:rounded-md"
        />
      </div>
    </div>
  );
};

export { Square };
