```jsx
import { Tag } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space">
      <Tag href="#">Neutral</Tag>
      <Tag href="#" color="primary">
        Primary
      </Tag>
      <Tag href="#" color="secondary">
        Secondary
      </Tag>
      <Tag href="#" color="info">
        Info
      </Tag>
      <Tag href="#" color="success">
        Success
      </Tag>
      <Tag href="#" color="warning">
        Warning
      </Tag>
      <Tag href="#" color="error">
        Error
      </Tag>
    </div>
  );
};

export { Basic };

```