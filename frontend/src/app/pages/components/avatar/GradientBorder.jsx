import { Avatar } from "components/ui";

const GradientBorder = () => {
  return (
    <div className="inline-space">
      <div className="inline-flex size-16 rounded-full bg-linear-to-r from-sky-400 to-blue-600 p-0.5">
        <Avatar
          size={15}
          className="rounded-full bg-white p-[3px] dark:bg-dark-700"
          src="/images/avatar/avatar-16.jpg"
        />
      </div>

      <div className="inline-flex size-16 rounded-full bg-linear-to-r from-amber-400 to-orange-600 p-0.5">
        <Avatar
          size={15}
          className="rounded-full bg-white p-[3px] dark:bg-dark-700"
          src="/images/avatar/avatar-10.jpg"
        />
      </div>

      <div className="inline-flex size-16 rounded-full bg-linear-to-r from-pink-500 to-rose-500 p-0.5">
        <Avatar
          size={15}
          className="rounded-full bg-white p-[3px] dark:bg-dark-700"
          src="/images/avatar/avatar-20.jpg"
        />
      </div>

      <div className="inline-flex size-16 rounded-full bg-linear-to-r from-purple-500 to-orange-600 p-0.5">
        <Avatar
          size={15}
          className="rounded-full bg-white p-[3px] dark:bg-dark-700"
          src="/images/avatar/avatar-19.jpg"
        />
      </div>

      <div className="inline-flex size-16 rounded-full bg-linear-to-r from-green-400 to-fuchsia-400 p-0.5">
        <Avatar
          size={15}
          className="rounded-full bg-white p-[3px] dark:bg-dark-700"
          src="/images/avatar/avatar-18.jpg"
        />
      </div>
    </div>
  );
};

export { GradientBorder };
