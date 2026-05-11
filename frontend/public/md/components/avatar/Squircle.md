```jsx

import { Avatar } from "components/ui";

const Squircle = () => {
  return (
    <div className="inline-space">
      <Avatar
        size={8}
        src="/images/avatar/avatar-16.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
      <Avatar
        size={10}
        src="/images/avatar/avatar-10.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />

      <Avatar
        src="/images/avatar/avatar-20.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
      <Avatar
        size={16}
        src="/images/avatar/avatar-19.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
      <Avatar
        size={20}
        src="/images/avatar/avatar-8.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
      <Avatar
        size={24}
        src="/images/avatar/avatar-5.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />
    </div>
  );
};

export { Squircle };

```