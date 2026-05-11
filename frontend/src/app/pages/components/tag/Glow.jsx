import { Tag } from "components/ui";

const Glow = () => {
  return (
    <div className="inline-space">
      <Tag href="#" isGlow>
        Neutral
      </Tag>
      <Tag href="#" color="primary" isGlow>
        Primary
      </Tag>
      <Tag href="#" color="secondary" isGlow>
        Secondary
      </Tag>
      <Tag href="#" color="info" isGlow>
        Info
      </Tag>
      <Tag href="#" color="success" isGlow>
        Success
      </Tag>
      <Tag href="#" color="warning" isGlow>
        Warning
      </Tag>
      <Tag href="#" color="error" isGlow>
        Error
      </Tag>
      <Tag href="#" variant="soft" color="warning" isGlow>
        Error
      </Tag>
    </div>
  );
};

export { Glow };
