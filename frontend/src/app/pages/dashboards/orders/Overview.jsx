// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState } from "react";
import ReactApexChart from "react-apexcharts";

// Local Imports
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const data = {
  yearly: {
    series: [
      {
        name: "Orders",
        data: [28, 45, 35, 50, 32, 55, 23, 60, 28],
      },
      {
        name: "Completed Orders",
        data: [14, 25, 20, 25, 12, 20, 15, 20, 14],
      },
      {
        name: "Refunded Orders",
        data: [4, 5, 6, 5, 2, 5, 3, 6, 3],
      },
    ],
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  },
  monthly: {
    series: [
      {
        name: "Orders",
        data: [28, 45, 35, 50, 32, 55, 23, 60, 28, 42],
      },
      {
        name: "Completed Orders",
        data: [14, 25, 20, 25, 12, 20, 15, 20, 14, 21],
      },
      {
        name: "Refunded Orders",
        data: [4, 5, 6, 5, 2, 5, 3, 6, 3, 5],
      },
    ],
    categories: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28],
  },
};

const chartConfig = {
  colors: ["#4C4EE7", "#26E7A6", "#FF9800"],
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      barHeight: "90%",
      columnWidth: "35%",
    },
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    labels: {
      hideOverlappingLabels: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  grid: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  yaxis: {
    show: false,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 850,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "55%",
          },
        },
      },
    },
  ],
};

export function Overview() {
  const [focusRange, setfocusRange] = useState("monthly");
  const chartOptions = JSON.parse(JSON.stringify(chartConfig));
  chartOptions.xaxis.categories = data[focusRange].categories;

  return (
    <Card className="col-span-12 lg:col-span-8">
      <div className="flex flex-col justify-between px-4 pt-3 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-1 items-center justify-between space-x-2 sm:flex-initial ">
          <h2 className="text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
            Order Overview
          </h2>
          <ActionMenu />
        </div>
        <RadioGroup
          name="options"
          value={focusRange}
          onChange={setfocusRange}
          className="hidden gap-2 sm:flex"
        >
          <Radio as={Fragment} value="monthly">
            {({ checked }) => (
              <Button
                className="h-8 rounded-full text-xs"
                variant={checked ? "soft" : "flat"}
                color={checked ? "primary" : "neutral"}
              >
                Monthly
              </Button>
            )}
          </Radio>
          <Radio as={Fragment} value="yearly">
            {({ checked }) => (
              <Button
                className="h-8 rounded-full text-xs"
                variant={checked ? "soft" : "flat"}
                color={checked ? "primary" : "neutral"}
              >
                Yearly
              </Button>
            )}
          </Radio>
        </RadioGroup>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4 sm:mt-5 sm:grid-cols-4 sm:px-5 lg:mt-6">
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              $67.6k
            </p>
            <CurrencyDollarIcon className="this:secondary size-5 text-this dark:text-this-light" />
          </div>
          <p className="mt-1 text-xs-plus">Income</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              7.6k
            </p>
            <CheckBadgeIcon className="this:success size-5 text-this dark:text-this-light" />
          </div>
          <p className="mt-1 text-xs-plus">Completed</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              1.4k
            </p>
            <ArrowPathIcon className="this:primary size-5 text-this dark:text-this-light" />
          </div>
          <p className="mt-1 text-xs-plus">Processing</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-surface-3 2xl:p-4">
          <div className="flex justify-between space-x-1">
            <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
              345
            </p>
            <ClockIcon className="this:warning size-5 text-this dark:text-this-light" />
          </div>
          <p className="mt-1 text-xs-plus">Pending</p>
        </div>
      </div>

      <div className="ax-transparent-gridline mt-2 overflow-hidden px-2">
        <ReactApexChart
          options={chartOptions}
          series={data[focusRange].series}
          type="bar"
          height={270}
        />
      </div>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 sm:ltr:left-0 rtl:left-0 sm:rtl:right-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Another action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Other action</span>
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
