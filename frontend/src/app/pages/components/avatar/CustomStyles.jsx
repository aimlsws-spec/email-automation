// Import Dependencies
import { FaEthereum, FaTwitter, FaUser } from "react-icons/fa";

// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

const CustomStyles = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Custom Brand Color */}
      <Avatar
        classNames={{ display: "bg-[#1C96E8]! text-white dark:text-white" }}
      >
        <FaTwitter className="size-5" />
      </Avatar>

      {/* Custom Tailwind CSS bordered (outlined) */}
      <Avatar
        name="John Doe"
        classNames={{
          display:
            "border bg-transparent text-base dark:border-dark-400 dark:bg-transparent",
        }}
      />

      {/* Custom Tailwind CSS gradient */}
      <Avatar
        classNames={{
          display:
            "rounded-xl bg-linear-to-br from-green-400 to-blue-600 text-white dark:text-white",
        }}
      >
        <FaUser />
      </Avatar>

      {/* Custom Tailwind CSS gradient */}
      <Avatar
        classNames={{
          display:
            "bg-linear-to-br from-amber-400 to-orange-600 text-white dark:text-white",
        }}
      >
        <FaUser />
      </Avatar>

      {/* Custom Tailwind CSS mask */}
      <Avatar
        classNames={{
          display: "mask is-hexagon rounded-none",
        }}
        initialColor="error"
      >
        <FaEthereum className="size-5" />
      </Avatar>

      {/* Custom Tailwind CSS Glowed */}
      <Avatar
        name="Emilie Doe"
        initialColor="auto"
        classNames={{
          display: "shadow-lg shadow-this/50 dark:shadow-this-light/50",
        }}
      />
    </div>
  );
};

export { CustomStyles };
