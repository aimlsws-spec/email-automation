import { Input } from "components/ui";

const InputSizes = () => {
  return (
    <div className="max-w-xl space-y-4">
      <Input placeholder="Small Size" className="h-8 py-1 text-xs" />
      <Input placeholder="Standart Size" />
      <Input placeholder="Large Size" className="h-12 text-base" />
    </div>
  );
};

export { InputSizes };
