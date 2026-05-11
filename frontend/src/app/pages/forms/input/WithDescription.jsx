import { Input } from "components/ui";

const WithDescription = () => {
  return (
    <div className="max-w-xl">
      <Input placeholder="Enter Username" description="This is a help text" />
    </div>
  );
};

export { WithDescription };
