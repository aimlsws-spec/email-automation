```jsx
import { Avatar, AvatarDot } from "components/ui";

const WithIndicator = () => {
  return (
    <div className="inline-space">
      <Avatar
        size={8}
        src="/images/avatar/avatar-16.jpg"
        indicator={<AvatarDot color="primary" className="right-0 size-2.5" />}
      />
      <Avatar
        size={10}
        src="/images/avatar/avatar-16.jpg"
        indicator={<AvatarDot color="primary" className="right-0 size-3" />}
      />
      <Avatar
        src="/images/avatar/avatar-20.jpg"
        indicator={<AvatarDot color="primary" className="right-0" />}
      />
      <Avatar
        size={16}
        src="/images/avatar/avatar-19.jpg"
        indicator={<AvatarDot color="primary" className="right-0 m-0.5" />}
      />
      <Avatar
        size={20}
        src="/images/avatar/avatar-8.jpg"
        indicator={<AvatarDot color="primary" className="right-0 m-1 size-4" />}
      />
      <Avatar
        size={24}
        src="/images/avatar/avatar-5.jpg"
        indicator={
          <AvatarDot color="primary" className="right-0 m-1.5 size-4" />
        }
      />
    </div>
  );
};

export { WithIndicator };
```