// Import Dependencies
import Chart from "react-apexcharts";
import { ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Badge, Card } from "components/ui";

// ----------------------------------------------------------------------

const chartConfig = {
  colors: ["#ff5724"],

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
      opacityFrom: 0.35,
      opacityTo: 0.05,
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

const series = [
  {
    name: "Members",
    data: [65, 40, 60, 35, 56, 42],
  },
];

export function Members() {
  return (
    <Card className="overflow-hidden">
      <div className="mt-3.5 flex grow items-baseline justify-between px-4 sm:px-5">
        <div>
          <p className="font-medium">Members</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
            12k
          </p>
        </div>
        <Badge
          variant="soft"
          color="error"
          className="space-x-1 rounded-full "
        >
          <ArrowTrendingDownIcon className="size-3.5" />
          <span>16%</span>
        </Badge>{" "}
      </div>

      <div className="ax-transparent-gridline">
        <Chart series={series} type="area" height="150" options={chartConfig} />
      </div>
    </Card>
  );
}
