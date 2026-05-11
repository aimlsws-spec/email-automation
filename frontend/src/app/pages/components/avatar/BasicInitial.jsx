import { Avatar } from "components/ui";

const BasicInitial = () => {
  return (
    <div className="inline-space">
      <Avatar name="John Doe" />
      <Avatar initialColor="primary" name="John Doe" />
      <Avatar initialColor="secondary" name="John Doe" />
      <Avatar initialColor="info" name="John Doe" />
      <Avatar initialColor="success" name="John Doe" />
      <Avatar initialColor="warning" name="John Doe" />
      <Avatar initialColor="error" name="John Doe" />
    </div>
  );
};

export { BasicInitial };
