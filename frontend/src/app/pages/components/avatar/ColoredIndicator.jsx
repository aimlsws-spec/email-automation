import { Avatar, AvatarDot } from "components/ui";

const ColoredIndicator = () => {
  return (
    <div className="inline-space">
      <Avatar
        src="/images/avatar/avatar-10.jpg"
        indicator={<AvatarDot className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-12.jpg"
        indicator={<AvatarDot color="primary" className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-5.jpg"
        indicator={<AvatarDot color="secondary" className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-17.jpg"
        indicator={<AvatarDot color="info" className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-18.jpg"
        indicator={<AvatarDot color="success" className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-19.jpg"
        indicator={<AvatarDot color="warning" className="right-0" />}
      />
      <Avatar
        src="/images/avatar/avatar-20.jpg"
        indicator={<AvatarDot color="error" className="right-0" />}
      />
    </div>
  );
};

export { ColoredIndicator };
