import { Avatar } from "components/ui";

const InitialSoftBordered = () => {
  return (
    <div className="inline-space">
      <Avatar
        initialVariant="soft"
        initialColor="primary"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
      <Avatar
        initialVariant="soft"
        initialColor="secondary"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
      <Avatar
        initialVariant="soft"
        initialColor="info"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
      <Avatar
        initialVariant="soft"
        initialColor="success"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
      <Avatar
        initialVariant="soft"
        initialColor="warning"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
      <Avatar
        initialVariant="soft"
        initialColor="error"
        name="John Doe"
        classNames={{
          initial: "border border-this-darker/20 dark:border-this-lighter/20",
        }}
      />
    </div>
  );
};

export { InitialSoftBordered };
