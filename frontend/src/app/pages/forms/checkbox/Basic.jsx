import { Checkbox } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Checkbox defaultChecked label="Primary" />
        <Checkbox color="secondary" defaultChecked label="Secondary" />
        <Checkbox color="info" defaultChecked label="Info" />
        <Checkbox color="warning" defaultChecked label="Warning" />
        <Checkbox color="success" defaultChecked label="Success" />
        <Checkbox color="error" defaultChecked label="Error" />
      </div>
    </div>
  );
};

export { Basic };
