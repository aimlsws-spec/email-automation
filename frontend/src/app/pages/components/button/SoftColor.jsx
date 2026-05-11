import { Button } from "components/ui";

const SoftColor = () => {
  return (
    <div className="inline-space">
      <Button color="primary" variant="soft">
        Primary
      </Button>
      <Button color="secondary" variant="soft">
        Secondary
      </Button>
      <Button color="info" variant="soft">
        Info
      </Button>
      <Button color="success" variant="soft">
        Success
      </Button>
      <Button color="warning" variant="soft">
        Warning
      </Button>
      <Button color="error" variant="soft">
        Error
      </Button>
    </div>
  );
};

export { SoftColor };
