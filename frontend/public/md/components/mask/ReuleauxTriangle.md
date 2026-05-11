```jsx
import { Avatar } from "components/ui";

const ReuleauxTriangle = () => {
  return (
    <Avatar
      size={24}
      src="/images/avatar/avatar-5.jpg"
      classNames={{ display: "mask is-reuleaux-triangle rounded-none" }}
    />
  );
};

export { ReuleauxTriangle };
```