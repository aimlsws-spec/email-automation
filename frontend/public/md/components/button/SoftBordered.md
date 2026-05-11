```jsx
import { Button } from "components/ui";

const SoftBordered = () => {
  return (
    <div className="inline-space">
      <Button
        color="primary"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Primary
      </Button>
      <Button
        color="secondary"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Secondary
      </Button>
      <Button
        color="info"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Info
      </Button>
      <Button
        color="success"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Success
      </Button>
      <Button
        color="warning"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Warning
      </Button>
      <Button
        color="error"
        variant="soft"
        className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
      >
        Error
      </Button>
    </div>
  );
};

export { SoftBordered };

```