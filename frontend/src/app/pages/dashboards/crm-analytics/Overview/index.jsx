// Import Dependencies
import { Radio, RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";

// Local Imports
import { Box } from "components/ui";
import { Info } from "./Info";
import { SalesChart } from "./SalesChart";

// ----------------------------------------------------------------------

const salesData = {
  monthly: {
    series: [
      {
        name: "Sales",
        data: [45, 28, 50, 35, 55, 32, 60, 30, 45, 56, 50, 35, 45, 28, 50, 35],
      },
      {
        name: "Profit",
        data: [25, 14, 25, 20, 20, 12, 20, 15, 25, 14, 25, 20, 25, 14, 25, 20],
      },
    ],
    categories: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
  },
  yearly: {
    series: [
      {
        name: "Sales",
        data: [28, 45, 35, 50, 32, 55, 23, 60, 28, 45, 35, 50],
      },
      {
        name: "Profit",
        data: [14, 25, 20, 25, 12, 20, 15, 20, 14, 25, 20, 25],
      },
    ],
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};

export function Overview() {
  const [activeRange, setActiveRange] = useState("yearly");
  const series = salesData[activeRange].series;
  const categories = salesData[activeRange].categories;

  return (
    <Box className="col-span-12 lg:col-span-8">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Sales Overview
        </h2>
        <RadioGroup
          name="options"
          value={activeRange}
          onChange={setActiveRange}
          className="flex rounded-lg bg-gray-200 p-1 text-gray-600 dark:bg-dark-800 dark:text-dark-200"
        >
          <Radio
            value="monthly"
            className={({ checked }) =>
              clsx(
                "shrink-0 cursor-pointer rounded-lg px-3 py-1 text-xs-plus font-medium outline-hidden",
                checked
                  ? "bg-white shadow-sm dark:bg-dark-500 dark:text-gray-100"
                  : "hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
              )
            }
          >
            Last Month
          </Radio>
          <Radio
            value="yearly"
            className={({ checked }) =>
              clsx(
                "shrink-0 cursor-pointer rounded-lg px-3 py-1 text-xs-plus font-medium outline-hidden",
                checked
                  ? "bg-white shadow-sm dark:bg-dark-500 dark:text-gray-100"
                  : "hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
              )
            }
          >
            Last Year
          </Radio>
        </RadioGroup>
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-7">
        <Info />
        <SalesChart series={series} categories={categories} />
      </div>
    </Box>
  );
}
