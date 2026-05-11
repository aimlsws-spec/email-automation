// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function Technologies() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 items-center justify-between py-3">
        <h2 className="truncate text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Technologies
        </h2>
      </div>
      <div className="flex h-1.5 gap-1">
        <div className="w-4/12 rounded-full this:primary bg-this dark:bg-this-lighter"></div>
        <div className="w-3/12 rounded-full this:secondary bg-this dark:bg-this-lighter"></div>
        <div className="w-2/12 rounded-full this:info bg-this dark:bg-this-lighter"></div>
        <div className="w-2/12 rounded-full this:success bg-this dark:bg-this-lighter"></div>
        <div className="w-1/12 rounded-full this:error bg-this dark:bg-this-lighter"></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:primary size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Primary</span>
        </span>
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:secondary size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Secondary</span>
        </span>
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:info size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Info</span>
        </span>
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:success size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Success</span>
        </span>
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:warning size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Warning</span>
        </span>
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="this:error size-2 rounded-full bg-this dark:bg-this-lighter" />
          <span>Error</span>
        </span>
      </div>
    </Card>
  );
}
