```jsx
import { Box } from "components/ui";

const Vertical = () => {
  return (
    <>
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
      {/* START: Divider */}
      <div className="my-4 flex items-center space-x-3 ">
        <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
        <p>OR</p>
        <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
      </div>
      {/* END: Divider */}
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
    </>
  );
};

export { Vertical };
```