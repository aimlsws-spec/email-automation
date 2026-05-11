// Import Dependencies
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Chart from "react-apexcharts";
import clsx from "clsx";

// Local Imports
import { Button, Card } from "components/ui";
import {
  injectStyles,
  insertStylesToHead,
  makeStyleTag,
  removeStylesFromHead,
} from "utils/dom/injectStylesToHead";
import { useIsomorphicEffect } from "hooks";

// ----------------------------------------------------------------------

const chartConfig = {
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  grid: {
    padding: {
      top: -16,
      bottom: 0,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      dataLabels: {
        hideOverflowingLabels: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    show: false,
  },
};

const series = [
  {
    data: [
      {
        x: "Analysis",
        y: [new Date("2019-02-27").getTime(), new Date("2019-03-04").getTime()],
        fillColor: "#008FFB",
      },
      {
        x: "Design",
        y: [new Date("2019-03-04").getTime(), new Date("2019-03-09").getTime()],
        fillColor: "#00E396",
      },
      {
        x: "Coding",
        y: [new Date("2019-03-07").getTime(), new Date("2019-03-10").getTime()],
        fillColor: "#775DD0",
      },
      {
        x: "Testing",
        y: [new Date("2019-03-08").getTime(), new Date("2019-03-12").getTime()],
        fillColor: "#FEB019",
      },
      {
        x: "Deployment",
        y: [new Date("2019-03-12").getTime(), new Date("2019-03-17").getTime()],
        fillColor: "#FF4560",
      },
    ],
  },
];

const css = `.course-schedule-chart .apexcharts-series path {
    clip-path: inset(5% 5% 5% 0 round 6px);
  }
`;

export function Timeline() {
  useIsomorphicEffect(() => {
    const sheet = makeStyleTag();

    injectStyles(sheet, css);
    insertStylesToHead(sheet);

    return () => removeStylesFromHead(sheet);
  }, []);

  return (
    <Card className="col-span-12 pb-3 lg:col-span-6">
      <div className="mt-3 flex min-w-0 items-center justify-between px-4 sm:px-5">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Courses Timeline
        </h2>
        <ActionMenu />
      </div>
      <div className="course-schedule-chart pr-2">
        <Chart
          options={chartConfig}
          series={series}
          type="rangeBar"
          height={200}
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
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
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
