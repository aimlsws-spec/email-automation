// Import Dependencies
import Chart from "react-apexcharts";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Badge, Box, Card } from "components/ui";

// ----------------------------------------------------------------------

const series = [
  {
    name: "Earning",
    data: [0, 20, 50, 10],
  },
];

const chartConfig = {
  colors: ["#fff"],
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
      top: -28,
    },
  },
  stroke: {
    width: 3,
    curve: "smooth",
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

function DollarCoin(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 155 155"
    >
      <path
        fill="#4A53E9"
        d="M.46 77a78.38 78.38 0 00.61 10.1 76.923 76.923 0 0055 64.16 77.48 77.48 0 0037.08 1.39 77.177 77.177 0 0049.28-34.2c.71-1.12 1.39-2.27 2.05-3.42a76.556 76.556 0 007.09-17.19c.56-2 1-4.1 1.44-6.2.44-2.1.71-4.23.93-6.4.26-2.5.393-5.03.4-7.59a76.116 76.116 0 00-.51-9.23 69.26 69.26 0 00-1-6.27A77.001 77.001 0 0086.29.89a75.738 75.738 0 00-8.58-.51 74.732 74.732 0 00-8.23.4c-2.16.21-4.3.53-6.4.93-2.1.4-4.17.87-6.21 1.43a76.124 76.124 0 00-17.19 7.1c-1.16.65-2.31 1.33-3.43 2a77.42 77.42 0 00-28.46 32.2 76 76 0 00-5.73 17.09A77.551 77.551 0 00.46 77z"
      ></path>
      <path
        fill="#fff"
        d="M.46 77a78.38 78.38 0 00.61 10.1 76.923 76.923 0 0055 64.16 77.48 77.48 0 0037.08 1.39 77.177 77.177 0 0049.28-34.2c.71-1.12 1.39-2.27 2.05-3.42a76.556 76.556 0 007.09-17.19c.56-2 1-4.1 1.44-6.2.44-2.1.71-4.23.93-6.4.26-2.5.393-5.03.4-7.59a76.116 76.116 0 00-.51-9.23 69.26 69.26 0 00-1-6.27A77.001 77.001 0 0086.29.89a75.738 75.738 0 00-8.58-.51 74.732 74.732 0 00-8.23.4c-2.16.21-4.3.53-6.4.93-2.1.4-4.17.87-6.21 1.43a76.124 76.124 0 00-17.19 7.1c-1.16.65-2.31 1.33-3.43 2a77.42 77.42 0 00-28.46 32.2 76 76 0 00-5.73 17.09A77.551 77.551 0 00.46 77z"
        opacity="0.1"
      ></path>
      <path
        fill="#000"
        d="M20.07 77.32a57.32 57.32 0 0057.34 57.33 57.338 57.338 0 0040.055-97.612A57.34 57.34 0 0077.41 19.98c-1.29 0-2.59 0-3.85.13a57.34 57.34 0 00-53.49 57.21z"
        opacity="0.4"
      ></path>
      <path
        fill="#4A53E9"
        d="M22.62 77.32c0 1 0 2 .08 2.92a54.771 54.771 0 0051 51.73l.75.05c1 0 1.94.08 2.92.08A54.72 54.72 0 00132 82c.14-1.55.2-3.11.2-4.7 0-1.59-.05-2.89-.16-4.31a53.143 53.143 0 00-1.4-8.73 54.875 54.875 0 00-40.2-40.16 53.175 53.175 0 00-8.73-1.4c-1.42-.11-2.86-.16-4.31-.16-1.23 0-2.46 0-3.67.12-.34 0-.68 0-1 .08a54.3 54.3 0 00-22.65 7.1 54.7 54.7 0 00-27.43 47.48h-.03z"
      ></path>
      <path
        fill="#000"
        d="M22.62 77.32c0 1 0 2 .08 2.92a54.771 54.771 0 0051 51.73l.75.05c1 0 1.94.08 2.92.08A54.72 54.72 0 00132 82c.14-1.55.2-3.11.2-4.7 0-1.59-.05-2.89-.16-4.31a53.143 53.143 0 00-1.4-8.73 54.875 54.875 0 00-40.2-40.16 53.175 53.175 0 00-8.73-1.4c-1.42-.11-2.86-.16-4.31-.16-1.23 0-2.46 0-3.67.12-.34 0-.68 0-1 .08a54.3 54.3 0 00-22.65 7.1 54.7 54.7 0 00-27.43 47.48h-.03z"
        opacity="0.5"
      ></path>
      <path
        fill="#4A53E9"
        d="M116 116.19A54.41 54.41 0 00132 82c.14-1.55.21-3.11.21-4.7 0-1.59-.06-2.89-.17-4.31a53.25 53.25 0 00-1.4-8.73 54.868 54.868 0 00-40.2-40.16 53.171 53.171 0 00-8.73-1.4c-1.42-.11-2.86-.16-4.31-.16-1.23 0-2.46 0-3.67.12-.34 0-.68 0-1 .08a54.3 54.3 0 00-22.65 7.1 55.11 55.11 0 00-6.86 4.75A54.462 54.462 0 0027.1 73.37c0 1 0 1.95.09 2.92a54.748 54.748 0 0051 51.73h.74a54.378 54.378 0 0037.06-11.92l.01.09z"
      ></path>
      <path
        fill="#000"
        d="M116 116.19A54.41 54.41 0 00132 82c.14-1.55.21-3.11.21-4.7 0-1.59-.06-2.89-.17-4.31a53.25 53.25 0 00-1.4-8.73 54.868 54.868 0 00-40.2-40.16 53.171 53.171 0 00-8.73-1.4c-1.42-.11-2.86-.16-4.31-.16-1.23 0-2.46 0-3.67.12-.34 0-.68 0-1 .08a54.3 54.3 0 00-22.65 7.1 55.11 55.11 0 00-6.86 4.75A54.462 54.462 0 0027.1 73.37c0 1 0 1.95.09 2.92a54.748 54.748 0 0051 51.73h.74a54.378 54.378 0 0037.06-11.92l.01.09z"
        opacity="0.25"
      ></path>
      <path
        fill="#4A53E9"
        d="M69.16 36.83l-.06 7.38s-7.59-1.34-16.24 5.49c-.36.29-.68.57-1 .85a16 16 0 00-5.52 12.55 16 16 0 005.6 12.64c.29.25.63.48.92.73l.09.09 1 .72c.302.214.616.411.94.59.126.084.256.16.39.23.237.164.488.308.75.43a43.798 43.798 0 006.8 2.92c1.15.4 2.34.76 3.53 1.09 1.72.49 3.44.94 5.08 1.36l2 .49c4.68 1.13 8.09 2.05 10.25 3.27a5.58 5.58 0 012.75 2.72 5.34 5.34 0 01.38 2c0 2.87-2.39 5.19-8.89 5-6.92-.26-10.81-3-11.74-7.22l-19 3.56c2.87 8.7 10.6 14.38 22.73 16.46v9.51l15.64.58v-9.51c6.57-.55 12-2.34 15.7-5.35l.1-.08a16.108 16.108 0 005.88-13.06c.06-12.53-9.89-17-20.54-19.92-9.95-2.67-18.8-3.33-18.78-9.42 0-3.8 3.48-5.38 8.6-5.2 8.17.29 11.35 5.11 12 8.61l20-3.63a21.844 21.844 0 00-2-5.15 20.783 20.783 0 00-6.15-6.85c-4.44-3.2-10.08-5-15.74-5.88v-9.54l-15.48-.86.01 2.4z"
      ></path>
      <path
        fill="#fff"
        d="M69.16 36.83l-.06 7.38s-7.59-1.34-16.24 5.49c-.36.29-.68.57-1 .85a16 16 0 00-5.52 12.55 16 16 0 005.6 12.64c.29.25.63.48.92.73l.09.09 1 .72c.302.214.616.411.94.59.126.084.256.16.39.23.237.164.488.308.75.43a43.798 43.798 0 006.8 2.92c1.15.4 2.34.76 3.53 1.09 1.72.49 3.44.94 5.08 1.36l2 .49c4.68 1.13 8.09 2.05 10.25 3.27a5.58 5.58 0 012.75 2.72 5.34 5.34 0 01.38 2c0 2.87-2.39 5.19-8.89 5-6.92-.26-10.81-3-11.74-7.22l-19 3.56c2.87 8.7 10.6 14.38 22.73 16.46v9.51l15.64.58v-9.51c6.57-.55 12-2.34 15.7-5.35l.1-.08a16.108 16.108 0 005.88-13.06c.06-12.53-9.89-17-20.54-19.92-9.95-2.67-18.8-3.33-18.78-9.42 0-3.8 3.48-5.38 8.6-5.2 8.17.29 11.35 5.11 12 8.61l20-3.63a21.844 21.844 0 00-2-5.15 20.783 20.783 0 00-6.15-6.85c-4.44-3.2-10.08-5-15.74-5.88v-9.54l-15.48-.86.01 2.4z"
        opacity="0.1"
      ></path>
    </svg>
  );
}

export function Statistics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
      <Box className="relative flex flex-col rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 px-5 pb-5">
        <div className="ax-transparent-gridline mt-5 w-1/2">
          <Chart
            type="line"
            height="60"
            series={series}
            options={chartConfig}
          />
        </div>
        <p className="mt-3 text-base font-medium tracking-wide text-white/80">
          Earnings
        </p>
        <p className="mt-4 text-2xl font-semibold">
          <span className="text-white/80">$</span>
          <span className="text-white">31.313</span>
        </p>
        <div className="mt-2">
          <Badge
            unstyled
            className="h-6 rounded-full bg-black/20 px-2 text-xs-plus text-white"
          >
            13 Members
          </Badge>
        </div>
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
          <DollarCoin className="w-24 translate-x-1/4 translate-y-1/4 opacity-50" />
        </div>
      </Box>
      <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <Card className="p-4.5">
          <div className="flex min-w-0 items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
                56
              </p>
              <p className="truncate text-xs-plus">Projects</p>
            </div>
            <Avatar
              size={10}
              initialColor="success"
              classNames={{ display: "mask is-star rounded-none" }}
            >
              <PresentationChartLineIcon className="size-5" />
            </Avatar>
          </div>
          <div className="mt-2">
            <Badge
              color="success"
              variant="soft"
              className="gap-1 rounded-full"
            >
              <span>10%</span>
              <ArrowTrendingUpIcon className="size-4" />
            </Badge>
          </div>
        </Card>
        <Card className="p-4.5">
          <div className="flex min-w-0 items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
                324
              </p>
              <p className="truncate text-xs-plus">Total hours</p>
            </div>
            <Avatar
              size={10}
              initialColor="info"
              classNames={{ display: "mask is-star rounded-none" }}
            >
              <ClockIcon className="size-5" />
            </Avatar>
          </div>
          <div className="mt-2">
            <Badge
              color="success"
              variant="soft"
              className="gap-1 rounded-full"
            >
              <span>6%</span>
              <ArrowTrendingUpIcon className="size-4" />
            </Badge>
          </div>
        </Card>
        <Card className="p-4.5">
          <div className="flex min-w-0 items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
                23
              </p>
              <p className="truncate text-xs-plus">Support Ticket</p>
            </div>
            <Avatar
              size={10}
              initialColor="secondary"
              classNames={{ display: "mask is-star rounded-none" }}
            >
              <TicketIcon className="size-5" />
            </Avatar>
          </div>
          <div className="mt-2">
            <Badge
              color="success"
              variant="soft"
              className="gap-1 rounded-full"
            >
              <span>9%</span>
              <ArrowTrendingUpIcon className="size-4" />
            </Badge>
          </div>
        </Card>
        <Card className="p-4.5">
          <div className="flex min-w-0 items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-dark-100">
                56
              </p>
              <p className="truncate text-xs-plus">Active Task</p>
            </div>
            <Avatar
              size={10}
              initialColor="warning"
              classNames={{ display: "mask is-star rounded-none" }}
            >
              <ShieldCheckIcon className="size-5" />
            </Avatar>
          </div>
          <div className="mt-2">
            <Badge color="error" variant="soft" className="gap-1 rounded-full">
              <span>2%</span>
              <ArrowTrendingDownIcon className="size-4" />
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
