// Import Dependencies
import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Card, Select } from "components/ui";

// ----------------------------------------------------------------------

const pages = [
  {
    uid: "6",
    name: "How Did We Get Here? The History of Music Told Through Tweets",
    visits: "4.1k",
    impression: 0.19,
  },
  {
    uid: "7",
    name: "10 Tips for Making a Good Camera Even Better",
    visits: "2.6k",
    impression: 0.01,
  },
  {
    uid: "8",
    name: "Food: A Simple Definition",
    visits: "1.5k",
    impression: 0.08,
  },
  {
    uid: "9",
    name: "10 Tips for Making a Good Camera Even Better",
    visits: "651",
    impression: -0.21,
  },
  {
    uid: "10",
    name: "25 Surprising Facts About Chair",
    visits: "322",
    impression: 0.06,
  },
];

export function Comments() {
  return (
    <Card className="px-4 pb-4">
      <div className="flex min-w-0 items-center justify-between gap-3 py-3">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Comments
        </h2>
        <Select className="h-8 text-xs">
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="last_year">Last Year</option>
        </Select>
      </div>
      <p>
        <span className="text-3xl font-medium text-gray-800 dark:text-dark-100">
          16.6k
        </span>{" "}
        <span className="text-xs text-success dark:text-success-lighter">
          +4.3%
        </span>
      </p>
      <p className="mt-0.5 text-xs-plus text-gray-400 dark:text-dark-300">
        Total Comments
      </p>
      <div className="mt-4 flex justify-between">
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          Page
        </p>
        <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
          comment
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
