import { Textarea } from "components/ui";

const WithDescription = () => {
  return (
    <div className="max-w-xl">
      <Textarea
        placeholder="Enter text"
        label="Label Textarea"
        description="This is a help text"
        rows="5"
      />
    </div>
  );
};

export { WithDescription };
