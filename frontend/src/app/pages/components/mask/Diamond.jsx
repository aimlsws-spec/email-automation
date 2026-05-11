import { Avatar } from "components/ui";

const Diamond = () => {
  return (
    <Avatar
      size={24}
      src="/images/avatar/avatar-5.jpg"
      classNames={{ display: "mask is-diamond rounded-none" }}
    />
  );
};

export { Diamond };
