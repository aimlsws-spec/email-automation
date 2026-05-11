import { Avatar, AvatarDot } from "components/ui";

const IndicatorPosition = () => {
  return (
    <div className="inline-space">
      <Avatar
        name="John Doe"
        indicator={<AvatarDot color="primary" isPing className="right-0" />}
      />

      <Avatar
        name="John Doe"
        indicator={<AvatarDot color="primary" isPing className="left-0" />}
      />

      <Avatar
        name="John Doe"
        indicator={
          <AvatarDot color="primary" isPing className="bottom-0 right-0" />
        }
      />

      <Avatar
        name="John Doe"
        indicator={
          <AvatarDot color="primary" isPing className="bottom-0 left-0" />
        }
      />
    </div>
  );
};

export { IndicatorPosition };
