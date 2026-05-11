import { Textarea } from "components/ui";

const WithLabel = () => {
  return (
    <div className="max-w-xl">
      <Textarea placeholder="Enter text" label="Label Textarea" rows="5" />
    </div>
  );
};

export { WithLabel };
