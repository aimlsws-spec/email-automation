// Import Dependencies
import Chart from "react-apexcharts";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/20/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Box, Button, Progress } from "components/ui";
import { Delayed } from "components/shared/Delayed";

// ----------------------------------------------------------------------

const chart1config = {
  colors: ["#F7931A"],
  chart: {
    stacked: false,
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      left: 0,
      right: 0,
      top: -20,
      bottom: -8,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.1,
      stops: [20, 100, 100, 100],
    },
  },
  stroke: {
    width: 2,
  },
  tooltip: {
    shared: true,
  },
  legend: {
    show: false,
  },
  yaxis: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
};

const chart2config = {
  colors: ["#3AC5BC"],
  chart: {
    stacked: false,
    parentHeightOffset: 0,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      left: 0,
      right: 0,
      top: -20,
      bottom: -8,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.45,
      opacityTo: 0.1,
      stops: [20, 100, 100, 100],
    },
  },
  stroke: {
    width: 2,
  },
  tooltip: {
    shared: true,
  },
  legend: {
    show: false,
  },
  yaxis: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
};

export function Widgets() {
  const series1 = [
    {
      name: "Price",
      data: [20, 50, 30, 60, 33, 75],
    },
  ];

  const series2 = [
    {
      name: "Price",
      data: [654, 820, 102, 540, 154, 614],
    },
  ];

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 px-3">
        <Box className="rounded-lg bg-gray-100 px-2.5 py-2 dark:bg-dark-600">
          <div className="flex items-center justify-between space-x-1">
            <p>
              <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
                11.3
              </span>{" "}
              <span className="text-xs">hr</span>
            </p>
            <ClockIcon className="this:secondary size-4.5 text-this dark:text-this-light" />
          </div>
          <p className="mt-0.5 text-tiny-plus uppercase">Working Hours</p>
          <Progress
            isActive
            value={72}
            color="secondary"
            classNames={{
              bar: "h-1.5",
              root: "mt-4",
            }}
          />

          <div className="mt-1 flex items-center justify-between text-xs text-gray-400 dark:text-dark-300">
            <Button
              isIcon
              variant="flat"
              className="btn size-6 rounded-full ltr:-ml-1 rtl:-mr-1"
            >
              <Cog6ToothIcon className="size-4" />
            </Button>

            <span>71%</span>
          </div>
        </Box>

        <Box className="rounded-lg bg-gray-100 px-2.5 py-2 dark:bg-dark-600">
          <div className="flex items-center justify-between space-x-1">
            <p>
              <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
                11.3
              </span>{" "}
              <span className="text-xs">hr</span>
            </p>
            <CheckCircleIcon className="this:success size-4.5 text-this dark:text-this-light" />
          </div>
          <p className="mt-0.5 text-tiny-plus uppercase">Completed Task</p>
          <Progress
            value={34}
            color="success"
            classNames={{
              bar: "h-1.5",
              root: "mt-4",
            }}
          />

          <div className="mt-1 flex items-center justify-between text-xs text-gray-400 dark:text-dark-300">
            <Button
              isIcon
              variant="flat"
              className="btn size-6 rounded-full ltr:-ml-1 rtl:-mr-1"
            >
              <Cog6ToothIcon className="size-4" />
            </Button>

            <span>34%</span>
          </div>
        </Box>
      </div>

      <div className="mt-4 px-3">
        <h2 className="line-clamp-1 text-xs-plus font-medium tracking-wide text-dark-700 dark:text-gray-100">
          Stock Market
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Box className="rounded-lg bg-gray-100 p-2.5 dark:bg-dark-600">
            <div className="-mx-1 flex items-center gap-2">
              <img
                className="size-10"
                src="/images/logos/bitcoin.svg"
                alt="btc"
              />
              <div>
                <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  BTC
                </h2>
                <p className="text-xs">Bitcoin</p>
              </div>
            </div>
            <div className="ax-transparent-gridline h-[100px]">
              <Delayed>
                <Chart
                  series={series1}
                  type="area"
                  height="100"
                  options={chart1config}
                />
              </Delayed>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                60.33$
              </p>
              <p className="this:success text-xs font-medium tracking-wide text-this dark:text-this-light">
                +3.3%
              </p>
            </div>
          </Box>

          <Box className="rounded-lg bg-gray-100 p-2.5 dark:bg-dark-600">
            <div className="-mx-1 flex items-center gap-2">
              <img
                className="size-10"
                src="/images/logos/solana.svg"
                alt="btc"
              />
              <div>
                <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  SOL
                </h2>
                <p className="text-xs">Solana</p>
              </div>
            </div>
            <div className="ax-transparent-gridline h-[100px]">
              <Delayed>
                <Chart
                  series={series2}
                  type="area"
                  height="100"
                  options={chart2config}
                />
              </Delayed>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
                20.56$
              </p>
              <p className="this:success text-xs font-medium tracking-wide text-this dark:text-this-light">
                +4.11%
              </p>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
