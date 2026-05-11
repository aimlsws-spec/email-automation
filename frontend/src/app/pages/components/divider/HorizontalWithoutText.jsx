import { Box } from "components/ui";

const HorizontalWithoutText = () => {
  return (
    <div className="flex">
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
      {/* START: Divider */}
      <div className="mx-4 my-1 w-px bg-gray-200 dark:bg-dark-500" />
      {/* END: Divider */}
      <Box className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-dark-500">
        <p className="text-xl">Content</p>
      </Box>
    </div>
  );
};

export { HorizontalWithoutText };
