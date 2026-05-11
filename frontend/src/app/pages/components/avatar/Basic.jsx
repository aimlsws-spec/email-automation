import { Avatar } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space">
      <Avatar size={8} src="/images/avatar/avatar-16.jpg" />
      <Avatar size={10} src="/images/avatar/avatar-10.jpg" />
      <Avatar src="/images/avatar/avatar-20.jpg" />
      <Avatar size={16} src="/images/avatar/avatar-19.jpg" />
      <Avatar size={20} src="/images/avatar/avatar-8.jpg" />
      <Avatar size={24} src="/images/avatar/avatar-5.jpg" />
    </div>
  );
};

export { Basic };
