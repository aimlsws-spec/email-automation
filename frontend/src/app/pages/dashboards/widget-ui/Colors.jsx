// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Colors() {
  return (
    <Card className="space-y-4 p-4 sm:p-5">
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-gray-200 bg-transparent dark:border-dark-400"></div>
        <p>Neutral Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-primary-600 bg-transparent dark:border-primary-400"></div>
        <p>Primary Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-secondary bg-transparent dark:border-secondary-light"></div>
        <p>Secondary Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-info bg-transparent dark:border-info-light"></div>
        <p>Info Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-success bg-transparent dark:border-success-light"></div>
        <p>Success Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-warning bg-transparent dark:border-warning-light"></div>
        <p>Warning Color</p>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="size-5 rounded-sm border-2 border-error bg-transparent dark:border-error-light"></div>
        <p>Error Color</p>
      </div>
    </Card>
  );
}
