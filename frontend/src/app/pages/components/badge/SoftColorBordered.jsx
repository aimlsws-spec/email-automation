import { Badge } from "components/ui";

const SoftColorBordered = () => {
  return (
    <div className="inline-space">
      <Badge
        variant="soft"
        color="primary"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Primary
      </Badge>
      <Badge
        variant="soft"
        color="secondary"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Secondary
      </Badge>
      <Badge
        variant="soft"
        color="info"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Info
      </Badge>
      <Badge
        variant="soft"
        color="success"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Success
      </Badge>
      <Badge
        variant="soft"
        color="warning"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Warning
      </Badge>
      <Badge
        variant="soft"
        color="error"
        className="border border-this-darker/20 dark:border-this-lighter/20"
      >
        Error
      </Badge>
    </div>
  );
};

export { SoftColorBordered };
