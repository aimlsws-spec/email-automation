import { Button } from "components/ui";

const Flat = () => {
  return (
    <div className="inline-space">
      <Button variant="flat">Neutral</Button>
      <Button color="primary" variant="flat">
        Primary
      </Button>
      <Button color="secondary" variant="flat">
        Secondary
      </Button>
      <Button color="info" variant="flat">
        Info
      </Button>
      <Button color="success" variant="flat">
        Success
      </Button>
      <Button color="warning" variant="flat">
        Warning
      </Button>
      <Button color="error" variant="flat">
        Error
      </Button>
    </div>
  );
};

export { Flat };
