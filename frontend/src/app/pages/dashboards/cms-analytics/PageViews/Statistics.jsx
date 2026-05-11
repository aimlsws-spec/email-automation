// Import Dependencies
import { useState } from "react";

// Local Imports
import { Combobox } from "components/shared/form/Combobox";

// ----------------------------------------------------------------------

const pages = [
  { id: 1, name: "Courses Page" },
  { id: 2, name: "Grammar Page" },
  { id: 3, name: "Jobs Page" },
  { id: 4, name: "Server Status Page" },
  { id: 5, name: "Sport Page" },
  { id: 6, name: "Travel Blog Page" },
];

export function Statistics() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);

  return (
    <div className="col-span-12 px-4 sm:col-span-6 sm:px-5 lg:col-span-4">
      <Combobox
        data={pages}
        displayField="name"
        value={selectedPage}
        onChange={setSelectedPage}
        placeholder="Please Select Post"
        searchFields={["name"]}
      />

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Total Views
          </p>
          <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
            695,454
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Monthly increase
          </p>
          <p className="mt-1">
            <span className="text-xl font-medium text-gray-800 dark:text-dark-100">
              16,146
            </span>{" "}
            <span className="text-xs text-success dark:text-success-lighter">
              +3%
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Post made
          </p>
          <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
            469
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Avg post view
          </p>
          <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
            1,559
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Total comments
          </p>
          <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
            198
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 dark:text-dark-300">
            Post Referred
          </p>
          <p className="mt-1 text-xl font-medium text-gray-800 dark:text-dark-100">
            49
          </p>
        </div>
      </div>
    </div>
  );
}
