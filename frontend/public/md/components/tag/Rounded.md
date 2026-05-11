```jsx
import { Tag } from "components/ui";

const Rounded = () => {
  return (
    <div className="inline-space">
      <Tag href="#" className="rounded-full">
        Neutral
      </Tag>
      <Tag href="#" color="primary" className="rounded-full">
        Primary
      </Tag>
      <Tag href="#" color="secondary" className="rounded-full">
        Secondary
      </Tag>
      <Tag href="#" color="info" className="rounded-full">
        Info
      </Tag>
      <Tag href="#" color="success" className="rounded-full">
        Success
      </Tag>
      <Tag href="#" color="warning" className="rounded-full">
        Warning
      </Tag>
      <Tag href="#" color="error" className="rounded-full">
        Error
      </Tag>
    </div>
  );
};

export { Rounded };

```