import { Avatar } from "components/ui";

const Heart = () => {
  return (
    <Avatar
      size={24}
      src="/images/avatar/avatar-5.jpg"
      classNames={{ display: "mask is-heart rounded-none" }}
    />
  );
};

export { Heart };
