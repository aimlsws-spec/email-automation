import { Box, Progress } from "components/ui";

export function Upgrade() {
  return (
    <Box className="mx-3 mt-3 rounded-lg bg-gray-100 p-3 px-2.5 py-2 dark:bg-dark-600">
      <div className="flex items-center justify-between">
        <p>
          <span className="font-medium text-gray-800 dark:text-dark-100">
            35GB
          </span>
          of 1TB
        </p>
        <a
          href="##"
          className="text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          Upgrade
        </a>
      </div>
      <div className="mt-3">
        <Progress value={35} color="primary" />
      </div>
    </Box>
  );
}
