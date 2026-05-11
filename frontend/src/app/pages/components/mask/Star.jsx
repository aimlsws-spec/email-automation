import { Avatar } from "components/ui";

const Star = () => {
  return (
    <div className="inline-space">
      <Avatar
        size={24}
        src="/images/avatar/avatar-5.jpg"
        classNames={{ display: "mask is-star rounded-none" }}
      />
      <Avatar
        size={24}
        src="/images/avatar/avatar-5.jpg"
        classNames={{ display: "mask is-star-2 rounded-none" }}
      />
    </div>
  );
};

export { Star };
