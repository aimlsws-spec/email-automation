import { Badge } from "components/ui";

const Glow = () => {
  return (
    <div className="inline-space">
      <Badge isGlow>Neutral</Badge>
      <Badge isGlow color="primary">
        Primary
      </Badge>
      <Badge isGlow color="secondary">
        Secondary
      </Badge>
      <Badge isGlow color="info">
        Info
      </Badge>
      <Badge isGlow color="success">
        Success
      </Badge>
      <Badge isGlow color="warning">
        Warning
      </Badge>
      <Badge isGlow color="error">
        Error
      </Badge>
    </div>
  );
};

export { Glow };
