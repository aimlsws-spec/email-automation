import { Spinner } from "components/ui";

const NoAnimation = () => {
  return (
    <div>
      <div className="inline-space flex flex-wrap">
        <Spinner animate={false} color="primary" />
        <Spinner variant="soft" animate={false} color="primary" />
        <Spinner variant="innerDot" animate={false} color="primary" />
      </div>
    </div>
  );
};

export { NoAnimation };
