```jsx
// Import Dependencies
import { FaUser } from "react-icons/fa";

// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

const Skeleton = () => {
  return (
    <div className="inline-space">
      <div className="flex animate-pulse flex-wrap -space-x-2 ">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Avatar
              key={i}
              size={8}
              classNames={{ initial: "ring ring-white dark:ring-dark-700" }}
            >
              <FaUser className="size-3" />
            </Avatar>
          ))}
      </div>
    </div>
  );
};

export { Skeleton };

```