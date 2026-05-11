```jsx
import { Badge } from "components/ui";

const SoftColor = () => {
  return (
    <div className="inline-space">
      <Badge
        color="primary"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Primary</span>
      </Badge>
      <Badge
        color="secondary"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Secondary</span>
      </Badge>
      <Badge
        color="info"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Info</span>
      </Badge>
      <Badge
        color="success"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Success</span>
      </Badge>
      <Badge
        color="warning"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Warning</span>
      </Badge>
      <Badge
        color="error"
        variant="soft"
        className="space-x-2 rounded-full "
      >
        <span className="size-2 rounded-full bg-current" />
        <span>Error</span>
      </Badge>
    </div>
  );
};

export { SoftColor };

```