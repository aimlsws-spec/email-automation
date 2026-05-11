import { Progress } from "components/ui";

const Indeterminate = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress value={33} isIndeterminate className="h-1" />
      <Progress color="primary" value={41} isIndeterminate className="h-1" />
      <Progress color="secondary" value={50} isIndeterminate className="h-1" />
      <Progress color="info" value={58} isIndeterminate className="h-1" />
      <Progress color="success" value={66} isIndeterminate className="h-1" />
      <Progress color="warning" value={75} isIndeterminate className="h-1" />
      <Progress color="error" value={83} isIndeterminate className="h-1" />
    </div>
  );
};

export { Indeterminate };
