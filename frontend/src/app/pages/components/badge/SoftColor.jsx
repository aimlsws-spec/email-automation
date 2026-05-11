import { Badge } from "components/ui";

const SoftColor = () => {
  return (
    <div className="inline-space">
      <Badge variant="soft" color="primary">
        Primary
      </Badge>
      <Badge variant="soft" color="secondary">
        Secondary
      </Badge>
      <Badge variant="soft" color="info">
        Info
      </Badge>
      <Badge variant="soft" color="success">
        Success
      </Badge>
      <Badge variant="soft" color="warning">
        Warning
      </Badge>
      <Badge variant="soft" color="error">
        Error
      </Badge>
    </div>
  );
};

export { SoftColor };
