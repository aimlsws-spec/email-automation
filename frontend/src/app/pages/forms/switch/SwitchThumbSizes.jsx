import { Switch } from "components/ui";

const SwitchThumbSizes = () => {
  return (
    <div className="flex flex-wrap gap-5">
      <Switch
        defaultChecked
        label="Default"
        style={{ "--thumb-border": "6px" }}
      />
      <Switch
        defaultChecked
        label="Default"
        style={{ "--thumb-border": "5px" }}
      />
      <Switch
        defaultChecked
        label="Default"
        style={{ "--thumb-border": "4px" }}
      />
      <Switch
        defaultChecked
        label="Default"
        style={{ "--thumb-border": "3px" }}
      />
      <Switch defaultChecked label="Default" />
    </div>
  );
};

export { SwitchThumbSizes };
