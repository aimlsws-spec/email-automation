import { Tag } from "components/ui";

const Outlined = () => {
  return (
    <div className="inline-space">
      <Tag href="#" variant="outlined">
        Neutral
      </Tag>
      <Tag href="#" variant="outlined" color="primary">
        Primary
      </Tag>
      <Tag href="#" variant="outlined" color="secondary">
        Secondary
      </Tag>
      <Tag href="#" variant="outlined" color="info">
        Info
      </Tag>
      <Tag href="#" variant="outlined" color="success">
        Success
      </Tag>
      <Tag href="#" variant="outlined" color="warning">
        Warning
      </Tag>
      <Tag href="#" variant="outlined" color="error">
        Error
      </Tag>
    </div>
  );
};

export { Outlined };
