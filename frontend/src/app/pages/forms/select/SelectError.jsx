import { Select } from "components/ui";

const SelectError = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Product"
        defaultValue="Potato"
        data={["Apple", "Orange", "Potato", "Tomato"]}
        error="This is error text"
      />
    </div>
  );
};

export { SelectError };
