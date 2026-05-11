import { Range } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-xl space-y-8">
      <Range defaultValue={50} />
      <Range defaultValue={50} color="primary" />
      <Range defaultValue={50} color="secondary" />
      <Range defaultValue={50} color="info" />
      <Range defaultValue={50} color="success" />
      <Range defaultValue={50} color="warning" />
      <Range defaultValue={50} color="error" />
    </div>
  );
};

export { Basic };
