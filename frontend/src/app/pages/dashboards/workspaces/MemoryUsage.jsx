// Local Imports
import { Card, Circlebar } from "components/ui";

// ----------------------------------------------------------------------

export function MemoryUsage() {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Circlebar
        value={65}
        size={12}
        strokeWidth={10}
        color="info"
        variant="soft"
      >
        <div className="text-xs">65%</div>
      </Circlebar>
      <div className="text-xs-plus font-medium text-gray-800 dark:text-dark-100">
        Memeory Usage
      </div>
    </Card>
  );
}
