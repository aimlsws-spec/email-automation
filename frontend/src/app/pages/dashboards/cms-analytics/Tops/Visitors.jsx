// Import Dependencies
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Card, Select } from "components/ui";

// ----------------------------------------------------------------------

const pages = [
  {
    uid: "1",
    name: "What is Tailwind CSS?",
    visits: "34.3k",
    impression: 0.19,
  },
  {
    uid: "2",
    name: "313 Pattern and Color ideas",
    visits: "23.1k",
    impression: 0.01,
  },
  {
    uid: "3",
    name: "NodeJS Design Patterns",
    visits: "17.1k",
    impression: 0.08,
  },
  {
    uid: "4",
    name: "Tailwind CSS Card Example",
    visits: "12.2k",
    impression: -0.21,
  },
  {
    uid: "5",
    name: "What is PHP?",
    visits: "5.3k",
    impression: 0.06,
  },
];

export function Visitors() {
  return (
    <Card className="px-4 pb-4">
      <div className="flex min-w-0 items-center justify-between gap-3 py-3">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Visitors
        </h2>
        <Select className="h-8 text-xs">
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="last_year">Last Year</option>
        </Select>
      </div>

      <p>
        <span className="text-3xl font-medium text-gray-800 dark:text-dark-100">
          236.33k
        </span>{" "}
        <span className="text-xs text-success dark:text-success-lighter">
          +3%
        </span>
      </p>
      <p className="mt-0.5 text-xs-plus text-gray-400 dark:text-dark-300">
        Total Views
      </p>
      <div className="mt-4 flex justify-between">
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          Page
        </p>
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          visits
        </p>
      </div>
      <div className="mt-2 space-y-2.5">
        {pages.map((page) => (
          <div key={page.uid} className="flex min-w-0 justify-between gap-4">
            <a href="##" className="truncate hover:underline hover:opacity-80">
              {page.name}
            </a>
            <div className="flex items-center gap-1.5">
              <p className="text-sm-plus text-gray-800 dark:text-dark-100">
                {page.visits}
              </p>
              {page.impression > 0 ? (
                <ArrowUpIcon className="this:success size-3 stroke-2 text-this dark:text-this-lighter" />
              ) : (
                <ArrowDownIcon className="this:error size-3 stroke-2 text-this dark:text-this-lighter" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
