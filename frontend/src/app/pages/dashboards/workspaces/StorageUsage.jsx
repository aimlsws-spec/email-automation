// Local Imports
import { Card, Circlebar } from "components/ui";

// ----------------------------------------------------------------------

export function StorageUsage() {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Circlebar
        value={45}
        size={12}
        strokeWidth={10}
        color="primary"
        variant="soft"
      >
        <div className="text-xs">45%</div>
      </Circlebar>
      <div className="text-xs-plus font-medium text-gray-800 dark:text-dark-100">
        Storage Usage
      </div>
    </Card>
  );
}
