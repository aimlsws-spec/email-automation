import { Textarea } from "components/ui";

const Disabled = () => {
  return (
    <div className="max-w-xl">
      <Textarea
        placeholder="Enter text"
        label="Disabled Textarea"
        rows="5"
        disabled
      />
    </div>
  );
};

export { Disabled };
