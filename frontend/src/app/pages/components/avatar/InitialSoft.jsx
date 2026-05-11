import { Avatar } from "components/ui";

const InitialSoft = () => {
  return (
    <div className="inline-space">
      <Avatar initialVariant="soft" initialColor="primary" name="John Doe" />
      <Avatar initialVariant="soft" initialColor="secondary" name="John Doe" />
      <Avatar initialVariant="soft" initialColor="info" name="John Doe" />
      <Avatar initialVariant="soft" initialColor="success" name="John Doe" />
      <Avatar initialVariant="soft" initialColor="warning" name="John Doe" />
      <Avatar initialVariant="soft" initialColor="error" name="John Doe" />
    </div>
  );
};

export { InitialSoft };
