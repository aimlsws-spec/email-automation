import { Select } from "components/ui";

const Disabled = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Location"
        data={["Canada", "USA", "Germany", "Japan"]}
        disabled
      />
    </div>
  );
};

export { Disabled };
