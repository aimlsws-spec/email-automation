import { Tag } from "components/ui";

const SoftColor = () => {
  return (
    <div className="inline-space">
      <Tag href="#" variant="soft" color="primary" className="rounded-full">
        Primary
      </Tag>
      <Tag href="#" variant="soft" color="secondary" className="rounded-full">
        Secondary
      </Tag>
      <Tag href="#" variant="soft" color="info" className="rounded-full">
        Info
      </Tag>
      <Tag href="#" variant="soft" color="success" className="rounded-full">
        Success
      </Tag>
      <Tag href="#" variant="soft" color="warning" className="rounded-full">
        Warning
      </Tag>
      <Tag href="#" variant="soft" color="error" className="rounded-full">
        Error
      </Tag>
    </div>
  );
};

export { SoftColor };
