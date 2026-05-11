// Import Dependencies
import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const series = [
  {
    name: "Sales",
    data: [654, 820, 102, 540, 154, 614],
  },
];

const chartConfig = {
  colors: ["#4467EF"],
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
    curve: "smooth",
    width: 3,
  },
  grid: {
    padding: {
      left: 0,
      right: 0,
      top: -20,
      bottom: -10,
    },
  },
  xaxis: {
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
};

export function Info() {
  return (
    <div className="mt-4 flex shrink-0 flex-col items-center sm:items-start">
      <ChartPieIcon className="this:info size-8 text-this dark:text-this-lighter" />
      <div className="mt-4">
        <div className="flex items-center gap-1">
          <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
            $6,556.55
          </p>
          <Button variant="flat" isIcon className="size-6 rounded-full">
            <ArrowPathIcon className="size-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 dark:text-dark-300">this month</p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="ax-transparent-gridline w-28">
          <Chart
            options={chartConfig}
            series={series}
            type="line"
            height={60}
          />
        </div>
        <div className="flex items-center gap-0.5">
          <ArrowUpIcon className="this:success size-4 text-this dark:text-this-lighter" />
          <p className="text-sm-plus text-gray-800 dark:text-dark-100">3.2%</p>
        </div>
      </div>
      <Button variant="outlined" className="mt-8 gap-2 rounded-full">
        <ArrowDownCircleIcon className="dark:text-navy-300 size-4.5 text-slate-400" />
        <span>Download Report</span>
      </Button>
    </div>
  );
}
