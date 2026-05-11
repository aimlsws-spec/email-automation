```jsx
import { Avatar, AvatarDot } from "components/ui";

const ActiveIndicator = () => {
  return (
    <div className="inline-space">
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="primary" className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="secondary" className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="info" className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="success" className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="warning" className="right-0" />}
      />
      <Avatar
        name="John Doe"
        indicator={<AvatarDot isPing color="error" className="right-0" />}
      />
    </div>
  );
};

export { ActiveIndicator };
```