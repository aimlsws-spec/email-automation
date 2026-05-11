import { Checkbox } from "components/ui";

const Disabled = () => {
  return (
    <div className="inline-space max-w-xl">
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled indeterminate label="Indeterminate" />
      <Checkbox disabled defaultChecked label="Checked" />
    </div>
  );
};

export { Disabled };
