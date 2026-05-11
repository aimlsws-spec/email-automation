```jsx
import { Box } from "components/ui";

const VerticalWithoutText = () => {
  return (
    <>
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
      {/* START: Divider */}
      <div className="my-4 h-px bg-gray-200 dark:bg-dark-500"></div>
      {/* END: Divider */}
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
    </>
  );
};

export { VerticalWithoutText };
```