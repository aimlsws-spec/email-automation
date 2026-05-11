import { Switch } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Switch defaultChecked label="Primary" />
        <Switch color="secondary" defaultChecked label="Secondary" />
        <Switch color="info" defaultChecked label="Info" />
        <Switch color="success" defaultChecked label="Success" />
        <Switch color="warning" defaultChecked label="Warning" />
        <Switch color="error" defaultChecked label="Error" />
      </div>
    </div>
  );
};

export { Basic };
