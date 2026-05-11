import { Select } from "components/ui";

const Default = () => {
  return (
    <div className="max-w-xl">
      <Select defaultValue="2">
        <option value="1">Apple</option>
        <option value="2">Orange</option>
        <option value="3" disabled>
          Potato
        </option>
        <option value="4">Tomato</option>
      </Select>
    </div>
  );
};

export { Default };
