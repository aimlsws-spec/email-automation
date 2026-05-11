import { Progress } from "components/ui";

const SoftColor = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress color="primary" variant="soft" value={41} />
      <Progress color="secondary" variant="soft" value={50} />
      <Progress color="info" variant="soft" value={58} />
      <Progress color="success" variant="soft" value={66} />
      <Progress color="warning" variant="soft" value={75} />
      <Progress color="error" variant="soft" value={83} />
    </div>
  );
};

export { SoftColor };
