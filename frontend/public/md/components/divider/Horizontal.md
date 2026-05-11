```jsx
import { Box } from "components/ui";

const Horizontal = () => {
  return (
    <div className="flex">
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
      {/* START: Divider */}
      <div className="mx-4 flex flex-col items-center space-y-3">
        <div className="w-px flex-1 bg-gray-200 dark:bg-dark-500" />
        <p>OR</p>
        <div className="w-px flex-1 bg-gray-200 dark:bg-dark-500" />
      </div>
      {/* END: Divider */}
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
    </div>
  );
};

export { Horizontal };

```