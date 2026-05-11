import { Button } from "components/ui";

const Rounded = () => {
  return (
    <div className="inline-space">
      <Button className="rounded-full">Neutral</Button>
      <Button color="primary" className="rounded-full">
        Primary
      </Button>
      <Button color="secondary" className="rounded-full">
        Secondary
      </Button>
      <Button color="info" className="rounded-full">
        Info
      </Button>
      <Button color="success" className="rounded-full">
        Success
      </Button>
      <Button color="warning" className="rounded-full">
        Warning
      </Button>
      <Button color="error" className="rounded-full">
        Error
      </Button>
    </div>
  );
};

export { Rounded };
