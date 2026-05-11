import { Button } from "components/ui";

const Delay = () => {
  return (
    <Button
      data-tooltip
      data-tooltip-delay-hide={1000}
      data-tooltip-delay-show={100}
      data-tooltip-content={`I'm a tooltip`}
    >
      Default
    </Button>
  );
};

export { Delay };
