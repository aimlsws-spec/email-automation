// Local Imports
import { Card, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function Labels() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 items-center justify-between py-3">
        <h2 className="truncate text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Labels
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag component="button">Icon</Tag>
        <Tag component="button">UI/UX</Tag>
        <Tag component="button" color="primary">
          Tailwind
        </Tag>
        <Tag component="button">Bootstrap</Tag>
        <Tag component="button" color="primary">
          React
        </Tag>
        <Tag component="button">Alpine</Tag>
        <Tag component="button" color="primary">
          Desgin
        </Tag>
      </div>
    </Card>
  );
}
